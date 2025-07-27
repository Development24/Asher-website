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
  const { data: invites, isFetching: isFetchingInvites, refetch: refetchInvites } = useGetAllInvites();
  const invitesData = invites?.invites as any;
  // console.log(invitesData);

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
    }
  }, []);

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
    console.log("data", data);
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
      {/* <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Viewing invites</h2>
        {acceptedInvites?.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {acceptedInvites?.map((property) => (
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
                    viewLink={`/dashboard/property-viewings/${property?.id}?schedule_date=${property?.scheduleDate}&invitationId=${property?.id}`}
                    isInvite
                    onAcceptInvite={() =>
                      handleAcceptInvite(property?.id as string)
                    }
                  />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Viewing Invites"
            description="You haven't been invited to any property viewings yet. Check back later or browse available listings to apply for a property."
          />
        )}
      </section> */}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pending Invites</h2>
        {pendingInvites?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {pendingInvites?.map((property) => (
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
        ) : (
          <EmptyState
            title="No Viewing Invites"
            description="You haven't been invited to any property viewings yet. Check back later or browse available listings to apply for a property."
          />
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Scheduled viewings</h2>
        {acceptedInvites?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {acceptedInvites.map((property) => (
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
        ) : (
          <EmptyState
            title="No Viewings Scheduled"
            description="You don't have any property viewings scheduled yet. Check back later or browse available listings to apply for a property."
          />
        )}
      </section>

      <section id="feedback-section">
        <h2 className="text-2xl font-semibold mb-4">What did you think?</h2>
        <p className="text-gray-500 mb-6">
          Leave feedback on your recently viewed properties.
        </p>
        {feedbackInvites?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {feedbackInvites.map((property) => {
              // console.log(property);
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
        ) : (
          <EmptyState
            title="No Properties to Review"
            description="You haven't viewed any properties recently. Check back after your next viewing to leave feedback."
          />
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Viewings</h2>
        {allCompletedInvites?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {allCompletedInvites.map((property) => (
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
        ) : (
          <EmptyState
            title="No Viewings Scheduled"
            description="You don't have any property viewings scheduled yet. Check back later or browse available listings to apply for a property."
          />
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
