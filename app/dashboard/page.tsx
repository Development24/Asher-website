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
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/services/application/applicationFn";
import { ApplicationsStats, Enquiry, Property, PropertyInvite } from "./type";
import { format } from "date-fns";
import { Calendar, MessageSquare } from "lucide-react";
import { SavedPropertiesSection } from './components/sections/saved-properties-section';
import { userStore } from "@/store/userStore";
import { useGetProfile } from "@/services/auth/authFn";

export default function DashboardPage() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  // Get user data from store and API
  const user = userStore((state) => state.user);
  const { data: profileData, isFetching: isFetchingProfile } = useGetProfile();
  
  const userProfile = profileData?.user || user;
  const userName = userProfile?.profile?.firstName || userProfile?.profile?.fullname || null;

  const { data: dashboardStats, isFetching: isFetchingDashboardStats } =
    useDashboardStats();

  const dashboardData = dashboardStats?.stats;
  const applicationsStats = dashboardData?.applications as ApplicationsStats;
  const recentFeedback = dashboardData?.recentFeedback as Enquiry[];
  const recentInvites = dashboardData?.recentInvites as PropertyInvite[];
  const recentSavedProperties =
    dashboardData?.recentSavedProperties as PropertyInvite[];
  const scheduledInvites = dashboardData?.scheduledInvite as PropertyInvite;

  // Find the next upcoming viewing from all accepted invites
  const findNextViewing = () => {
    // Check scheduled invites first
    if (scheduledInvites?.scheduleDate) {
      const scheduleDate = new Date(scheduledInvites.scheduleDate);
      if (scheduleDate > new Date()) {
        return scheduledInvites;
      }
    }

    // Check recent invites for accepted ones with upcoming dates
    if (recentInvites?.length > 0) {
      const acceptedInvites = recentInvites.filter(invite => 
        (invite.response === "ACCEPTED" || invite.response === "RESCHEDULED_ACCEPTED") &&
        invite.scheduleDate
      );

      if (acceptedInvites.length > 0) {
        // Find the nearest upcoming viewing
        const upcomingViewings = acceptedInvites
          .map(invite => ({
            ...invite,
            viewingDate: new Date(invite.reScheduleDate || invite.scheduleDate)
          }))
          .filter(invite => invite.viewingDate > new Date())
          .sort((a, b) => a.viewingDate.getTime() - b.viewingDate.getTime());

        return upcomingViewings[0] || null;
      }
    }

    return null;
  };

  const nextViewing = findNextViewing();

  // Be conservative with application counts - only show what the API explicitly provides
  // Don't confuse viewing invites with actual applications
  const actualActiveApplications = (applicationsStats?.activeApplications !== undefined && applicationsStats?.activeApplications >= 0) 
    ? applicationsStats.activeApplications 
    : 0;
  const actualCompletedApplications = (applicationsStats?.completedApplications !== undefined && applicationsStats?.completedApplications >= 0)
    ? applicationsStats.completedApplications 
    : 0;

  // Only format dates if nextViewing exists and has a valid date
  const viewingDate = nextViewing?.reScheduleDate || nextViewing?.scheduleDate;
  const formattedDate = viewingDate 
    ? format(new Date(viewingDate), "dd MMMM, yyyy")
    : undefined;

  const formattedTime = viewingDate
    ? format(new Date(viewingDate), "HH:mm")
    : undefined;

  // Generate notifications from real data
  const generateNotifications = () => {
    const notifications = [];
    
    // Add notification for recent applications - use real timestamp from API if available
    if (actualActiveApplications > 0) {
      notifications.push({
        id: 1,
        message: `You have ${actualActiveApplications} active application${actualActiveApplications > 1 ? 's' : ''} pending review.`,
        timestamp: dashboardData?.lastUpdated ? new Date(dashboardData.lastUpdated) : new Date()
      });
    }

    // Add notification for scheduled viewings - use real schedule date
    if (nextViewing) {
      notifications.push({
        id: 2,
        message: `You have an upcoming property viewing scheduled for ${formattedDate} at ${formattedTime}.`,
        timestamp: new Date(viewingDate!)
      });
    }

    // Add notification for pending feedback - use real timestamp from API if available
    if (recentFeedback?.length > 0) {
      const latestFeedbackDate = recentFeedback[0]?.createdAt ? new Date(recentFeedback[0].createdAt) : new Date();
      notifications.push({
        id: 3,
        message: `You have ${recentFeedback.length} propert${recentFeedback.length > 1 ? 'ies' : 'y'} waiting for your feedback.`,
        timestamp: latestFeedbackDate
      });
    }

    // Add notification for recent invites - use real timestamp from API if available
    if (recentInvites?.length > 0) {
      const latestInviteDate = recentInvites[0]?.createdAt ? new Date(recentInvites[0].createdAt) : new Date();
      notifications.push({
        id: 4,
        message: `You have ${recentInvites.length} new viewing invitation${recentInvites.length > 1 ? 's' : ''} to respond to.`,
        timestamp: latestInviteDate
      });
    }

    // Return only real notifications - no fallback mock data
    return notifications;
  };

  const notifications = generateNotifications();

  const handleFeedbackClick = (property: any) => {
    setSelectedProperty(property);
    setShowFeedbackModal(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {userName ? `Welcome back, ${userName}!` : "Welcome to your Dashboard!"}
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your property search</p>
      </div>
      
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
                    viewLink={`/dashboard/property-viewings/${property.id}?schedule_date=${property.scheduleDate}&invitationId=${property.id}`}
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
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link href="/dashboard/activity-log" className="text-sm text-primary-700 hover:text-primary-800">
                View all
              </Link>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
                  <p className="text-muted-foreground mb-4">
                    View your completed feedback, scheduled viewings, and application progress.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/activity-log">View Activity Log</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <SavedPropertiesSection 
            isLoading={isFetchingDashboardStats}
            savedProperties={recentSavedProperties}
          />
        </div>
        
        <div className="space-y-6">
          {isFetchingDashboardStats || isFetchingProfile ? (
            <>
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[300px] rounded-lg" />
              <Skeleton className="h-[200px] rounded-lg" />
            </>
          ) : (
            <>
              <ApplicationCard
                activeApplications={actualActiveApplications}
                completedApplications={actualCompletedApplications}
              />
              {nextViewing ? (
                <ViewingCard
                  image={nextViewing?.properties?.images[0]}
                  title={nextViewing?.properties?.name}
                  price={nextViewing?.properties?.rentalFee}
                  location={nextViewing?.properties?.location}
                  date={formattedDate || ""}
                  time={formattedTime || ""}
                  beds={nextViewing?.properties?.noBedRoom}
                  baths={nextViewing?.properties?.noBathRoom}
                  propertyId={nextViewing?.properties?.id}
                  inviteId={nextViewing?.id}
                />
              ) : (
                <Link href="/dashboard/property-viewings">
                  <div className="rounded-lg border bg-card p-6 text-card-foreground hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-sm font-medium">No upcoming viewings</h3>
                      <p className="text-xs text-muted-foreground mt-1">Click to view all viewings</p>
                    </div>
                  </div>
                </Link>
              )}
              {notifications.length > 0 && (
                <NotificationCard notifications={notifications} />
              )}
            </>
          )}
        </div>
      </div>

      {selectedProperty && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          data={selectedProperty}
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
