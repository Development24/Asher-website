"use client";

import SimilarPropertyCard from "@/app/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  useGetPropertyByInviteId,
  useUpdateInvite
} from "@/services/application/applicationFn";
import { useGetProperties } from "@/services/property/propertyFn";
import { Listing } from "@/services/property/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Share2,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
const AcceptInviteModal = dynamic(() => import("@/app/dashboard/components/modals/accept-invite-modal").then(mod => mod.default), { ssr: false, loading: () => null });
const RejectInviteModal = dynamic(() => import("@/app/dashboard/components/modals/reject-invite-modal").then(mod => mod.default), { ssr: false, loading: () => null });
const RescheduleModal = dynamic(() => import("@/app/dashboard/components/modals/reschedule-modal").then(mod => mod.default), { ssr: false, loading: () => null });
const RescheduleViewingModal = dynamic(() => import("@/app/dashboard/components/modals/reschedule-viewing-modal").then(mod => mod.default), { ssr: false, loading: () => null });
const CancelViewingModal = dynamic(() => import("@/app/dashboard/components/modals/cancel-viewing-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { InviteData, Landlord } from "../type";
import { PropertyViewingDetailSkeleton } from "./PropertyViewingSkeleton";
import {
  ContactAgentSection,
  ScheduleDisplay,
  ViewingActions
} from "./ViewingsComp";
import { displayImages } from "@/app/property/[id]/utils";

interface Property {
  id: number;
  images: string[];
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  date?: string;
  rentalFee?: string;
  time?: string;
  description?: string;
  features?: string[];
  agent?: {
    name: string;
    image: string;
    email: string;
  };
  landlord?: Landlord;
}

interface NearbyLocation {
  name: string;
  distance: string;
}

enum ViewingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  RESCHEDULED = "RESCHEDULED",
  RESCHEDULED_ACCEPTED = "RESCHEDULED_ACCEPTED",
  CANCELLED = "CANCELLED",
  SCHEDULED = "SCHEDULED",
  AWAITING_FEEDBACK = "AWAITING_FEEDBACK",
  APPROVED = "APPROVED"
}

export default function PropertyViewingDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const scheduleDate = searchParams?.get("schedule_date");
  const invitationId = searchParams?.get("invitationId");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const similarPropertiesRef = useRef<HTMLDivElement>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState(false);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const [rescheduledDate, setRescheduledDate] = useState("");
  const [rescheduledTime, setRescheduledTime] = useState("");
  // const [viewingStatus, setViewingStatus] = useState<
  //   "scheduled" | "rescheduled" | "cancelled" | "pending"
  // >("pending"); // Added state for viewing status
  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties || [];
  const { data, isFetching, refetch } = useGetPropertyByInviteId(id as string);
  const dataInvite = (data as any)?.invite || data;
  const propertyData = dataInvite?.properties;
  const viewingStatus = dataInvite?.response as ViewingStatus;
  const scheduledDate = dataInvite?.scheduleDate
    ? format(new Date(dataInvite?.scheduleDate as string), "dd MMMM, yyyy")
    : "";
  const scheduledTime = dataInvite?.scheduleDate
    ? format(new Date(dataInvite?.scheduleDate as string), "HH:mm")
    : "";
  const rescheduledDateData = dataInvite?.reScheduleDate
    ? format(new Date(dataInvite?.reScheduleDate as string), "dd MMMM, yyyy")
    : "";
  const rescheduledTimeData = dataInvite?.reScheduleDate
    ? format(new Date(dataInvite?.reScheduleDate as string), "HH:mm")
    : "";
  const router = useRouter();
  const nextSimilar = () => {
    setSimilarIndex((prev) => (prev + 1) % similarProperties.length);
  };

  const prevSimilar = () => {
    setSimilarIndex(
      (prev) => (prev - 1 + similarProperties.length) % similarProperties.length
    );
  };
  const { mutate: updateInvite, isPending: isUpdatingInvite } =
    useUpdateInvite();

  const scrollSimilarProperties = (direction: "left" | "right") => {
    if (similarPropertiesRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      similarPropertiesRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleAccept = () => {
    // setShowAcceptSuccess(true);
    // setViewingStatus("scheduled"); // Update viewing status on accept
    updateInvite(
      {
        id: invitationId as string,
        data: {
          response: ViewingStatus.ACCEPTED
        }
      },
      {
        onSuccess: () => {
          setShowAcceptSuccess(true);
          // setViewingStatus("scheduled"); // Update viewing status on accept
        }
      }
    );
  };

  const handleReject = () => {
    // setShowRejectSuccess(true);
    updateInvite(
      {
        id: invitationId as string,
        data: {
          response: ViewingStatus.REJECTED
        }
      },
      {
        onSuccess: () => {
          setShowRejectSuccess(true);
        }
      }
    );
  };

  const handleReschedule = (data: {
    date: string;
    time: string;
    reason: string;
  }) => {
    // setShowRescheduleSuccess(true);
    setRescheduledDate(data.date);
    setRescheduledTime(data.time);
    const newDateTime = new Date(`${data.date} ${data.time}`);
    updateInvite(
      {
        id: invitationId as string,
        data: {
          reScheduleDate: newDateTime.toISOString(),
          // scheduleDate: newDateTime.toISOString(),
          response: ViewingStatus.RESCHEDULED
        }
      },
      {
        onSuccess: () => {
          refetch();
          setShowRescheduleSuccess(true);
          setRescheduledDate(dataInvite?.reScheduleDate as string);
          setRescheduledTime(dataInvite?.scheduleDate as string);
        }
      }
    );
  };

  const handleCancel = () => {
    updateInvite(
      {
        id: invitationId as string,
        data: { response: ViewingStatus.CANCELLED }
      },
      {
        onSuccess: () => {
          setShowCancelSuccess(true);
          setTimeout(() => {
            setShowCancelModal(false);
            setShowCancelSuccess(false);
          }, 3000);
        }
      }
    );
  };

  if (isFetching) {
    return <PropertyViewingDetailSkeleton />;
  }

  const nearbyStations: NearbyLocation[] = [
    { name: "Vauxhall Station", distance: "0.7 miles" },
    { name: "Fulham Broadway", distance: "0.8 miles" },
    { name: "Clapham Junction", distance: "0.9 miles" }
  ];

  const nearbyMalls: NearbyLocation[] = [
    { name: "Ikeja City Mall", distance: "0.5 miles" },
    { name: "Palms Shopping Mall", distance: "1.2 miles" },
    { name: "Maryland Mall", distance: "1.5 miles" }
  ];

  const nearbySchools: NearbyLocation[] = [
    { name: "Lagos Preparatory School", distance: "0.3 miles" },
    { name: "Corona School", distance: "0.7 miles" },
    { name: "British International School", distance: "1.1 miles" }
  ];

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/dashboard/property-viewings"
          className="text-gray-600 hover:text-gray-900"
        >
          Property viewings
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{propertyData?.name}</span>
      </div>

      {/* Gallery Section */}
      <div className="relative w-full h-[600px] bg-gray-100">
        <div className="">
          <Image
            src={
              displayImages(propertyData?.images)[currentImageIndex] ||
              "/images/property-placeholder.png"
            }
            alt={propertyData?.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Gallery Navigation */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 overflow-x-auto">
          {propertyData?.images.map((image: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                currentImageIndex === index ? "ring-2 ring-red-600" : ""
              }`}
            >
              <Image
                src={image?.url || "/placeholder.svg"}
                alt={`View ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Overlay Buttons */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            Floor Plan
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            Map View
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {propertyData?.name}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <p className="text-gray-600 text-sm mb-2">
                    {propertyData?.address},{" "}
                    {propertyData?.address2 && propertyData?.address2 !== ""
                      ? propertyData?.address2
                      : ""}{" "}
                    {propertyData?.city}, {propertyData?.state?.name}{" "}
                    {propertyData?.country}
                  </p>
                </div>
                <div className="text-2xl font-bold text-red-600 mt-4">
                  {formatPrice(Number(propertyData?.price))}{" "}
                  <span className="text-sm font-normal text-gray-600">
                    per month
                  </span>
                </div>
              </div>

              {/* Viewing Schedule Information Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-700">Viewing Schedule</h3>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    (() => {
                      switch (viewingStatus) {
                        case 'ACCEPTED':
                          return 'bg-green-100 text-green-800 border-green-200';
                        case 'RESCHEDULED_ACCEPTED':
                          return 'bg-blue-100 text-blue-800 border-blue-200';
                        case 'RESCHEDULED':
                          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'REJECTED':
                          return 'bg-red-100 text-red-800 border-red-200';
                        case 'PENDING':
                          return 'bg-gray-100 text-gray-800 border-gray-200';
                        default:
                          return 'bg-gray-100 text-gray-800 border-gray-200';
                      }
                    })()
                  }`}>
                    {(() => {
                      switch (viewingStatus) {
                        case 'ACCEPTED':
                          return 'Accepted';
                        case 'RESCHEDULED_ACCEPTED':
                          return 'Rescheduled & Accepted';
                        case 'RESCHEDULED':
                          return 'Rescheduled';
                        case 'REJECTED':
                          return 'Declined';
                        case 'PENDING':
                          return 'Pending';
                        default:
                          return viewingStatus;
                      }
                    })()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Original Date</span>
                        <Calendar className="w-4 h-4 text-neutral-500" />
                      </div>
                      <div className="text-lg font-semibold text-neutral-900">
                        {scheduledDate}
                      </div>
                      <div className="text-sm text-neutral-600">
                        at {scheduledTime}
                      </div>
                    </div>
                    
                    {dataInvite?.reScheduleDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-700">Rescheduled To</span>
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-lg font-semibold text-blue-900">
                          {rescheduledDateData}
                        </div>
                        <div className="text-sm text-blue-700">
                          at {rescheduledTimeData}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Response Steps Timeline */}
                  {(dataInvite as any)?.responseStepsCompleted && (dataInvite as any).responseStepsCompleted.length > 1 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium text-neutral-700 mb-3">Progress Timeline</h4>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {(dataInvite as any).responseStepsCompleted.map((step: string, index: number) => (
                          <div key={index} className="flex items-center flex-shrink-0">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                index === (dataInvite as any).responseStepsCompleted.length - 1 
                                  ? 'bg-blue-500' 
                                  : 'bg-green-500'
                              }`}></div>
                              <span className="text-sm font-medium px-2 py-1 bg-neutral-100 rounded">
                                {step.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            {index < (dataInvite as any).responseStepsCompleted.length - 1 && (
                              <div className="w-8 h-0.5 bg-neutral-300 mx-2"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {propertyData?.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {propertyData?.amenities?.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      )
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="h-[300px] bg-gray-100 rounded-lg mb-6"></div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Nearest stations</h3>
                      <ul className="space-y-2">
                        {nearbyStations.map((station, index) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{station.name}</span>
                            <span className="text-gray-500">
                              {station.distance}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Nearest malls</h3>
                      <ul className="space-y-2">
                        {nearbyMalls.map((mall, index) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{mall.name}</span>
                            <span className="text-gray-500">
                              {mall.distance}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Nearest schools</h3>
                      <ul className="space-y-2">
                        {nearbySchools.map((school, index) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{school.name}</span>
                            <span className="text-gray-500">
                              {school.distance}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Another state to */}
          <div className="space-y-6">
            {viewingStatus === ViewingStatus.PENDING && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">
                  Property Viewing Schedule
                </h2>
                {/* Status indicator */}
                {/* <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Viewing invite</span>
                  {viewingStatus === ViewingStatus.CANCELLED && (
                    <span className="text-red-600 font-medium text-sm">
                      Rejected
                    </span>
                  )}
                </div> */}

                {/* Initial Schedule */}
                <ScheduleDisplay date={scheduledDate} time={scheduledTime} />

                {/* Accept/Reject Actions */}
                <div className="space-y-3 mt-4">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setShowAcceptModal(true)}
                  >
                    Accept viewing invite
                  </Button>
                  <ViewingActions
                    onReschedule={() => setShowRescheduleModal(true)}
                    onCancel={() => setShowRejectModal(true)}
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                {/* Accepted Schedule */}
                {viewingStatus === ViewingStatus.ACCEPTED && (
                  <div className="space-y-4">
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Property Viewing Schedule
                      </h2>
                      <ScheduleDisplay
                        date={scheduledDate}
                        time={scheduledTime}
                      />
                    </Card>

                    <ViewingActions
                      onReschedule={() => setShowRescheduleModal(true)}
                      onCancel={() => setShowCancelModal(true)}
                      variant="primary"
                    />
                  </div>
                )}

                {viewingStatus === ViewingStatus.APPROVED && (
                  <div className="space-y-4">
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Approved Property Viewing Schedule
                      </h2>
                      <ScheduleDisplay
                        date={scheduledDate}
                        time={scheduledTime}
                      />
                    </Card>

                    {/* <ViewingActions
                      onReschedule={() => setShowRescheduleModal(true)}
                      onCancel={() => setShowCancelModal(true)}
                      variant="primary"
                    /> */}
                  </div>
                )}

                {/* Rescheduled Schedule */}
                {viewingStatus === ViewingStatus.RESCHEDULED && (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <ScheduleDisplay
                        date={scheduledDate}
                        time={scheduledTime}
                        label="Original Schedule"
                      />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <ScheduleDisplay
                        date={rescheduledDateData}
                        time={rescheduledTimeData}
                        label="New Schedule"
                      />
                    </div>
                  </div>
                )}

                {/* Cancelled Schedule */}
                {viewingStatus === ViewingStatus.CANCELLED && (
                  <>
                    <ScheduleDisplay
                      date={scheduledDate}
                      time={scheduledTime}
                      isStrikethrough
                    />
                    <div className="text-red-600 font-medium mt-2">
                      Viewing Cancelled
                    </div>
                  </>
                )}

                {viewingStatus === ViewingStatus.AWAITING_FEEDBACK && (
                  <div className="space-y-4">
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Property Viewing Schedule
                      </h2>
                      <ScheduleDisplay
                        date={scheduledDate}
                        time={scheduledTime}
                      />
                    </Card>
                    <div className="text-gray-600 font-medium mt-2">
                      Landlord is awaiting your feedback
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        router.push(
                          `/dashboard/property-viewings/#feedback-section`
                        );
                      }}
                    >
                      Leave Feedback
                    </Button>
                  </div>
                )}

                {/* Viewing Management Actions */}
                {/* {viewingStatus !== ViewingStatus.CANCELLED && (
                  <ViewingActions
                    onReschedule={() => setShowRescheduleModal(true)}
                    onCancel={() => setShowCancelModal(true)}
                    variant="primary"
                  />
                )} */}
              </div>
            </div>

            <ContactAgentSection landlord={propertyData?.landlord} />
          </div>
        </div>

        {/* Similar Properties */}
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar properties</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSimilar}
                className="hover:bg-red-600 hover:text-white"
                disabled={similarIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSimilar}
                className="hover:bg-red-600 hover:text-white"
                disabled={similarIndex >= (similarProperties?.length || 0) - 3}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-5 w-full"
              initial={false}
              animate={{ x: `${-similarIndex * (100 / 4)}%` }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.5
              }}
            >
              {similarProperties
                ?.filter((p) => p.id !== propertyData?.id)
                ?.map((similarProperty) => (
                  <div key={similarProperty.id}>
                    <SimilarPropertyCard property={similarProperty} />
                  </div>
                ))}
            </motion.div>
          </div>
        </div>
      </div>

      <AcceptInviteModal
        isOpen={showAcceptModal}
        isLoading={isUpdatingInvite}
        onClose={() => {
          setShowAcceptModal(false);
          if (showAcceptSuccess) {
            setShowAcceptSuccess(false);
          }
        }}
        onConfirm={handleAccept}
        showSuccess={showAcceptSuccess}
        propertyId={Number(propertyData?.id)}
      />

      <RejectInviteModal
        isOpen={showRejectModal}
        isLoading={isUpdatingInvite}
        onClose={() => {
          setShowRejectModal(false);
          if (showRejectSuccess) {
            setShowRejectSuccess(false);
          }
        }}
        onConfirm={handleReject}
        showSuccess={showRejectSuccess}
        propertyId={String(propertyData?.id)}
      />

      <RescheduleModal
        isOpen={showRescheduleModal}
        isLoading={isUpdatingInvite}
        onClose={() => {
          setShowRescheduleModal(false);
          if (showRescheduleSuccess) {
            setShowRescheduleSuccess(false);
          }
        }}
        onConfirm={handleReschedule}
        showSuccess={showRescheduleSuccess}
        propertyName={propertyData?.name}
        propertyId={String(propertyData?.id)}
      />

      <RescheduleViewingModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleReschedule}
        isLoading={isUpdatingInvite}
        showSuccess={showRescheduleSuccess}
        currentDate={scheduledDate}
        currentTime={scheduledTime}
        newDate={rescheduledDateData}
        newTime={rescheduledTimeData}
      />

      <CancelViewingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        showSuccess={showCancelSuccess}
      />
    </div>
  );
}
