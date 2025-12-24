"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplicationForm } from "@/contexts/application-form-context";
import { useMilestonesApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { Bath, Bed, Check, MapPin } from "lucide-react";
import { FormattedPrice } from "@/components/FormattedPrice";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const FeedbackModal = dynamic(() => import("@/app/dashboard/components/modals/feedback-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { completedStep } from "../../components/ApplicationCard";
// formatPrice removed - using FormattedPrice component instead
import { format } from "date-fns";
import { useReuseAbleStore } from "@/store/reuseAble";

interface Milestone {
  title: string;
  date: string;
  description: string;
  completed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
  specs: {
    size: string;
    beds: number;
    baths: number;
  };
  completionStatus: number;
  description: string;
}

interface MileStoneData {
  id: string;
  subjects: string | null;
  viewAgain: string | null;
  considerRenting: string | null;
  events: string;
  type: string;
  status: string | null;
  createdAt: string;
  propertyId: string;
  applicationId: string;
  transactionId: string | null;
  createdById: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
// First, let's create a MilestoneSkeleton component using Shadcn's Skeleton
const MilestoneSkeleton = () => (
  <div className="flex gap-4 mb-8">
    <div className="relative">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
    </div>
    <div className="flex-1 pt-1 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-8 w-24 shrink-0" />
      </div>
    </div>
  </div>
);

// Property Card Skeleton Component
const PropertyCardSkeleton = () => (
  <Card className="h-full">
    <Skeleton className="h-64 rounded-t-lg" /> {/* Image skeleton */}
    <div className="p-4 flex flex-col gap-5">
      {/* Title and location */}
      <div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Price */}
      <Skeleton className="h-6 w-1/3" />

      {/* Specs */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Description */}
      <Skeleton className="h-20 w-full" />

      {/* Progress section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export default function ApplicationProgressPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  // const applicationId = useReuseAbleStore((state: any) => state.applicationId);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { loadDraft } = useApplicationForm();

  const { data: milestonesData, isFetching: isMilestonesFetching } =
    useMilestonesApplication(id as string, applicationId as string);

  const propertyData = milestonesData?.application as ApplicationData;

  const milestonesApplication = milestonesData?.milestones as MileStoneData[];

  const openFeedbackModal = useCallback(() => {
    if (propertyData?.properties) {
      setShowFeedbackModal(true);
    }
  }, [propertyData]);

  useEffect(() => {
    if (milestones.length === 0 && propertyData) {
      setMilestones([
        {
          title: "Application Started",
          date: "January 22, 2024",
          description: `Application in progress for ${propertyData.properties?.name}.`,
          completed: true
        },
        {
          title: "Property Viewed",
          date: "January 25, 2024",
          description:
            "You viewed the property. Don't forget to leave your feedback!",
          completed: true,
          action: {
            label: "Leave feedback",
            onClick: openFeedbackModal
          }
        },
        {
          title: "Documents Submitted",
          date: "January 28, 2024",
          description:
            "All required documents have been uploaded and submitted.",
          completed: false
        },
        {
          title: "Application Review",
          date: "Pending",
          description:
            "Your application is under review by the property manager.",
          completed: false
        },
        {
          title: "Final Decision",
          date: "Pending",
          description: "Awaiting final decision on your application.",
          completed: false
        }
      ]);
    }

    if (applicationId) {
      loadDraft(Number(applicationId));
    }
  }, [
    id,
    applicationId,
    loadDraft,
    propertyData,
    milestones.length,
    openFeedbackModal
  ]);

  const handleFeedbackComplete = () => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) =>
        milestone.title === "Property Viewed"
          ? {
              ...milestone,
              description: "You viewed the property and left feedback.",
              action: undefined
            }
          : milestone
      )
    );
    setShowFeedbackModal(false);
  };

  const handleResumeApplication = () => {
    router.push(`/dashboard/applications/${id}/apply`);
  };

  if (!propertyData?.properties || isMilestonesFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Skeleton className="h-4 w-20" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-8" />

          <div className="grid md:grid-cols-[400px,1fr] gap-8">
            {/* Property Card Skeleton */}
            <Card className="h-full">
              <Skeleton className="h-64 rounded-t-lg" />
              <div className="p-4 flex flex-col gap-5">
                <div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
                <Skeleton className="h-6 w-1/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            {/* Timeline Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="relative">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex gap-4 mb-8">
                    <div className="relative">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      {index < 4 && (
                        <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-full">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4 mb-2" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <Skeleton className="h-8 w-24 shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/dashboard/applications"
          className="text-gray-600 hover:text-gray-900"
        >
          Applications
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Application progress</span>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Track Application</h1>
        <p className="text-gray-500 mb-8">
          Keep an eye on your application progress with a clear overview of
          every step, from inquiry to final decision.
        </p>

        <div className="grid md:grid-cols-[400px,1fr] gap-8">
          {/* Property Card */}
          {isMilestonesFetching ? (
            <PropertyCardSkeleton />
          ) : (
            propertyData?.properties && (
              <Card className="h-full">
                <div className="relative h-64">
                  <Image
                    src={
                      propertyData.properties.images[0] ||
                      "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg"
                    }
                    alt={propertyData.properties.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4 flex flex-col gap-5">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {propertyData.properties.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {`${propertyData.properties.city}, ${propertyData.properties.country}`}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    <FormattedPrice
                      amount={Number(propertyData.properties.rentalFee)}
                      currency={propertyData.properties.currency || 'USD'}
                    />
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / month
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />{" "}
                      {propertyData.properties.noBedRoom} beds
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />{" "}
                      {propertyData.properties.noBathRoom} baths
                    </span>
                    <span>{propertyData.properties.propertysize}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {propertyData.properties.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      Application completion
                    </div>
                    <Progress
                      value={completedStep(propertyData.completedSteps.length)}
                      className="h-2"
                    />
                    <div className="text-sm font-medium">
                      {completedStep(propertyData.completedSteps.length)}%
                      complete
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/applications/${id}/apply/?applicationId=${applicationId}`}
                  >
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Resume application
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          )}

          {/* Timeline */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Application milestone</h2>
            <div className="relative">
              {isMilestonesFetching
                ? Array.from({ length: 5 }).map((_, index) => (
                    <MilestoneSkeleton key={index} />
                  ))
                : milestonesApplication?.map((milestone, index) => (
                    <div key={index} className="flex gap-4 mb-8">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone?.status === "COMPLETED"
                              ? "bg-red-600 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        {index < milestonesApplication?.length - 1 && (
                          <div className="absolute top-8 left-1/2 bottom-[-32px] w-0.5 -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{milestone?.events}</h3>
                            <div className="text-sm text-gray-500">
                              <span>on</span>
                              <span className="ml-1">
                                {format(
                                  new Date(milestone?.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone?.events}
                            </p>
                          </div>
                          {milestone.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => milestone.action?.onClick()}
                              className="shrink-0"
                            >
                              {milestone.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {propertyData?.properties && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          property={propertyData?.properties as any}
          onComplete={handleFeedbackComplete}
        />
      )}
    </div>
  );
}
