"use client";

// Force dynamic rendering to avoid SSR issues with location
export const dynamic = "force-dynamic";

import { AuthPromptModal } from "@/app/components/auth/AuthPromptModal";
import LoginModal from "@/app/components/auth/LoginModal";
import SignUpModal from "@/app/components/auth/SignUpModal";
import VerificationModal from "@/app/components/auth/VerificationModal";
import { ChatModal } from "@/app/components/chat/ChatModal";
import { PreChatModal } from "@/app/components/chat/PreChatModal";
import LandlordProfileModal from "@/app/components/modals/landlord-profile-modal";
import SaveModal from "@/app/components/modals/save-modal";
import { ShareModal } from "@/app/components/modals/share-modal";
import SimilarPropertyCard from "@/app/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { formatPrice, formatName } from "@/lib/utils";
import {
  useGetProperties,
  useGetPropertyById,
  useGetPropertyByIdForListingId
} from "@/services/property/propertyFn";
import { Listing, Property } from "@/services/property/types";
import { userStore } from "@/store/userStore";
import cn from "classnames";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MapPin,
  Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRedirectStore } from "@/store/authRedirect";
import { displayImages, filteredImageUrls, ImageObject } from "./utils";
import { EmailFormModal } from "@/app/components/email/EmailFormModal";
import { useEmailFormModal } from "@/hooks/useEmailFormModal";

