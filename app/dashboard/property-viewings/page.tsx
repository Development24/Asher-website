"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "../components/property-card";
import { FeedbackModal } from "../components/modals/feedback-modal";
import { motion } from "framer-motion";
import {
  useGetAllInvites,
  useUpdateInvite
} from "@/services/application/applicationFn";
import { InviteData, InviteResponse, Landlord } from "./type";
import { Skeleton } from "@/components/ui/skeleton";

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

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="w-full h-48" /> {/* Image skeleton */}
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" /> {/* Title skeleton */}
        <Skeleton className="h-4 w-1/2" /> {/* Price skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-full" /> {/* Button skeleton */}
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ count = 3 }) {
  return (
    <section className="mb-12">
      <Skeleton className="h-8 w-48 mb-4" /> {/* Section title skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
      </div>
    </section>
  );
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
  const { data: invites, isFetching: isFetchingInvites } = useGetAllInvites();
  const invitesData = invites as InviteResponse;
  console.log(invitesData);

  const acceptedInvites = invitesData?.acceptInvites;
  const rejectedInvites = invitesData?.rejectedInvites;
  const rescheduledInvites = invitesData?.rescheduledInvites;
  const pendingInvites = invitesData?.pendingInvites;
  const feedbackInvites = invitesData?.awaitingFeedbackInvites;

  const { mutate: updateInvite, isPending: isUpdatingInvite } =
    useUpdateInvite();

  const handleAcceptInvite = (invitationId: string) => {
    updateInvite({
      id: invitationId,
      data: {
        response: "ACCEPTED"
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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      <section>
        <h2 className="text-2xl font-semibold mb-4">What did you think?</h2>
        <p className="text-gray-500 mb-6">
          Leave feedback on your recently viewed properties.
        </p>
        {feedbackInvites?.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        images: property?.properties?.images,
                        name: property?.properties?.name,
                        address: property?.properties?.location,
                        rentalFee: property?.properties?.rentalFee as any,
                        propertysize: property?.properties?.propertysize,
                        noBedRoom: property?.properties?.noBedRoom,
                        noBathRoom: property?.properties?.noBathRoom
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
        {rejectedInvites?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedInvites.map((property) => (
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
                  viewLink={`/dashboard/property-viewings/${property.id}/accepted`}
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
