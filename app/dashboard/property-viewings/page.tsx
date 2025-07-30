"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "../components/property-card";
import dynamic from "next/dynamic";
const FeedbackModal = dynamic(() => import("../components/modals/feedback-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { motion } from "framer-motion";
import {
  useGetAllInvites,
  useUpdateInvite
} from "@/services/application/applicationFn";
import { InviteData, InviteResponse, Landlord } from "./type";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { PropertyCardSkeleton, SectionSkeleton } from "./SkeletonLoaders";
import { displayImages } from "@/app/property/[id]/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  date?: string;
  time?: string;
  landlord?: Landlord;
}

type SectionType = 'pending' | 'scheduled' | 'feedback' | 'completed';

export default function PropertyViewingsPage() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    propertyId: string;
    applicantInviteId: string;
    scheduleDate: string;
    images: string[];
    name: string;
    address: string;
    rentalFee: number;
    propertysize: number;
    noBedRoom: number;
    noBathRoom: number;
  } | null>(null);
  
  const [expandedSections, setExpandedSections] = useState<Set<SectionType>>(new Set(['pending']));
  
  const { data: invites, isFetching: isFetchingInvites, refetch: refetchInvites, error } = useGetAllInvites();
  
  // Access the data directly from the response (not nested under invites.invites)
  const invitesData = invites as any;

  const acceptedInvites = invitesData?.acceptInvites;
  const rejectedInvites = invitesData?.rejectedInvites;
  const approvedInvites = invitesData?.approvedinvites;
  const allCompletedInvites = invitesData?.otherInvites;
  const rescheduledInvites = invitesData?.rescheduledInvites;
  const pendingInvites = invitesData?.pendingInvites;
  const feedbackInvites = invitesData?.awaitingFeedbackInvites;
  const searchParams = useSearchParams();
  const { mutate: updateInvite, isPending: isUpdatingInvite } =
    useUpdateInvite();

  useEffect(() => {
    if (typeof document !== 'undefined' && searchParams.get("#feedback")) {
      const feedbackSection = document.getElementById("feedback-section");
      feedbackSection?.scrollIntoView({ behavior: "smooth" });
      setExpandedSections(prev => new Set([...prev, 'feedback']));
    }
  }, []);

  const toggleSection = (section: SectionType) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleAcceptInvite = (invitationId: string) => {
    updateInvite({
      id: invitationId,
      data: {
        response: "ACCEPTED"
      }
    }, {
      onSettled: () => {
        refetchInvites();
      }
    });
  };

  const handleFeedbackClick = (data: {
    propertyId: string;
    applicantInviteId: string;
    scheduleDate: string;
    images: string[];
    name: string;
    address: string;
    rentalFee: number;
    propertysize: number;
    noBedRoom: number;
    noBathRoom: number;
  }) => {
    setIsFeedbackModalOpen(true);
    setSelectedProperty(data);
  };

  const EmptyState = ({
    title,
    description
  }: {
    title: string;
    description: string;
  }) => (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <Button className="bg-red-600 hover:bg-red-700 text-white">
        Browse properties
      </Button>
    </div>
  );

  const SectionHeader = ({ 
    title, 
    count, 
    section, 
    isExpanded 
  }: { 
    title: string; 
    count: number; 
    section: SectionType; 
    isExpanded: boolean;
  }) => (
    <div 
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </div>
  );

  if (isFetchingInvites) {
    return (
      <div className="layout">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Skeleton className="h-4 w-16" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-64 mb-8" /> {/* Page title skeleton */}
        {/* Viewing invites section skeleton */}
        <SectionSkeleton />
        {/* Scheduled viewings section skeleton */}
        <SectionSkeleton />
        {/* Feedback section skeleton */}
        <SectionSkeleton />
      </div>
    );
  }

  // Show error if API call failed
  if (error) {
    return (
      <div className="layout">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property viewings</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Property viewings</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">API Error</h2>
          <p className="text-red-700 mb-2">Failed to load property viewings data.</p>
          <pre className="bg-red-100 p-3 rounded text-sm text-red-800 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
          <Button 
            onClick={() => refetchInvites()} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Property viewings</span>
      </div>

      <h1 className="text-3xl font-bold">Property viewings</h1>
      <section className="mb-12">
        <SectionHeader
          title="Pending Invites"
          count={pendingInvites?.length || 0}
          section="pending"
          isExpanded={expandedSections.has('pending')}
        />
                 {expandedSections.has('pending') && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
             {pendingInvites?.map((property: any) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {isUpdatingInvite ? (
                  <PropertyCardSkeleton />
                ) : (
                  <PropertyCard
                    {...property}
                    property={property as any}
                    viewType="invite"
                    viewLink={`/dashboard/property-viewings/${property?.id}/?schedule_date=${property?.scheduleDate}&invitationId=${property?.id}`}
                    isInvite
                    onAcceptInvite={() =>
                      handleAcceptInvite(property?.id as string)
                    }
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Scheduled Viewings"
          count={acceptedInvites?.length || 0}
          section="scheduled"
          isExpanded={expandedSections.has('scheduled')}
        />
        {expandedSections.has('scheduled') && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {acceptedInvites.map((property: any) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PropertyCard
                  {...property}
                  property={property as any}
                  viewType="schedule"
                  viewLink={`/dashboard/property-viewings/${property?.id}/?schedule_date=${property?.scheduleDate}&invitationId=${property?.id}`}
                  isScheduled
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section id="feedback-section">
        <SectionHeader
          title="What did you think?"
          count={feedbackInvites?.length || 0}
          section="feedback"
          isExpanded={expandedSections.has('feedback')}
        />
                 {expandedSections.has('feedback') && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
             {feedbackInvites.map((property: any) => {
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PropertyCard
                    {...property}
                    viewType="property"
                    property={property as any}
                    showFeedback
                    onFeedbackClick={() =>
                      handleFeedbackClick({
                        propertyId: property?.properties?.id,
                        applicantInviteId: property?.id,
                        scheduleDate: property?.scheduleDate,
                        images: displayImages(property?.properties?.images),
                        name: property?.properties?.name,
                        address: property?.properties?.location,
                        rentalFee: property?.properties?.rentalFee as any || property?.properties?.price as any,
                        propertysize: property?.properties?.propertysize,
                        noBedRoom: property?.properties?.bedrooms,
                        noBathRoom: property?.properties?.bathrooms
                      })
                    }
                    showViewProperty
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Recent Viewings"
          count={allCompletedInvites?.length || 0}
          section="completed"
          isExpanded={expandedSections.has('completed')}
        />
                 {expandedSections.has('completed') && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
             {allCompletedInvites.map((property: any) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PropertyCard
                  {...property}
                  property={property as any}
                  viewType="schedule"
                  viewLink={`/dashboard/property-viewings/${property.id}`}
                  isScheduled
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      {selectedProperty && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          data={selectedProperty as any}
          // onComplete={() => {
          //   setIsFeedbackModalOpen(false);
          //   invites?.refetch();
          // }}
        />
      )}
    </div>
  );
}
