"use client";

import { useState, memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { cn, getPropertyPrice, getBedroomCount, getBathroomCount, getPropertyLocation } from "@/lib/utils";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { Listing } from "@/services/property/types";
import { useLikeProperty } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { userStore } from "@/store/userStore";
import { displayImages } from "../property/[id]/utils";

interface SimilarPropertyCard {
  className?: string;
  property?: Listing;
}

const SimilarPropertyCard = memo(function SimilarPropertyCard({
  className,
  property
}: SimilarPropertyCard) {
  const [isHovered, setIsHovered] = useState(false);
  const user = userStore((state) => state.user);
  
  const memoizedValues = useMemo(() => {
    const userId = user?.landlords?.userId;
    
    // Use normalized structure if available, otherwise fallback to legacy
    const isNormalized = property?.listingEntity && property?.property;
    
    // Get property ID for likes
    // For normalized: use property.id
    // For legacy: use property.propertyId or property.property?.propertyId
    let propertyId: string | undefined;
    if (isNormalized) {
      propertyId = (property as any)?.property?.id;
    } else {
      const legacyProperty = property as any;
      propertyId = legacyProperty?.property?.propertyId || legacyProperty?.propertyId;
    }
    
    // Check if property is liked (only available in legacy structure)
    let propertyLiked = false;
    if (!isNormalized) {
      const legacyProperty = property as any;
      propertyLiked = legacyProperty?.property?.UserLikedProperty?.some(
        (likedProperty: any) => likedProperty.userId === userId
      ) || false;
    }
    
    // Get images - prefer listingEntity images (room/unit specific), fallback to property images
    let images: any[] = [];
    if (isNormalized) {
      images = property.listingEntity.images.length > 0 
        ? property.listingEntity.images 
        : property.property.images;
    } else {
      images = property?.property?.images || [];
    }
    
    // Extract URL from image object or use string directly
    const imageUrl = images.length > 0 
      ? (typeof images[0] === 'string' 
          ? images[0] 
          : images[0]?.url || "/placeholder.svg")
      : "/placeholder.svg";
    
    // Get display name - use listingEntity name (room name for rooms, unit name for units, property name for properties)
    const propertyName = isNormalized
      ? property.listingEntity.name
      : property?.property?.name || 'Property';
    
    // Get price and currency for conversion
    const propertyPriceValue = isNormalized
      ? property.price
      : (property?.property?.price || property?.property?.rentalFee || property?.property?.marketValue || property?.property?.rentalPrice || 0);
    
    const priceCurrency = isNormalized
      ? (property.property?.currency || (property.property?.landlord?.user?.profile?.fullname ? 'NGN' : 'USD'))
      : (property?.property?.currency || 'USD');
    
    // Get location from property context
    const propertyLocation = isNormalized
      ? getPropertyLocation(property.property)
      : getPropertyLocation(property?.property);
    
    // Get bedroom/bathroom count from specification or property
    const bedroomCount = isNormalized
      ? String(property.specification?.residential?.bedrooms || property.property.bedrooms || 'N/A')
      : getBedroomCount(property?.property);
    
    const bathroomCount = isNormalized
      ? String(property.specification?.residential?.bathrooms || property.property.bathrooms || 'N/A')
      : getBathroomCount(property?.property);
    
    // Get listing ID for navigation
    const listingId = isNormalized ? property.listingId : property?.id;
    
    return {
      userId,
      propertyId,
      propertyLiked,
      imageUrl,
      propertyName,
      propertyPriceValue,
      priceCurrency,
      propertyLocation,
      bedroomCount,
      bathroomCount,
      listingId
    };
  }, [property, user]);

  const {
    mutate: likeProperty,
    isPending: isLikePending,
    isSuccess: isLikeSuccess
  } = useLikeProperty(String(memoizedValues.propertyId));

  // Format price with currency conversion
  const propertyPrice = useCurrencyFormat(
    memoizedValues.propertyPriceValue,
    memoizedValues.priceCurrency
  );

  const handleSaveClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeProperty();
  }, [likeProperty]);

  if (isLikePending) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  return (
    <Link href={`/property/${memoizedValues.listingId || property?.id || property?.listingId}`}>
      <motion.div
        className={cn(
          "bg-white rounded-lg shadow-sm transition-shadow duration-200 group !min-w-[300px] min-h-[400px] sm:min-w-0 sm:text-base sm:p-2",
          className
        )}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.18)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden relative rounded-t-lg aspect-square">
          {/* Hierarchy Badge */}
          {property?.hierarchy && (
            <div className="absolute top-2 left-2 z-10">
              <div className="px-2 py-1 text-xs font-medium text-white rounded-md bg-black/70">
                {property.hierarchy.level.toUpperCase()}
              </div>
            </div>
          )}
          
          <Image
            src={memoizedValues.imageUrl}
            alt={memoizedValues.propertyName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.src = "/placeholder.svg"; 
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-opacity ${
              memoizedValues.propertyLiked || isLikeSuccess
                ? "opacity-100"
                : isHovered
                ? "opacity-100"
                : "opacity-0"
            }`}
            onClick={handleSaveClick}
          >
            <Heart
              className={`w-12 h-12 sm:w-8 sm:h-8 ${
                memoizedValues.propertyLiked || isLikeSuccess
                  ? "fill-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <div className="flex flex-col justify-between p-4 sm:p-2">
          <div className="flex justify-between items-start mb-1 sm:mb-0.5">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold sm:text-base line-clamp-1 text-neutral-900">
                {memoizedValues.propertyName}
              </h3>
              {/* Show property name for rooms/units only - more subtle */}
              {property?.hierarchy && property.hierarchy.level !== 'property' && property?.property?.name && (
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                  in {property.property.name}
                </p>
              )}
            </div>
            <span className="ml-2 font-semibold whitespace-nowrap text-primary-500 sm:text-base">
              {propertyPrice}
            </span>
          </div>

          <p className="mb-2 text-sm text-neutral-600 sm:text-xs sm:mb-1 line-clamp-2">
            {memoizedValues.propertyLocation}
          </p>

          <div className="flex gap-4 items-center text-sm sm:gap-2 sm:text-xs text-neutral-600">
            <span className="flex gap-1 items-center">
              <Bed className="w-4 h-4 sm:w-3 sm:h-3" />
              {memoizedValues.bedroomCount} bedroom{memoizedValues.bedroomCount !== '1' ? 's' : ''}
            </span>
            <span className="flex gap-1 items-center">
              <Bath className="w-4 h-4 sm:w-3 sm:h-3" />
              {memoizedValues.bathroomCount} bathroom{memoizedValues.bathroomCount !== '1' ? 's' : ''}
            </span>
          </div>
          
          {/* Related Listings Preview */}
          {property?.relatedListings && property.relatedListings.totalCount > 0 && (
            <div className="pt-3 mt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {property.relatedListings.totalCount} other space{property.relatedListings.totalCount !== 1 ? 's' : ''} available in this building
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
});

export default SimilarPropertyCard;
