"use client";

import { ChatModal } from "@/app/components/chat/ChatModal";
import { PreChatModal } from "@/app/components/chat/PreChatModal";
import dynamic from "next/dynamic";
const LandlordProfileModal = dynamic(() => import("@/app/components/modals/landlord-profile-modal").then(mod => mod.default), { ssr: false, loading: () => null });
import { SaveModal } from "@/app/components/modals/save-modal";
import { ShareModal } from "@/app/components/modals/share-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import {
  useGetSingleApplication,
  useSignAgreement
} from "@/services/application/applicationFn";
import { useGetProperties } from "@/services/property/propertyFn";
import { Listing } from "@/services/property/types";
import { userStore } from "@/store/userStore";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Share2,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LeaseAgreementModal } from "./lease-agreement-modal";
import { PaymentModal } from "./payment-modal";
import { toast } from "sonner";
import { displayImages } from "@/app/property/[id]/utils";

export default function SuccessPage() {
  const { id } = useParams();
  const { status } = useParams();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLandlordProfile, setShowLandlordProfile] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPreChatModal, setShowPreChatModal] = useState(false);
  const [showLeaseAgreementModal, setShowLeaseAgreementModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "failure"
  >("idle");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const idToUse = id ?? applicationId;
  const { data: applicationData, isFetching } = useGetSingleApplication(
    idToUse as string
  );
  const { mutateAsync: signAgreement, isPending: isSigningAgreement } =
    useSignAgreement();
  const application = applicationData?.application;
  const router = useRouter();
  const user = userStore((state) => state.user);

  const hasAgreement = application?.agreementDocumentUrl?.length > 0;
  const lastAgreementUrl =
    application?.agreementDocumentUrl[
      application?.agreementDocumentUrl?.length - 1
    ];

  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties;

  // const { data, isFetching } = useGetPropertyById(id as string);
  // console.log(data);
  const propertyData = application?.properties;
  const isLoading = isFetching || isFetchingProperties;

  const nextSlide = () => {
    if (scrollIndex < similarProperties.length - 3) {
      setScrollIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (scrollIndex > 0) {
      setScrollIndex((prev) => prev - 1);
    }
  };
  const handleContactClick = (type: "chat" | "email") => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (type === "email") {
      router.push(`/property/${propertyData?.id}/email`);
    } else {
      setShowPreChatModal(true);
    }
  };

  const handlePreChatSubmit = (data: {
    fullName: string;
    email: string;
    phone?: string;
  }) => {
    console.log("Pre-chat data:", data);
    setShowPreChatModal(false);
    setShowChatModal(true);
  };

  const handleSignAgreement = async (signedPdf: File) => {
    await signAgreement({
      applicationId: idToUse as string,
      data: { files: signedPdf }
    });
  };

  const handleLeaseAgreementSubmit = async (signedPdf: File) => {
    try {
      // First handle the signed agreement
      await handleSignAgreement(signedPdf);

      setShowLeaseAgreementModal(false);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error handling lease agreement:", error);
      toast.error("Failed to process signed agreement. Please try again.");
    }
  };
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentStatus("success");
  };

  const handlePaymentFailure = () => {
    setShowPaymentModal(false);
    setPaymentStatus("failure");
  };

  if (isLoading || !propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-[1400px] mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <Skeleton className="w-24 h-10 mb-4" /> {/* Back button */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-20 h-4" /> {/* Breadcrumb */}
          </div>
          {/* Image Gallery Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Skeleton className="w-full h-[500px] rounded-lg" />{" "}
              {/* Main image */}
            </div>
            <div className="grid grid-rows-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="w-full h-[158px] rounded-lg"
                /> /* Thumbnail images */
              ))}
            </div>
          </div>
          {/* Property Info Skeleton */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Skeleton className="w-64 h-8 mb-2" /> {/* Title */}
                  <Skeleton className="w-48 h-4" /> {/* Location */}
                </div>
              </div>
              <Skeleton className="w-40 h-8 mb-6" /> {/* Price */}
              {/* Description Skeleton */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="w-32 h-6 mb-4" />
                  <Skeleton className="w-full h-24" />
                </div>

                {/* Features Skeleton */}
                <div>
                  <Skeleton className="w-48 h-6 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="w-full h-6" />
                    ))}
                  </div>
                </div>

                {/* Location Skeleton */}
                <div>
                  <Skeleton className="w-36 h-6 mb-4" />
                  <Skeleton className="w-full h-[200px] mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Status Card Skeleton */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-32 h-5 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="w-full h-10 mb-4" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
            {/* Landlord Card Skeleton */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-32 h-5 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="w-full h-10 mb-4" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          </div>
          {/* Similar Properties Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-48 h-8" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-[400px] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`/dashboard/applications`}
            className="text-gray-600 hover:text-gray-900"
          >
            Applications
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property Information</span>
        </div>

        {/* Main Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative rounded-lg overflow-hidden">
            <Image
              src={
                displayImages(propertyData?.images)[currentImageIndex] || "/placeholder.svg"
              }
              alt={propertyData?.name}
              width={800}
              height={600}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) =>
                    (prev - 1 + propertyData?.images.length) %
                    propertyData?.images.length
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev + 1) % propertyData?.images.length
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            {displayImages(propertyData?.images)
              .slice(1, 3)
              .map((image: any, index: number) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Property image ${index + 2}`}
                    width={400}
                    height={300}
                    className="w-full h-[242px] object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {propertyData?.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}, `}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-2xl font-bold mb-6">
              {`${formatPrice(propertyData?.price)}`}{" "}
              <span className="text-base font-normal text-gray-600">
                per month
              </span>
            </div>

            <div className="space-y-8">
              <section className="">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <p className="text-gray-600 leading-relaxed">
                  {propertyData?.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <Card className="p-6 shadow-sm w-full mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bedrooms: {propertyData?.noBedRoom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bathrooms: {propertyData?.noBathRoom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Area: {propertyData?.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Pets Allowed: {propertyData?.petsAllowed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Communal garden:{" "}
                        {propertyData?.communalGarden ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Balcony: {propertyData?.balcony ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Parking space/Garage:{" "}
                        {propertyData?.parkingSpace ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Open-concept living and dining area:{" "}
                        {propertyData?.openConcept ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </Card>
              </section>
            </div>
          </div>

          {/* Completed / Submitted */}
          <div className="space-y-6">
            {(status?.toString().toLowerCase() === "submitted" ||
              status?.toString().toLowerCase() === "completed" ||
              status?.toString().toLowerCase() === "approved") && (
              <>
                <Card className="p-6 shadow-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    Application Status
                  </h2>
                  <div className="flex items-center gap-4 mb-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Application Submitted
                      </h3>
                      <p className="text-gray-600">
                        Your application has been successfully submitted
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium break-all text-right">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Submission Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-blue-100 text-blue-800 capitalize">
                        {application?.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 shadow-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Application Review</h3>
                        <p className="text-sm text-gray-600">
                          Your application will be reviewed by our team
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Property Inspection</h3>
                        <p className="text-sm text-gray-600">
                          Schedule a final property inspection if approved
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {(status?.toString()?.toLowerCase() === "agreements" ||
              status?.toString()?.toLowerCase() === "agreements_signed") && (
              <>
                <Card className="p-6 shadow-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    Application Status
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Application Approved
                      </h3>
                      <p className="text-gray-600">
                        Congratulations! Your application has been approved
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium break-all">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Approval Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800 capitalize">
                        {application?.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
                {hasAgreement && (
                  <Card className="p-6 shadow-sm w-full">
                    <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Review Lease Agreement
                          </h3>
                          <p className="text-sm text-gray-600">
                            Please review and sign your lease agreement
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 w-full flex-wrap">
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          onClick={() => setShowLeaseAgreementModal(true)}
                        >
                          View lease agreement
                        </Button>
                        {application?.status?.toLowerCase() !==
                          "agreements_signed" && (
                          <Button variant="outline" className="flex-1">
                            Decline lease offer
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}

            {status?.toString()?.toLowerCase() === "rejected" && (
              <>
                <Card className="p-6 shadow-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">
                    Application Status
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Application Rejected
                      </h3>
                      <p className="text-gray-600">
                        Unfortunately, your application has been rejected
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium break-all">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Decision Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="destructive">{application?.status}</Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 shadow-sm w-full">
                  <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Home className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Browse Similar Properties
                        </h3>
                        <p className="text-sm text-gray-600">
                          Check out similar properties that match your criteria
                        </p>
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      View Similar Properties
                    </Button>
                  </div>
                </Card>
              </>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full relative",
                      "ring-2",
                      propertyData?.landlord?.isOnline
                        ? "ring-red-500"
                        : "ring-gray-300"
                    )}
                  >
                    <Image
                      src={
                        propertyData?.landlord?.user?.profile?.image ||
                        "/placeholder.svg"
                      }
                      alt={propertyData?.landlord?.user?.profile?.firstName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  {true && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {propertyData?.landlord?.user?.profile?.firstName}{" "}
                    {propertyData?.landlord?.user?.profile?.lastName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Landlord
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setShowLandlordProfile(true)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white mb-4"
                onClick={() => handleContactClick("chat")}
              >
                Chat with landlord
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleContactClick("email")}
              >
                Email landlord
              </Button>

              <LandlordProfileModal
                isOpen={showLandlordProfile}
                onClose={() => setShowLandlordProfile(false)}
                landlord={{
                  id: propertyData?.landlord?.id,
                  name: propertyData?.landlord?.user?.profile?.firstName,
                  image: propertyData?.landlord?.user?.profile?.image
                  // address: `${propertyData?.landlord?.location}, ${propertyData?.landlord?.city},${propertyData?.landlord?.country}`,
                  // isOnline: true
                }}
                // properties={landlordProperties}
                onChatClick={() => handleContactClick("chat")}
                onEmailClick={() => handleContactClick("email")}
              />
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Similar Properties</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={prevSlide}
                disabled={scrollIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={nextSlide}
                disabled={scrollIndex >= similarProperties.length - 3}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              initial={false}
              animate={{ x: `-${scrollIndex * 33.33}%` }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.5
              }}
            >
              {similarProperties
                ?.filter((p) => p.id !== propertyData?.id)
                ?.map((similarProperty) => (
                  <div
                    key={similarProperty.id}
                    className="flex-none w-[calc(33.33%-16px)]"
                  >
                    <Card className="overflow-hidden shadow-sm">
                      <div className="relative h-48">
                        <Image
                          src={
                            displayImages(similarProperty?.property?.images)[0] ||
                            "/placeholder.svg"
                          }
                          alt={String(similarProperty?.property?.name)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">
                          {similarProperty?.property?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {similarProperty?.property?.address}, {similarProperty?.property?.city}, {similarProperty?.property?.state?.name}, {similarProperty?.property?.country}
                        </p>
                        <p className="text-red-600 font-semibold">
                          {formatPrice(
                            Number(similarProperty?.property?.price) || 0
                          )}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
            </motion.div>
          </div>
        </section>
      </div>

      <PreChatModal
        isOpen={showPreChatModal}
        onClose={() => setShowPreChatModal(false)}
        onSubmit={handlePreChatSubmit}
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        landlord={{
          name: `${propertyData?.landlord?.user?.profile?.firstName} ${propertyData?.landlord?.user?.profile?.lastName}`,
          image: propertyData?.landlord?.image || "",
          role: "Landlord",
          id: propertyData?.landlord?.userId
        }}
        propertyId={Number(id)}
      />

      <LeaseAgreementModal
        isOpen={showLeaseAgreementModal}
        onClose={() => setShowLeaseAgreementModal(false)}
        onSubmit={handleLeaseAgreementSubmit}
        agreementDocumentUrl={lastAgreementUrl}
        canSubmit={application?.status?.toLowerCase() !== "agreements_signed"}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        propertyTitle={propertyData?.name}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        propertyTitle={propertyData?.name}
        propertyUrl={`${window.location.origin}/property/${propertyData?.id}`}
      />
      {paymentStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg"
        >
          Payment successful! Your lease agreement has been submitted.
        </motion.div>
      )}

      {paymentStatus === "failure" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg"
        >
          Payment failed. Please try again or contact support.
        </motion.div>
      )}
    </div>
  );
}
