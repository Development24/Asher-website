"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { cn, formatPrice, getPropertyPrice, getBedroomCount, getBathroomCount, getPropertyLocation } from "@/lib/utils";
import { Listing } from "@/services/property/types";
import { useLikeProperty } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { userStore } from "@/store/userStore";
import { displayImages } from "../property/[id]/utils";

interface SimilarPropertyCard {
  className?: string;
  property?: Listing;
}

export default function SimilarPropertyCard({
  className,
  property
}: SimilarPropertyCard) {
  console.log(property, "Coming from similar properties");
  const [isHovered, setIsHovered] = useState(false);
  const user = userStore((state) => state.user);
  const userId = user?.landlords?.userId;
  const propertyId = property?.property?.propertyId;
  const {
    mutate: likeProperty,
    isPending: isLikePending,
    isSuccess: isLikeSuccess
  } = useLikeProperty(String(propertyId));
  const propertyLiked = property?.property?.UserLikedProperty?.some(
    (likedProperty) => likedProperty.userId === userId
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
    <Link href={`/property/${property?.id}`}>
      <motion.div
        className={cn(
          "group bg-white rounded-lg shadow-sm transition-shadow duration-200 min-w-[300px] sm:min-w-0 sm:text-base sm:p-2",
          className
        )}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.18)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
          <Image
            src={displayImages(property?.property?.images)?.[0] || "/placeholder.svg"}
            alt={String(property?.property?.name || 'Property')}
            fill
            className="object-cover"
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.src = "/placeholder.svg"; 
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-opacity ${
              propertyLiked || isLikeSuccess
                ? "opacity-100"
                : isHovered
                ? "opacity-100"
                : "opacity-0"
            }`}
            onClick={handleSaveClick}
          >
            <Heart
              className={`w-12 h-12 sm:w-8 sm:h-8 ${
                propertyLiked || isLikeSuccess
                  ? "fill-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <div className="p-4 sm:p-2">
          <div className="flex justify-between items-start mb-1 sm:mb-0.5">
            <h3 className="font-semibold text-lg sm:text-base line-clamp-1 text-neutral-900">
              {property?.property?.name || 'Property name not available'}
            </h3>
            <span className="text-primary-500 font-semibold sm:text-base ml-2 whitespace-nowrap">
              {getPropertyPrice(property?.property)}
            </span>
          </div>

          <p className="text-neutral-600 text-sm sm:text-xs mb-2 sm:mb-1 line-clamp-2">
            {getPropertyLocation(property?.property)}
          </p>

          <div className="flex items-center gap-4 sm:gap-2 text-sm sm:text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4 sm:w-3 sm:h-3" />
              {getBedroomCount(property?.property)} bedroom{getBedroomCount(property?.property) !== '1' ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4 sm:w-3 sm:h-3" />
              {getBathroomCount(property?.property)} bathroom{getBathroomCount(property?.property) !== '1' ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
