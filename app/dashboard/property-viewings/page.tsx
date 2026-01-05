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
    <div className="py-12 text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-gray-500">{description}</p>
      <Button className="text-white bg-red-600 hover:bg-red-700">
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
      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg transition-colors cursor-pointer hover:bg-gray-100"
      onClick={() => toggleSection(section)}
    >
      <div className="flex gap-3 items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </div>
  );

  if (isFetchingInvites) {
    return (
      <div className="layout">
        <div className="flex gap-2 items-center mb-6 text-sm">
          <Skeleton className="w-16 h-4" />
          <span className="text-gray-400">/</span>
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="mb-8 w-64 h-10" /> {/* Page title skeleton */}
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
        <div className="flex gap-2 items-center mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property viewings</span>
        </div>
        <h1 className="mb-8 text-3xl font-bold">Property viewings</h1>
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="mb-2 text-lg font-semibold text-red-800">API Error</h2>
          <p className="mb-2 text-red-700">Failed to load property viewings data.</p>
          <pre className="overflow-auto p-3 text-sm text-red-800 bg-red-100 rounded">
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
      <div className="flex gap-2 items-center text-sm">
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
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
             {pendingInvites?.map((invite: any) => {
              // Use normalized listing if available (from backend), otherwise fallback to property
              const listing = invite?.listing || null;
              const propertyData = invite?.property || invite?.properties || null;
              
              // Pass listing object if available, otherwise pass property data
              const propertyToDisplay = listing || propertyData;
              
              return (
                <motion.div
                  key={invite.inviteId || invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {isUpdatingInvite ? (
                    <PropertyCardSkeleton />
                  ) : (
                    <PropertyCard
                      property={propertyToDisplay}
                      viewType="invite"
                      viewLink={`/dashboard/property-viewings/${invite?.inviteId || invite?.id}/?schedule_date=${invite?.scheduleDate}&invitationId=${invite?.inviteId || invite?.id}`}
                      isInvite
                      onAcceptInvite={() =>
                        handleAcceptInvite(invite?.inviteId || invite?.id as string)
                      }
                    />
                  )}
                </motion.div>
              );
            })}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {acceptedInvites.map((invite: any) => {
              const listing = invite?.listing || null;
              const propertyData = invite?.property || invite?.properties || null;
              
              return (
                <motion.div
                  key={invite.inviteId || invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PropertyCard
                    property={listing || propertyData}
                    viewType="schedule"
                    viewLink={`/dashboard/property-viewings/${invite?.inviteId || invite?.id}/?schedule_date=${invite?.scheduleDate}&invitationId=${invite?.inviteId || invite?.id}`}
                    isScheduled
                  />
                </motion.div>
              );
            })}
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
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
             {feedbackInvites.map((invite: any) => {
              const listing = invite?.listing || null;
              const propertyData = invite?.property || invite?.properties || null;
              
              return (
                <motion.div
                  key={invite.inviteId || invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PropertyCard
                    property={listing || propertyData}
                    viewType="property"
                    showFeedback
                    onFeedbackClick={() => {
                      // Extract data from normalized listing or fallback to property
                      const images = listing?.listingEntity?.images?.length > 0 
                        ? listing.listingEntity.images 
                        : listing?.property?.images || propertyData?.images || [];
                      const name = listing?.listingEntity?.name || propertyData?.name || '';
                      const address = listing?.property?.address || propertyData?.address || '';
                      const price = listing?.price || propertyData?.price || propertyData?.rentalFee || '0';
                      const bedrooms = listing?.specification?.residential?.bedrooms || listing?.property?.bedrooms || propertyData?.bedrooms || 0;
                      const bathrooms = listing?.specification?.residential?.bathrooms || listing?.property?.bathrooms || propertyData?.bathrooms || 0;
                      
                      handleFeedbackClick({
                        propertyId: propertyData?.id || invite?.propertiesId,
                        applicantInviteId: invite?.inviteId || invite?.id,
                        scheduleDate: invite?.scheduleDate,
                        images: displayImages(images),
                        name: name,
                        address: address,
                        rentalFee: Number(price),
                        propertysize: listing?.specification?.residential?.totalArea ? Number(listing.specification.residential.totalArea) : (propertyData?.propertySize ? Number(propertyData.propertySize) : 0),
                        noBedRoom: bedrooms,
                        noBathRoom: bathrooms
                      });
                    }}
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
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
             {allCompletedInvites.map((invite: any) => {
              const listing = invite?.listing || null;
              const propertyData = invite?.property || invite?.properties || null;
              
              return (
                <motion.div
                  key={invite.inviteId || invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PropertyCard
                    property={listing || propertyData}
                    viewType="schedule"
                    viewLink={`/dashboard/property-viewings/${invite?.inviteId || invite?.id}`}
                    isScheduled
                  />
                </motion.div>
              );
            })}
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
