"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { Listing } from "@/services/property/types";
import { formatPrice } from "@/lib/utils";
import { useLikeProperty } from "@/services/property/propertyFn";
import { useState } from "react";
import { userStore } from "@/store/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { displayImages } from '../../property/[id]/utils';

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
  property
}: PropertyCardProps) {
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  const propertyData = property?.properties ?? property?.property;
  const [isHovered, setIsHovered] = useState(false);
  const user = userStore((state) => state.user);
  const userId = user?.landlords?.userId;
  console.log(property, "Coming from property card");
  const propertyId = property?.propertyId;
  const {
    mutate: likeProperty,
    isPending: isLikePending,
    isSuccess: isLikeSuccess
  } = useLikeProperty(String(propertyId));
  const propertyLiked = propertyData?.UserLikedProperty?.some(
    (likedProperty) => likedProperty?.userId === userId
  );

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeProperty();
    //     toggleSaveProperty({
    //       id,
    //       image,
    //       title,
    //       price,
    //       location,
    //  specs
    //     })
    // console.log(property)
  };

  if (isLikePending) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }
  return (
    <Card className="overflow-hidden group min-h-[430px] flex flex-col justify-between">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={displayImages(propertyData?.images)[0] || "/images/property-placeholder.png"}
            alt={propertyData?.name || "Property placeholder"}
            fill
            className="object-cover"
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
                ? "fill-red-600 text-red-600"
                : "text-grey-600"
            }`}
          />
        </motion.button>
        {(showViewProperty ||
          viewType === "invite" ||
          viewType === "schedule") && (
          <Link href={viewLink || `/property/${property?.id}`}>
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
          <h3 className="font-semibold">{propertyData?.name}</h3>
          <span className="text-red-600 font-semibold">
            {formatPrice(Number(propertyData?.price))}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}`}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {propertyData?.bedrooms || "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {propertyData?.bathrooms || "N/A"}
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
      </div>
    </Card>
  );
}
