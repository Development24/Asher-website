"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { Listing } from "@/services/property/types";
import { getPropertyPrice, getBedroomCount, getBathroomCount, getPropertyLocation } from "@/lib/utils";
import { FormattedPrice } from "@/components/FormattedPrice";
import { useLikeProperty } from "@/services/property/propertyFn";
import { useState } from "react";
import { userStore } from "@/store/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { displayImages } from '../../property/[id]/utils';
import { animations, animationClasses } from "@/lib/animations";
import { EnquiryStatusIndicator } from "@/components/EnquiryStatusIndicator";

interface PropertyCardProps {
  id?: number | string;
  image?: string;
  title?: string;
  price?: string;
  location?: string;
  specs?: {
    beds: number;
    baths: number;
  };
  date?: string;
  time?: string;
  tracked?: boolean;
  showFeedback?: boolean;
  viewType?: "invite" | "schedule" | "property";
  viewLink?: string;
  isInvite?: boolean;
  onAcceptInvite?: () => void;
  isScheduled?: boolean;
  onFeedbackClick?: () => void;
  showViewProperty?: boolean;
  property?: Listing;
  showEnquiryStatus?: boolean;
}

export function PropertyCard({
  id,
  image,
  title,
  price,
  location,
  specs,
  date,
  time,
  tracked,
  showFeedback,
  viewType,
  viewLink,
  isInvite,
  onAcceptInvite,
  isScheduled,
  onFeedbackClick,
  showViewProperty,
  property,
  showEnquiryStatus
}: PropertyCardProps) {
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  
  // Handle normalized structure
  const isNormalized = property?.listingEntity && property?.property;
  
  // Get property data (normalized or legacy)
  const propertyData = isNormalized
    ? property?.property
    : (property?.properties ?? property?.property);
  
  // Get listing entity (for normalized structure)
  const listingEntity = isNormalized ? property?.listingEntity : null;
  
  const [isHovered, setIsHovered] = useState(false);
  const user = userStore((state) => state.user);
  const userId = user?.landlords?.userId;
  
  // Get property ID for likes (normalized or legacy)
  const propertyId = isNormalized
    ? property?.property?.id
    : property?.propertyId;
  
  const {
    mutate: likeProperty,
    isPending: isLikePending,
    isSuccess: isLikeSuccess
  } = useLikeProperty(String(propertyId || property?.listingId || property?.id));
  
  // Check if property is liked (legacy structure only)
  const propertyLiked = !isNormalized && propertyData?.UserLikedProperty?.some(
    (likedProperty) => likedProperty?.userId === userId
  );

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeProperty();
  };

  if (isLikePending) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }
  
  return (
    <motion.div
      className="overflow-hidden group min-h-[430px] flex flex-col justify-between bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
      whileHover={animations.card.hover}
      whileTap={animations.card.tap}
      transition={animations.card.transition}
    >
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={
              displayImages(
                isNormalized && listingEntity?.images?.length > 0
                  ? listingEntity.images
                  : propertyData?.images
              )[0] || "/placeholder.svg"
            }
            alt={
              isNormalized
                ? listingEntity?.name || propertyData?.name || "Property placeholder"
                : propertyData?.name || "Property placeholder"
            }
            fill
            className="object-cover rounded-lg"
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.src = "/placeholder.svg"; 
            }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveClick}
          className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-opacity p-1 rounded-md ${
            propertyLiked || isLikeSuccess
              ? "opacity-100"
              : isHovered
              ? "opacity-100"
              : "opacity-100"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              propertyLiked || isLikeSuccess
                ? "fill-primary-500 text-primary-500"
                : "text-neutral-600"
            }`}
          />
        </motion.button>
        {(showViewProperty ||
          viewType === "invite" ||
          viewType === "schedule") && (
          <Link href={
            viewLink || 
            (isNormalized 
              ? `/property/${property?.listingId || property?.id}` 
              : `/property/${property?.id}`)
          }>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-3 right-3 bg-white/90 hover:bg-white"
            >
              {viewType === "invite"
                ? "View invite"
                : viewType === "schedule"
                ? "View schedule"
                : "View property"}
            </Button>
          </Link>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 line-clamp-2">
              {isNormalized
                ? listingEntity?.name || propertyData?.name || 'Property name not available'
                : propertyData?.name || 'Property name not available'}
            </h3>
            {/* Show property context for rooms/units */}
            {isNormalized && property?.hierarchy && property.hierarchy.level !== 'property' && property?.property?.name && (
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                in {property.property.name}
              </p>
            )}
          </div>
          <FormattedPrice
            amount={isNormalized
              ? (property?.price ? Number(property.price) : (propertyData?.price || propertyData?.rentalFee || propertyData?.marketValue || propertyData?.rentalPrice || 0))
              : (propertyData?.price || propertyData?.rentalFee || propertyData?.marketValue || propertyData?.rentalPrice || 0)}
            currency={propertyData?.currency || 'USD'}
            className="text-primary-500 font-semibold ml-2 whitespace-nowrap"
          />
        </div>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {getPropertyLocation(propertyData)}
        </p>
        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {isNormalized
              ? (property?.specification?.residential?.bedrooms || propertyData?.bedrooms || 0)
              : getBedroomCount(propertyData)} bed{(isNormalized
                ? (property?.specification?.residential?.bedrooms || propertyData?.bedrooms || 0)
                : propertyData?.bedrooms) !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {isNormalized
              ? (property?.specification?.residential?.bathrooms || propertyData?.bathrooms || 0)
              : getBathroomCount(propertyData)} bath{(isNormalized
                ? (property?.specification?.residential?.bathrooms || propertyData?.bathrooms || 0)
                : propertyData?.bathrooms) !== 1 ? 's' : ''}
          </span>
        </div>
        {showFeedback && onFeedbackClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFeedbackClick}
            className="w-full mt-4"
          >
            Leave feedback
          </Button>
        )}
        {viewType === "invite" && viewLink && (
          <Link href={viewLink}>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View invite
            </Button>
          </Link>
        )}
        {viewType === "schedule" && viewLink && (
          <Link href={viewLink}>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View schedule
            </Button>
          </Link>
        )}
        {showEnquiryStatus && propertyData?.id && (
          <EnquiryStatusIndicator
            propertyId={propertyData.id}
            variant="badge"
            showDate={true}
          />
        )}
      </div>
    </motion.div>
  );
}
