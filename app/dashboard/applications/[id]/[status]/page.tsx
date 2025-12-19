"use client";

import { ChatModal } from "@/app/components/chat/ChatModal";
import { PreChatModal } from "@/app/components/chat/PreChatModal";
import dynamic from "next/dynamic";
const LandlordProfileModal = dynamic(
  () =>
    import("@/app/components/modals/landlord-profile-modal").then(
      (mod) => mod.default
    ),
  { ssr: false, loading: () => null }
);
import { ShareModal } from "@/app/components/modals/share-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice, formatName } from "@/lib/utils";
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
import DepositComponent from "../../components/stripe-comp/DepositComponent";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { displayImages } from "@/app/property/[id]/utils";
import SaveModal from "../../../../components/modals/save-modal";
import { createPayment } from "@/services/finance/finance";
import { useCreatePayment } from "@/services/finance/financeFn";



// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const idToUse = id ?? applicationId;
  const { data: applicationData, isFetching } = useGetSingleApplication(
    idToUse as string
  );
  const { mutateAsync: createPaymentFn, isPending: isCreatingPayment } = useCreatePayment();
  const { mutateAsync: signAgreement, isPending: isSigningAgreement } =
    useSignAgreement();
  const application = applicationData?.application;
  const applicationAgreementDocID = application?.agreementDocument[0]?.id;
  const router = useRouter();
  const user = userStore((state) => state.user);

  // Coerce various possible shapes into a URL string
  const coerceUrl = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return coerceUrl(value[value.length - 1]);
    if (typeof value === "object") {
      if (typeof value.url === "string") return value.url;
      if (typeof value.documentUrl === "string") return value.documentUrl;
      if (Array.isArray(value.documentUrl))
        return coerceUrl(value.documentUrl[value.documentUrl.length - 1]);
    }
    return null;
  };

  const agreementDocs = (application as any)?.agreementDocument ?? [];
  const lastAgreement =
    Array.isArray(agreementDocs) && agreementDocs.length > 0
      ? agreementDocs[agreementDocs.length - 1]
      : null;
  const processedAgreementHtml: string | null =
    lastAgreement?.processedContent ?? null;
  const lastAgreementUrl: string | null = coerceUrl(
    lastAgreement?.documentUrl ?? null
  );
  const hasAgreement = Boolean(processedAgreementHtml || lastAgreementUrl);

  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties || [];

  // const { data, isFetching } = useGetPropertyById(id as string);
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
    setShowPreChatModal(false);
    setShowChatModal(true);
  };

  const handleSignAgreement = async (signedPdf: File) => {
    await signAgreement({
      applicationId: applicationAgreementDocID as string,
      data: { files: signedPdf }
    });
  };

  const handleLeaseAgreementSubmit = async (signedPdf: File) => {
    try {
      // First handle the signed agreement

      await handleSignAgreement(signedPdf);
    } catch (error) {
      console.error("Error handling lease agreement:", error);
      toast.error("Failed to process signed agreement. Please try again.");
    }
  };

  const handleLeaseAgreementSubmitJson = async (payload: {
    updatedProcessedContent: string;
    userSignature: string;
  }) => {
    try {
      console.debug("Lease agreement JSON payload", payload);
      const formData = new FormData();
      formData.append("processedContent", payload.updatedProcessedContent);
      // formData.append("files", payload.userSignature);
      await signAgreement(
        {
          applicationId: applicationAgreementDocID as string,
          data: formData
        },
        {
          onSuccess: () => {
            // toast.success("Agreement content prepared");
            setShowLeaseAgreementModal(false);
            handleCreatePayment();
          },
          onError: (error: any) => {
            console.error("Error sending agreement JSON payload", error);
            toast.error("Failed to send agreement content");
          }
        }
      );
    } catch (e) {
      console.error("Error sending agreement JSON payload", e);
      toast.error("Failed to send agreement content");
    }
  };
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentStatus("success");
    toast.success("Payment successful! Your lease agreement has been submitted.");
  };

  const handlePaymentFailure = (error?: any) => {
    setShowPaymentModal(false);
    setPaymentStatus("failure");
    toast.error("Payment failed. Please try again or contact support.");
    console.error("Payment failed:", error);
  };

  const handleCreatePayment = () => {
    // Get actual rent amount and security deposit from application/property data
    const getRentAmount = () => {
      // Try to get from application properties first
      if (application?.properties?.rentalFee) {
        const rentFee = parseFloat(application.properties.rentalFee);
        if (!isNaN(rentFee) && rentFee > 0) {
          return rentFee;
        }
      }
      
      // Try security deposit as fallback
      if (application?.securityDeposit) {
        const deposit = parseFloat(application.securityDeposit);
        if (!isNaN(deposit) && deposit > 0) {
          return deposit;
        }
      }
      
      // Try initial deposit from properties
      if (application?.properties?.initialDeposit) {
        const initialDeposit = parseFloat(application.properties.initialDeposit);
        if (!isNaN(initialDeposit) && initialDeposit > 0) {
          return initialDeposit;
        }
      }
      
      // Fallback to default (should not happen in production)
      console.warn("No rent amount found, using default");
      return 5000; // $50.00 in cents as fallback
    };

    const rentAmount = getRentAmount();
    const currency = application?.properties?.currency || "USD";
    
    // Convert to cents/kobo based on currency
    const amountInSmallestUnit = currency === "NGN" 
      ? Math.round(rentAmount * 100) // Convert to kobo
      : Math.round(rentAmount * 100); // Convert to cents for USD, etc.
    
    setPaymentAmount(amountInSmallestUnit);
    
    console.log(`Creating payment for rent: ${amountInSmallestUnit} ${currency} (${rentAmount} in base units)`);
    
    createPaymentFn(
      {
        amount: amountInSmallestUnit,
        paymentGateway: "STRIPE",
        payment_method_types: "card",
        currency: currency
      },
      {
        onSuccess: (data: any) => {
          const response = data as any;
          const { paymentDetails } = response;
          setClientSecret(paymentDetails?.client_secret);
          setShowPaymentModal(true);
        },
        onError: (error: any) => {
          console.error("Lease payment creation failed:", error);
          toast.error("Failed to create payment. Please try again.");
        }
      }
    );
  };

  if (isLoading || !propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-[1400px] mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <Skeleton className="mb-4 w-24 h-10" /> {/* Back button */}
          <div className="flex gap-2 items-center mb-6">
            <Skeleton className="w-20 h-4" /> {/* Breadcrumb */}
          </div>
          {/* Image Gallery Skeleton */}
          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
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
          <div className="grid gap-8 mb-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Skeleton className="mb-2 w-64 h-8" /> {/* Title */}
                  <Skeleton className="w-48 h-4" /> {/* Location */}
                </div>
              </div>
              <Skeleton className="mb-6 w-40 h-8" /> {/* Price */}
              {/* Description Skeleton */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="mb-4 w-32 h-6" />
                  <Skeleton className="w-full h-24" />
                </div>

                {/* Features Skeleton */}
                <div>
                  <Skeleton className="mb-4 w-48 h-6" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="w-full h-6" />
                    ))}
                  </div>
                </div>

                {/* Location Skeleton */}
                <div>
                  <Skeleton className="mb-4 w-36 h-6" />
                  <Skeleton className="w-full h-[200px] mb-4" />
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <Skeleton className="mb-2 w-32 h-6" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Status Card Skeleton */}
            <div>
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex gap-4 items-center mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 w-32 h-5" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="mb-4 w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
            {/* Landlord Card Skeleton */}
            <div>
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex gap-4 items-center mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 w-32 h-5" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="mb-4 w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          </div>
          {/* Similar Properties Skeleton */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="w-48 h-8" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
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
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex gap-2 items-center mb-6 text-sm">
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
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <div className="overflow-hidden relative rounded-lg md:col-span-2">
            <Image
              src={
                displayImages(propertyData?.images)[currentImageIndex] ||
                "/placeholder.svg"
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
              className="absolute left-4 top-1/2 p-2 text-white rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev + 1) % propertyData?.images.length
                )
              }
              className="absolute right-4 top-1/2 p-2 text-white rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/70"
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
                  className="overflow-hidden relative rounded-lg"
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

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="mb-2 text-2xl font-bold">
                  {propertyData?.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-1 w-4 h-4" />
                  {`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}, `}
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6 text-2xl font-bold">
              {`${formatPrice(propertyData?.price, propertyData?.currency || 'USD')}`}{" "}
              <span className="text-base font-normal text-gray-600">
                per month
              </span>
            </div>

            <div className="space-y-8">
              <section className="">
                <h2 className="mb-4 text-xl font-semibold">Property Details</h2>
                <p className="leading-relaxed text-gray-600">
                  {propertyData?.description}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-semibold">Features</h2>
                <Card className="p-6 mb-6 w-full shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bedrooms: {propertyData?.noBedRoom}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bathrooms: {propertyData?.noBathRoom}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Area: {propertyData?.size}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Pets Allowed: {propertyData?.petsAllowed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Communal garden:{" "}
                        {propertyData?.communalGarden ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Balcony: {propertyData?.balcony ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Check className="w-5 h-5 text-primary" />
                      <span>
                        Parking space/Garage:{" "}
                        {propertyData?.parkingSpace ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
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
                <Card className="p-6 w-full shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Application Status
                  </h2>
                  <div className="flex gap-4 items-center mb-4 w-full">
                    <div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-full">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Application Submitted
                      </h3>
                      <p className="text-gray-600">
                        Your application has been successfully submitted
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium text-right break-all">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Submission Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge className="text-blue-800 capitalize bg-blue-100">
                        {application?.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 w-full shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">Next Steps</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Application Review</h3>
                        <p className="text-sm text-gray-600">
                          Your application will be reviewed by our team
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
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
                <Card className="p-6 w-full shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Application Status
                  </h2>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-full">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Application Approved
                      </h3>
                      <p className="text-gray-600">
                        Congratulations! Your application has been approved
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium break-all">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Approval Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge className="text-green-800 capitalize bg-green-100">
                        {application?.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
                {hasAgreement && (
                  <Card className="p-6 w-full shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">Next Steps</h2>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
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
                      <div className="flex flex-wrap gap-4 w-full">
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
                <Card className="p-6 w-full shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Application Status
                  </h2>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Application Rejected
                      </h3>
                      <p className="text-gray-600">
                        Unfortunately, your application has been rejected
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Application ID</span>
                      <span className="font-medium break-all">
                        APP-{idToUse}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Decision Date</span>
                      <span className="font-medium">
                        {format(application?.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="destructive">{application?.status}</Badge>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 w-full shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">What's Next?</h2>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
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

            <div className="sticky top-4 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div className="flex gap-4 items-center mb-6">
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
                      className="object-cover rounded-full"
                    />
                  </div>
                  {true && (
                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
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
                className="mb-4 w-full text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
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
              
              {/* Test Stripe Payment Button */}
              <Button
                variant="outline"
                className="mt-4 w-full text-green-600 border-green-500 hover:bg-green-50"
                onClick={handleCreatePayment}
                disabled={isCreatingPayment}
              >
                {isCreatingPayment ? "Creating Payment..." : "Test Stripe Payment"}
              </Button>

              <LandlordProfileModal
                isOpen={showLandlordProfile}
                onClose={() => setShowLandlordProfile(false)}
                landlord={{
                  id: propertyData?.landlord?.id,
                  name: formatName(
                    propertyData?.landlord?.user?.profile?.firstName,
                    propertyData?.landlord?.user?.profile?.lastName,
                    propertyData?.landlord?.user?.profile?.fullname
                  ),
                  image: propertyData?.landlord?.user?.profile?.profileUrl
                }}
                onChatClick={() => handleContactClick("chat")}
                onEmailClick={() => handleContactClick("email")}
              />
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Similar Properties</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={prevSlide}
                disabled={scrollIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={nextSlide}
                disabled={scrollIndex >= similarProperties.length - 3}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-hidden relative">
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
                            displayImages(
                              similarProperty?.property?.images
                            )[0] || "/placeholder.svg"
                          }
                          alt={String(similarProperty?.property?.name)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 font-semibold">
                          {similarProperty?.property?.name}
                        </h3>
                        <p className="mb-2 text-sm text-gray-600">
                          {similarProperty?.property?.address},{" "}
                          {similarProperty?.property?.city},{" "}
                          {similarProperty?.property?.state?.name},{" "}
                          {similarProperty?.property?.country}
                        </p>
                        <p className="font-semibold text-red-600">
                          {formatPrice(
                            Number(similarProperty?.property?.price) || 0,
                            similarProperty?.property?.currency || 'USD'
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
        onSubmitJson={handleLeaseAgreementSubmitJson}
        agreementDocumentUrl={lastAgreementUrl}
        agreementHtml={processedAgreementHtml}
        canSubmit={application?.status?.toLowerCase() !== "agreements_signed"}
        tenantFullName={
          user?.profile?.fullname ||
          [user?.profile?.firstName, user?.profile?.lastName]
            .filter(Boolean)
            .join(" ") ||
          undefined
        }
      />

      <DepositComponent
        stripePromise={stripePromise}
        opened={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        clientSecret={clientSecret}
        amount={paymentAmount}
        currency="USD"
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentFailure}
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
        propertyUrl={
          typeof window !== "undefined"
            ? `${window.location.origin}/property/${propertyData?.id}`
            : `/property/${propertyData?.id}`
        }
      />
      {paymentStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-4 bottom-4 p-4 text-white bg-green-500 rounded-md shadow-lg"
        >
          Payment successful! Your lease agreement has been submitted.
        </motion.div>
      )}

      {paymentStatus === "failure" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-4 bottom-4 p-4 text-white bg-red-500 rounded-md shadow-lg"
        >
          Payment failed. Please try again or contact support.
        </motion.div>
      )}
    </div>
  );
}
