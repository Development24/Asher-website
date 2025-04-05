"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { cn, formatPrice } from "@/lib/utils";
import { Listing } from "@/services/property/types";
import { useLikeProperty } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { userStore } from "@/store/userStore";
interface SimilarPropertyCard {
  id?: number;
  image?: string;
  title?: string;
  price?: string;
  location?: string;
  beds?: number;
  baths?: number;
  date?: string;
  time?: string;
  showViewProperty?: boolean;
  isInvite?: boolean;
  onAcceptInvite?: () => void;
  isScheduled?: boolean;
  isSaved?: boolean;
  className?: string;
  property?: Listing;
}

export default function SimilarPropertyCard({
  id,
  image,
  title,
  price,
  location,
  beds,
  baths,
  showViewProperty,
  isInvite,
  onAcceptInvite,
  isScheduled,
  isSaved: propIsSaved = false,
  className,
  property
}: SimilarPropertyCard) {
  const { toggleSaveProperty } = useSavedProperties();
  const [isHovered, setIsHovered] = useState(false);
  const user = userStore((state) => state.user);
  const userId = user?.landlords?.userId;
  const propertyId = property?.property?.id;
  const {
    mutate: likeProperty,
    isPending: isLikePending,
    isSuccess: isLikeSuccess
  } = useLikeProperty(String(propertyId));
  const propertyLiked = property?.property?.UserLikedProperty.some(
    (likedProperty) => likedProperty.userId === userId
  );

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeProperty();
    // toggleSaveProperty({
    //   id,
    //   image,
    //   title,
    //   price,
    //   location,
    //   // specs: {
    //   //   bedrooms: beds,
    //   //   bathrooms: baths,
    //   // },
    // })
  };

  if (isLikePending) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  return (
    <Link href={`/property/${property?.property?.id}`}>
      <div
        className={cn(
          "group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[300px]",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
          <Image
            src={property?.property?.images[0] || "/placeholder.svg"}
            alt={String(property?.property?.name)}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-opacity ${
              propertyLiked || isLikeSuccess ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleSaveClick}
          >
            <Heart
              className={`w-12 h-12 ${
                propertyLiked || isLikeSuccess ? "fill-red-600 text-red-600" : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">
              {property?.property?.name}
            </h3>
            <span className="text-red-600 font-semibold">{`${formatPrice(
              Number(property?.property?.rentalFee)
            )}`}</span>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            {property?.property?.city}, {property?.property?.state?.name},{" "}
            {property?.property?.country}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property?.property?.noBedRoom} bedrooms
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property?.property?.noBathRoom} bathrooms
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
