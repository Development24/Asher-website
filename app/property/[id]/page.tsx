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
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRedirectStore } from "@/store/authRedirect";
import { displayImages, filteredImageUrls, ImageObject } from "./utils";
import { EmailFormModal } from "@/app/components/email/EmailFormModal";
import { useEmailFormModal } from "@/hooks/useEmailFormModal";
import { trackPropertyView } from "@/services/analytics/propertyAnalytics";
import { RelatedListingsSection } from "@/app/components/RelatedListingsSection";
import { MapWithAmenities, SimpleMap } from "@/components/maps";

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
  
  // Handle normalized structure
  const isNormalized = data?.property?.listingEntity && data?.property?.property;
  
  // Get listing data (normalized or legacy)
  const listing = data?.property;
  const listingType = isNormalized 
    ? listing?.listingType 
    : listing?.type;
  
  // Get the entity being listed (room/unit/property)
  const listingEntity = isNormalized 
    ? listing?.listingEntity 
    : (listingType === "SINGLE_UNIT" ? listing?.unit : listingType === "ROOM" ? listing?.room : null);
  
  // Get property context
  const propertyData = isNormalized 
    ? listing?.property 
    : (listing?.property as Property | undefined);
  
  // Get property info for specs (bedrooms, bathrooms, etc.)
  const propertyInfo = isNormalized
    ? (listingType === "ENTIRE_PROPERTY" 
        ? listing?.property 
        : listing?.specification?.residential || listing?.property)
    : (listingType === "ENTIRE_PROPERTY" ? listing?.property : listingEntity);

  // Track property view when component mountsy);
  useEffect(() => {
    if (id && propertyData) {
      // Track property view for analytics
      trackPropertyView(id as string);
    }
  }, [id, propertyData]);

  // Get images for gallery navigation
  const getImages = () => {
    if (isNormalized && listing) {
      const images = listing.listingEntity.images.length > 0 
        ? listing.listingEntity.images 
        : listing.property.images;
      // Return image objects, not URLs - displayImages expects objects
      return images || [];
    }
    return propertyData?.images || [];
  };
  
  const allImages = getImages();
  const imageUrls = displayImages(allImages);
  const imageCount = imageUrls.length || propertyImages.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageCount) % imageCount
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
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="mb-2 w-32 h-6" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
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

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto w-16 h-16 text-gray-400"
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Property Not Found
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto w-16 h-16 text-gray-400"
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            No Property Data
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
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
      {/* Hierarchy Breadcrumb */}
      {listing?.hierarchy ? (
        <div className="mb-6 bg-white border-b">
          <div className="flex items-center py-3 space-x-2 text-sm">
            {listing.hierarchy.breadcrumb.map(
              (item: any, index: number) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  {item.url ? (
                    <Link
                      href={item.url}
                      className={`text-gray-600 hover:text-gray-900 ${
                        index === listing.hierarchy.breadcrumb.length - 1
                          ? "font-medium text-gray-900"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span
                      className={`text-gray-500 ${
                        index === listing.hierarchy.breadcrumb.length - 1
                          ? "font-medium text-gray-900"
                          : ""
                      }`}
                      title="Property not listed"
                    >
                      {item.name}
                    </span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>
      ) : (
        /* Fallback breadcrumb */
        <div className="flex gap-2 items-center mb-6 text-sm">
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
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <div className="overflow-hidden relative rounded-lg md:col-span-2">
          <Image
            src={
              imageUrls[currentImageIndex] ||
              "/placeholder.svg"
            }
            alt="Property main image"
            width={800}
            height={600}
            className="w-full h-[500px] object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 p-2 text-white rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 p-2 text-white rounded-full -translate-y-1/2 bg-black/50 hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-rows-3 gap-4">
          {imageUrls
            .slice(1, 4)
            .map((image: string, index: number) => (
              <div key={index} className="overflow-hidden relative rounded-lg">
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
      <div className="grid gap-8 mb-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              {/* Context Banner */}
              {listing?.hierarchy && (
                <div className="flex gap-4 items-center mb-4">
                  <div className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    {listing.hierarchy.level.toUpperCase()}
                  </div>
                  <div>
                    <h1 className="mb-2 text-3xl font-bold">
                      {isNormalized 
                        ? listing.listingEntity.name 
                        : propertyData?.name}
                    </h1>
                    {/* Show property context for rooms/units only */}
                    {listing.hierarchy.level !== 'property' && listing?.property?.name && (
                      <p className="text-sm text-gray-600">
                        in {listing.property.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!listing?.hierarchy && (
                <h1 className="mb-2 text-3xl font-bold">
                  {isNormalized 
                    ? listing?.listingEntity?.name 
                    : propertyData?.name}
                </h1>
              )}

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="mr-1 w-4 h-4" />
                {`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}, ${propertyData?.zipcode}`}
              </div>
            </div>
            <div className="flex gap-4 items-center">
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

          <div className="mb-6 text-3xl font-bold">
            {formatPrice(
              Number(
                isNormalized
                  ? listing?.price
                  : (listingType === "ENTIRE_PROPERTY"
                      ? propertyData?.price
                      : propertyInfo?.price)
              ),
              propertyData?.currency || "USD"
            )}{" "}
            <span className="text-base font-normal text-gray-600 dark:text-gray-400">
              {(isNormalized 
                ? listing?.priceFrequency 
                : propertyData?.priceFrequency) === "MONTHLY"
                ? "per month"
                : "per year"}
            </span>
          </div>

          {/* Property Type and Basic Info */}
          <div className="p-6 mb-6 bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="mb-1 text-sm tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  Property Type
                </div>
                <div className="flex justify-center items-center">
                  <span className="font-medium">
                    {isNormalized
                      ? (listingType
                          ?.replace(/_/g, " ")
                          ?.toLowerCase()
                          ?.replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                          "House")
                      : (listingType
                          ?.replace(/_/g, " ")
                          ?.toLowerCase()
                          ?.replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                          "House")}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  Bedrooms
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-2xl font-medium">
                    {isNormalized
                      ? (listing?.specification?.residential?.bedrooms || listing?.property?.bedrooms || 0)
                      : (propertyInfo?.bedrooms || 0)}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  Bathrooms
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-2xl font-medium">
                    {isNormalized
                      ? (listing?.specification?.residential?.bathrooms || listing?.property?.bathrooms || 0)
                      : (propertyInfo?.bathrooms || 0)}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  Size
                </div>
                <div className="flex justify-center items-center">
                  <span className="font-medium">
                    {isNormalized
                      ? (listing?.specification?.residential?.totalArea 
                          ? `${listing.specification.residential.totalArea} ${listing.specification.residential.areaUnit || 'sqm'}`
                          : listingEntity?.roomSize || "N/A")
                      : (propertyInfo?.area || "N/A")} {!isNormalized && "sqm"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p
                className={`text-gray-600 dark:text-gray-400 ${
                  showAllDescription ? "line-clamp-none" : "line-clamp-3"
                }`}
              >
                {isNormalized
                  ? (listingEntity?.description || listing?.property?.description || "")
                  : propertyData?.description}{" "}
              </p>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowAllDescription(!showAllDescription)}
              >
                {showAllDescription ? "Read less" : "Read more"}
              </span>
            </div>

            {/* Letting Details */}
            <div className="p-6 mb-6 bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <h2 className="mb-4 text-xl font-semibold">Letting details</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Let available date:
                  </div>
                  <div className="font-medium">
                    {isNormalized
                      ? (listing?.availableFrom 
                          ? new Date(listing.availableFrom).toLocaleDateString()
                          : "Available now")
                      : (data?.property?.availability || "Available now")}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Deposit:
                  </div>
                  <div className="font-medium">
                    {(() => {
                      const deposit = isNormalized
                        ? listing?.securityDeposit
                        : data?.property?.securityDeposit;
                      return deposit && deposit !== "0"
                        ? formatPrice(
                            Number(deposit),
                            propertyData?.currency || "USD"
                          )
                        : "Ask agent";
                    })()}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Min. Tenancy:
                  </div>
                  <div className="font-medium">
                    {isNormalized
                      ? (listing?.specification?.residential?.rentalTerms
                          ? `${listing.specification.residential.rentalTerms} months`
                          : "Ask agent")
                      : (data?.property?.rentalTerms
                          ? `${data.property.rentalTerms} months`
                          : "Ask agent")}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Let type:
                  </div>
                  <div className="font-medium">
                    {isNormalized
                      ? (listing?.priceFrequency === "MONTHLY"
                          ? "Long term"
                          : "Ask agent")
                      : (data?.property?.rentalPeriod === "MONTHLY"
                          ? "Long term"
                          : "Ask agent")}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Furnish type:
                  </div>
                  <div className="font-medium">
                    {isNormalized
                      ? (listingEntity?.furnished !== undefined
                          ? (listingEntity.furnished ? "Furnished" : "Unfurnished")
                          : (listing?.specification?.residential?.furnished
                              ? "Furnished"
                              : "Unfurnished"))
                      : (data?.property?.furnished ? "Furnished" : "Unfurnished")}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Council Tax:
                  </div>
                  <div className="font-medium">
                    Band {isNormalized
                      ? (listing?.specification?.residential?.councilTaxBand || "Ask agent")
                      : (data?.property?.councilTaxBand || "Ask agent")}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            {((isNormalized 
                ? listing?.property?.keyFeatures 
                : data?.property?.keyFeatures)?.length > 0) && (
              <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 className="mb-4 text-xl font-semibold">Key features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {(isNormalized 
                    ? listing?.property?.keyFeatures 
                    : data?.property?.keyFeatures)?.map(
                    (feature: string, index: number) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Check className="flex-shrink-0 w-4 h-4 text-primary" />
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

            <div className="p-6 space-y-5 bg-white rounded-lg border border-gray-100 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <h2 className="mb-4 text-xl font-semibold">Location on map</h2>
              {(() => {
                const lat = isNormalized 
                  ? listing?.property?.latitude 
                  : data?.property?.property?.latitude;
                const lng = isNormalized 
                  ? listing?.property?.longitude 
                  : data?.property?.property?.longitude;
                
                return lat && lng ? (
                  <MapWithAmenities
                    latitude={Number(lat)}
                    longitude={Number(lng)}
                    zoom={15}
                    title="Property Location with Nearby Amenities"
                    amenityTypes={[
                      "restaurant",
                      "hospital",
                      "school",
                      "shopping_mall",
                      "gas_station",
                      "bank"
                    ]}
                    radius={2}
                    height="500px"
                  />
                ) : (
                <div className="h-[300px] rounded-lg bg-gray-100 dark:bg-gray-800 relative overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="flex absolute inset-0 flex-col gap-4 justify-center items-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Location not available
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() =>
                        window.open(
                          `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                            `${isNormalized 
                              ? listing?.property?.city 
                              : data?.property?.city}, ${isNormalized 
                              ? listing?.property?.country 
                              : data?.property?.country}` ||
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
                );
              })()}
              {/* <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-3">
                <div>
                  <h3 className="mb-2 font-semibold">Nearest stations</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Vauxhall Station - 0.7 miles</div>
                    <div>Fulham Broadway - 0.8 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Nearest schools</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Nearest malls</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-4 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex gap-4 items-center mb-6">
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
                      (isNormalized
                        ? listing?.property?.landlord?.user?.profile?.profileUrl
                        : propertyData?.landlord?.user?.profile?.profileUrl) ||
                      "/placeholder.svg"
                    }
                    alt={
                      isNormalized
                        ? listing?.property?.landlord?.user?.profile?.fullname || ""
                        : propertyData?.landlord?.name || ""
                    }
                    fill
                    className="object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                {true && (
                  <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <div className="font-semibold max-w-[150px] line-clamp-1">
                  {formatName(
                    isNormalized
                      ? listing?.property?.landlord?.user?.profile?.firstName
                      : propertyData?.landlord?.user?.profile?.firstName,
                    isNormalized
                      ? listing?.property?.landlord?.user?.profile?.lastName
                      : propertyData?.landlord?.user?.profile?.lastName,
                    isNormalized
                      ? listing?.property?.landlord?.user?.profile?.fullname
                      : propertyData?.landlord?.user?.profile?.fullname
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
              Enquire about this property
            </Button>

            <LandlordProfileModal
              isOpen={showLandlordProfile}
              onClose={() => setShowLandlordProfile(false)}
              landlord={{
                name: formatName(
                  isNormalized
                    ? listing?.property?.landlord?.user?.profile?.firstName
                    : propertyData?.landlord?.user?.profile?.firstName,
                  isNormalized
                    ? listing?.property?.landlord?.user?.profile?.lastName
                    : propertyData?.landlord?.user?.profile?.lastName,
                  isNormalized
                    ? listing?.property?.landlord?.user?.profile?.fullname
                    : propertyData?.landlord?.user?.profile?.fullname
                ),
                email: isNormalized
                  ? listing?.property?.landlord?.user?.email
                  : propertyData?.landlord?.user?.email || null || undefined,
                image:
                  (isNormalized
                    ? listing?.property?.landlord?.user?.profile?.profileUrl
                    : propertyData?.landlord?.user?.profile?.profileUrl) ||
                  undefined,
                id: isNormalized
                  ? listing?.property?.landlord?.id
                  : propertyData?.landlord?.id,
                isActive: isNormalized
                  ? true // Normalized structure doesn't have isActive, assume true
                  : propertyData?.landlord?.isActive
              }}
              onChatClick={() => handleContactClick("chat")}
              onEmailClick={() => handleContactClick("email")}
            />
          </div>

          {/* Related Listings Section */}
          {listing?.hierarchy && (
            <RelatedListingsSection
              propertyId={listing.hierarchy.propertyId}
              excludeListingId={id as string}
              className="mt-6"
            />
          )}
        </div>
      </div>

      {/* Similar Properties */}
      <div>
        <div className="flex justify-between items-center mb-6">
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

        <div className="overflow-hidden relative">
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
              ?.filter((p) => {
                const pId = isNormalized ? p.listingId : p.id;
                const currentId = isNormalized ? listing?.listingId : propertyData?.id;
                return pId !== currentId;
              })
              ?.map((similarProperty) => (
                <div key={isNormalized ? similarProperty.listingId : similarProperty.id}>
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
            isNormalized
              ? listing?.property?.landlord?.user?.profile?.firstName
              : propertyData?.landlord?.user?.profile?.firstName,
            isNormalized
              ? listing?.property?.landlord?.user?.profile?.lastName
              : propertyData?.landlord?.user?.profile?.lastName,
            isNormalized
              ? listing?.property?.landlord?.user?.profile?.fullname
              : propertyData?.landlord?.user?.profile?.fullname
          ),
          image: (isNormalized
            ? listing?.property?.landlord?.user?.profile?.profileUrl
            : propertyData?.landlord?.user?.profile?.profileUrl) || "",
          role: "Landlord",
          id: isNormalized
            ? listing?.property?.landlord?.id
            : propertyData?.landlord?.id
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
        propertyTitle={
          isNormalized
            ? listing?.listingEntity?.name
            : propertyData?.name
        }
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        propertyTitle={
          isNormalized
            ? listing?.listingEntity?.name
            : propertyData?.name
        }
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
