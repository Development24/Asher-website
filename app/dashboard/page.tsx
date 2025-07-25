"use client";

import { useState } from "react";
import { PropertyCard } from "./components/property-card";
import { ApplicationCard } from "./components/application-card";
import { ViewingCard } from "./components/viewing-card";
import { NotificationCard } from "./components/notification-card";
import dynamic from "next/dynamic";
const FeedbackModal = dynamic(() => import("./components/modals/feedback-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetUserLikedProperties } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useDashboardStats } from "@/services/application/applicationFn";
import { ApplicationsStats, Enquiry, Property, PropertyInvite } from "./type";
import { format } from "date-fns";
import { Calendar, MessageSquare } from "lucide-react";
import { SavedPropertiesSection } from './components/sections/saved-properties-section';
import { useGetAllFeedback } from '../../services/property/propertyFn';

export default function DashboardPage() {
  const [userEmail] = useState("simoncaldwell@gmail.com");
  const [userName] = useState("Simon");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const {data: logs, isFetching: isFetchingLogs} = useGetAllFeedback();

  console.log(logs);

  const { data: dashboardStats, isFetching: isFetchingDashboardStats } =
    useDashboardStats();
  // console.log(dashboardStats);

  const dashboardData = dashboardStats?.stats;
  const applicationsStats = dashboardData?.applications as ApplicationsStats;
  const recentFeedback = dashboardData?.recentFeedback as Enquiry[];
  const recentInvites = dashboardData?.recentInvites as PropertyInvite[];
  const recentSavedProperties =
    dashboardData?.recentSavedProperties as PropertyInvite[];
  const scheduledInvites = dashboardData?.scheduledInvite as PropertyInvite;

  // Only format dates if scheduledInvites exists and has a valid date
  const formattedDate = scheduledInvites?.scheduleDate 
    ? format(new Date(scheduledInvites.scheduleDate.toString()), "dd MMMM, yyyy")
    : undefined;

  const formattedTime = scheduledInvites?.scheduleDate
    ? format(new Date(scheduledInvites.scheduleDate.toString()), "HH:mm")
    : undefined;


  const notifications = [
    {
      id: 1,
      message: "Your application for Elmwood Estate was reviewed.",
      timestamp: new Date()
    },
    {
      id: 2,
      message: "Agent replied to your inquiry about Parkview Residence.",
      timestamp: new Date()
    }
  ];

  const handleFeedbackClick = (property: any) => {
    setSelectedProperty(property);
    setShowFeedbackModal(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Viewing invites</h2>
              <Link href="/dashboard/property-viewings" className="text-sm text-primary-700 hover:text-primary-800">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {isFetchingDashboardStats ? (
                <>
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                </>
              ) : recentInvites?.length > 0 ? (
                recentInvites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    isInvite
                    property={property as any}
                    showViewProperty
                  />
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No viewing invites</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    You don't have any property viewing invites at the moment.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/search">Browse Properties</Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Leave feedback on these properties</h2>
              <Link href="/dashboard/property-viewings" className="text-sm text-primary-700 hover:text-primary-800">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {isFetchingDashboardStats ? (
                <>
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                </>
              ) : recentFeedback?.length > 0 ? (
                recentFeedback.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    property={property as any}
                    showFeedback
                    onFeedbackClick={() => handleFeedbackClick(property)}
                  />
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No feedback required</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    You don't have any properties to provide feedback for at the moment.
                  </p>
                </div>
              )}
            </div>
          </section>

          <SavedPropertiesSection 
            isLoading={isFetchingDashboardStats}
            savedProperties={recentSavedProperties}
          />
        </div>
        
        <div className="space-y-6">
          {isFetchingDashboardStats ? (
            <>
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[300px] rounded-lg" />
              <Skeleton className="h-[200px] rounded-lg" />
            </>
          ) : (
            <>
              <ApplicationCard
                activeApplications={applicationsStats?.activeApplications}
                completedApplications={applicationsStats?.completedApplications}
              />
              {scheduledInvites ? (
                <ViewingCard
                  image={scheduledInvites?.properties?.images[0]}
                  title={scheduledInvites?.properties?.name}
                  price={scheduledInvites?.properties?.rentalFee}
                  location={scheduledInvites?.properties?.location}
                  date={formattedDate || ""}
                  time={formattedTime || ""}
                  beds={scheduledInvites?.properties?.noBedRoom}
                  baths={scheduledInvites?.properties?.noBathRoom}
                />
              ) : (
                <div className="rounded-lg border bg-card p-6 text-card-foreground">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium">No upcoming viewings</h3>
                  </div>
                </div>
              )}
              <NotificationCard notifications={notifications} />
            </>
          )}
        </div>
      </div>

      {selectedProperty && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          property={selectedProperty}
        />
      )}
    </div>
  );
}

const PropertyCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);