const propertyImages = [
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_01_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_02_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_03_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_05_0000.jpeg"
];

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPreChatModal, setShowPreChatModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLandlordProfile, setShowLandlordProfile] = useState(false);
  const [showEmailFormModal, setShowEmailFormModal] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const user = userStore((state) => state.user);
  const setRedirectUrl = useAuthRedirectStore((state) => state.setRedirectUrl);
  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties || [];

  const { data, isFetching, error } = useGetPropertyByIdForListingId(
    id as string
  );
  const propertyData = data?.property?.property as Property | undefined;
  const type = data?.property?.type;
  const subInfo =
    type === "SINGLE_UNIT" ? data?.property?.unit : data?.property?.room;
  const propertyInfo =
    type === "ENTIRE_PROPERTY" ? data?.property?.property : subInfo;

  // useEffect(() => {
  //   // const selectedProperty = properties.find((p) => p.id.toString() === id);
  //   // setProperty(selectedProperty || null);

  //   // Simulating an authentication check
  //   const checkAuth = () => {
  //     const isAuth = localStorage.getItem("isAuthenticated") === "true";
  //     setIsAuthenticated(isAuth);
  //   };
  //   checkAuth();
  // }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
    );
  };

  const nextSimilar = () => {
    setSimilarIndex((prev) => (prev + 1) % similarProperties?.length);
  };

  const prevSimilar = () => {
    setSimilarIndex(
      (prev) =>
        (prev - 1 + similarProperties?.length) % similarProperties?.length
    );
  };

  const handleContactClick = (type: "chat" | "email") => {
    if (!user) {
      if (type === "email") {
        setRedirectUrl(`/property/${data?.property?.id}/email`);
      } else {
        setRedirectUrl(`/property/${propertyData?.id}/chat`);
      }
      setShowAuthPrompt(true);
      return;
    }

    if (type === "email") {
      setShowEmailFormModal(true);
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

  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email);
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setShowLoginModal(true);
    // router.push(`/property/${propertyData?.id}/email`);
  };

  const isLoading = isFetching || isFetchingProperties;

  // Show loading state
  if (isLoading) {
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
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The property you're looking for might have been removed or is no
            longer available.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/search")} variant="default">
              Browse Properties
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no property data
  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Property Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load the property information. Please try again.
          </p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()} variant="default">
              Try Again
            </Button>
            <Button onClick={() => router.push("/search")} variant="outline">
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/dashboard/search")}
      >
        ← Back to search
      </Button>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/search"
          className="text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 dark:text-white">
          Property Information
        </span>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={
              displayImages(propertyData?.images)[currentImageIndex] ||
              "/placeholder.svg"
            }
            alt="Property main image"
            width={800}
            height={600}
            className="w-full h-[500px] object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-rows-3 gap-4">
          {displayImages(propertyData?.images)
            .slice(1, 4)
            .map((image: string, index: number) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Property image ${index + 2}`}
                  width={400}
                  height={300}
                  className="w-full h-[158px] object-cover"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{propertyData?.name}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                {`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}, ${propertyData?.zipcode}`}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSaveModal(true)}
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-3xl font-bold mb-6">
            {formatPrice(
              Number(
                type === "ENTIRE_PROPERTY"
                  ? propertyData?.price
                  : propertyInfo?.price
              )
            )}{" "}
            <span className="text-base font-normal text-gray-600 dark:text-gray-400">
              {propertyData?.priceFrequency === "MONTHLY"
                ? "per month"
                : "per year"}
            </span>
          </div>

          {/* Property Type and Basic Info */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Property Type
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium">
                    {type
                      ?.replace(/_/g, " ")
                      ?.toLowerCase()
                      ?.replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                      "House"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Bedrooms
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium text-2xl">
                    {propertyInfo?.bedrooms || 0}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Bathrooms
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium text-2xl">
                    {propertyInfo?.bathrooms || 0}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Size
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium">
                    {propertyInfo?.area || "N/A"} sqm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p
                className={`text-gray-600 dark:text-gray-400 ${
                  showAllDescription ? "line-clamp-none" : "line-clamp-3"
                }`}
              >
                {propertyData?.description}{" "}
              </p>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowAllDescription(!showAllDescription)}
              >
                {showAllDescription ? "Read less" : "Read more"}
              </span>
            </div>

            {/* Letting Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 mb-6">
              <h2 className="text-xl font-semibold mb-4">Letting details</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Let available date:
                  </div>
                  <div className="font-medium">
                    {data?.property?.availability || "Available now"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Deposit:
                  </div>
                  <div className="font-medium">
                    {data?.property?.securityDeposit &&
                    data.property.securityDeposit !== "0"
                      ? formatPrice(Number(data.property.securityDeposit))
                      : "Ask agent"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Min. Tenancy:
                  </div>
                  <div className="font-medium">
                    {data?.property?.rentalTerms
                      ? `${data.property.rentalTerms} months`
                      : "Ask agent"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Let type:
                  </div>
                  <div className="font-medium">
                    {data?.property?.rentalPeriod === "MONTHLY"
                      ? "Long term"
                      : "Ask agent"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Furnish type:
                  </div>
                  <div className="font-medium">
                    {data?.property?.furnished ? "Furnished" : "Unfurnished"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Council Tax:
                  </div>
                  <div className="font-medium">
                    Band {data?.property?.councilTaxBand || "Ask agent"}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            {data?.property?.keyFeatures?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Key features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {data?.property?.keyFeatures?.map(
                    (feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">
                          {feature
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700 space-y-5">
              <h2 className="text-xl font-semibold mb-4">Location on map</h2>
              {data?.property?.latitude && data?.property?.longitude ? (
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      Number(data.property.longitude) - 0.01
                    },${Number(data.property.latitude) - 0.01},${
                      Number(data.property.longitude) + 0.01
                    },${
                      Number(data.property.latitude) + 0.01
                    }&layer=mapnik&marker=${data.property.latitude},${
                      data.property.longitude
                    }`}
                    style={{ border: 0, borderRadius: "8px" }}
                    title={`Map showing ${data?.property?.name}`}
                  ></iframe>
                </div>
              ) : (
                <div className="h-[300px] rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Location not available
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() =>
                        window.open(
                          `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                            `${data?.property?.city}, ${data?.property?.country}` ||
                              ""
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      View on OpenStreetMap
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <h3 className="font-semibold mb-2">Nearest stations</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Vauxhall Station - 0.7 miles</div>
                    <div>Fulham Broadway - 0.8 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nearest schools</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nearest malls</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full relative",
                    "ring-2",
                    propertyData?.landlord?.isActive
                      ? "ring-red-500"
                      : "ring-gray-300"
                  )}
                >
                  <Image
                    src={
                      propertyData?.landlord?.user?.profile?.profileUrl ||
                      "/placeholder.svg"
                    }
                    alt={propertyData?.landlord?.name || ""}
                    fill
                    className="rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                {true && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div className="font-semibold max-w-[150px] line-clamp-1">
                  {formatName(
                    propertyData?.landlord?.user?.profile?.firstName,
                    propertyData?.landlord?.user?.profile?.lastName,
                    propertyData?.landlord?.user?.profile?.fullname
                  )}
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
              Enquire about this property
            </Button>

            <LandlordProfileModal
              isOpen={showLandlordProfile}
              onClose={() => setShowLandlordProfile(false)}
              landlord={{
                name: formatName(
                  propertyData?.landlord?.user?.profile?.firstName,
                  propertyData?.landlord?.user?.profile?.lastName,
                  propertyData?.landlord?.user?.profile?.fullname
                ),
                email: propertyData?.landlord?.user?.email || null || undefined,
                image:
                  propertyData?.landlord?.user?.profile?.profileUrl ||
                  undefined,
                id: propertyData?.landlord?.id,
                isActive: propertyData?.landlord?.isActive
              }}
              onChatClick={() => handleContactClick("chat")}
              onEmailClick={() => handleContactClick("email")}
            />
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div>
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

      <PreChatModal
        isOpen={showPreChatModal}
        onClose={() => setShowPreChatModal(false)}
        onSubmit={handlePreChatSubmit}
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        landlord={{
          name: formatName(
            propertyData?.landlord?.user?.profile?.firstName,
            propertyData?.landlord?.user?.profile?.lastName,
            propertyData?.landlord?.user?.profile?.fullname
          ),
          image: propertyData?.landlord?.user?.profile?.profileUrl || "",
          role: "Landlord",
          id: propertyData?.landlord?.id
        }}
        propertyId={Number(id)}
      />

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onSignIn={() => {
          setShowAuthPrompt(false);
          setShowLoginModal(true);
        }}
        onSignUp={() => {
          setShowAuthPrompt(false);
          setShowSignUpModal(true);
        }}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        onVerificationNeeded={handleVerificationNeeded}
      />

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={verificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
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
            ? `${window.location.origin}/property/${id}`
            : `/property/${id}`
        }
      />

      <EmailFormModal
        isOpen={showEmailFormModal}
        onClose={() => setShowEmailFormModal(false)}
        propertyDetails={data?.property}
      />
    </div>
  );
}
