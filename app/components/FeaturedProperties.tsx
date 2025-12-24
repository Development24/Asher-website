"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { cn, getPropertyPrice, getBedroomCount, getBathroomCount, getPropertyLocation } from "@/lib/utils";
import { FormattedPrice } from "@/components/FormattedPrice";
import Link from "next/link";
import type React from "react";
import { useGetProperties } from "@/services/property/propertyFn";
import { Property, Listing } from "@/services/property/types";
import { Skeleton } from "@/components/ui/skeleton";
import { displayImages } from "../property/[id]/utils";

const properties = [
  {
    id: 1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XThvalCn27NjVEYyN5daXfRo5eWDjR.png", // Using the provided semi-detached house image
    title: "Modern Semi-Detached House",
    price: "250,000",
    location: "12 Oak Lane, Lagos, Nigeria",
    specs: {
      bedrooms: 3,
      bathrooms: 2
    }
  },
  {
    id: 2,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XThvalCn27NjVEYyN5daXfRo5eWDjR.png",
    title: "Elegant Family Home",
    price: "280,000",
    location: "15 Elm Street, Lagos, Nigeria",
    specs: {
      bedrooms: 3,
      bathrooms: 2
    }
  },
  {
    id: 3,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XThvalCn27NjVEYyN5daXfRo5eWDjR.png",
    title: "Contemporary Duplex",
    price: "450,000",
    location: "5 Unity Crescent, Ikeja, Lagos",
    specs: {
      bedrooms: 3,
      bathrooms: 2
    }
  }
];

const FeaturedPropertiesSkeleton = () => {
  return (
    <div className="flex overflow-x-scroll gap-6 pb-4 scrollbar-hide">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex-none w-[400px]">
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
            <div className="absolute top-4 right-4">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="w-48 h-6" /> {/* Property name */}
              <Skeleton className="w-24 h-6" /> {/* Price */}
            </div>
            <Skeleton className="w-3/4 h-4" /> {/* Location */}
            <div className="flex gap-4 items-center">
              <Skeleton className="w-24 h-4" /> {/* Bedrooms */}
              <Skeleton className="w-24 h-4" /> {/* Bathrooms */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function FeaturedProperties() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isPropertySaved, toggleSaveProperty } = useSavedProperties();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();

  const properties: Listing[] = propertiesData?.properties || [];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSaveProperty = (
    e: React.MouseEvent,
    property: Listing
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // toggleSaveProperty({
    //   id: property.id,
    //   image: property.image,
    //   title: property.title,
    //   price: property.price,
    //   location: property.location,
    //   specs: {
    //     bedrooms: property.specs.bedrooms,
    //     bathrooms: property.specs.bathrooms,
    //   },
    // })
  };

  if (!properties || isFetchingProperties) {
    return (
      <div className="py-16 layout">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="mb-2 w-48 h-8" /> {/* Title */}
            <Skeleton className="w-96 h-4" /> {/* Subtitle */}
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-lg" /> {/* Nav button */}
            <Skeleton className="w-10 h-10 rounded-lg" /> {/* Nav button */}
          </div>
        </div>
        <FeaturedPropertiesSkeleton />
      </div>
    );
  }

  return (
    <section className="overflow-hidden py-20 layout">
      <div className="px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <span className="block mb-2 text-sm font-semibold tracking-wider uppercase text-primary-500">
              FEATURED PROPERTIES
            </span>
            <h2 className="text-3xl font-bold md:text-4xl text-neutral-900">
              Explore handpicked homes tailored for you.
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <motion.div
          ref={scrollRef}
          className="flex overflow-x-scroll gap-6 pb-4 scrollbar-hide cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {properties?.map((property: Listing) => {
            // Handle normalized structure
            const isNormalized = property?.listingEntity && property?.property;
            const listingEntity = isNormalized ? property.listingEntity : null;
            const propertyData = isNormalized 
              ? property.property 
              : (property as any)?.property || (property as any)?.properties;
            
            // Get images - prefer listingEntity images, fallback to property images
            const images = isNormalized && listingEntity && listingEntity.images && listingEntity.images.length > 0
              ? listingEntity.images
              : propertyData?.images || [];
            const imageUrls = displayImages(images);
            const mainImage = imageUrls[0] || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XThvalCn27NjVEYyN5daXfRo5eWDjR.png";
            
            // Get property name
            const propertyName = isNormalized
              ? listingEntity?.name || propertyData?.name
              : propertyData?.name;
            
            // Get price value and currency for conversion
            const propertyPriceValue = isNormalized
              ? (property.price ? Number(property.price) : (propertyData?.price || propertyData?.rentalFee || propertyData?.marketValue || propertyData?.rentalPrice || 0))
              : (propertyData?.price || propertyData?.rentalFee || propertyData?.marketValue || propertyData?.rentalPrice || 0);
            
            const propertyPriceCurrency = propertyData?.currency || 'USD';
            
            // Get bedrooms/bathrooms
            const bedrooms = isNormalized
              ? (property?.specification?.residential?.bedrooms || propertyData?.bedrooms || 0)
              : getBedroomCount(propertyData);
            const bathrooms = isNormalized
              ? (property?.specification?.residential?.bathrooms || propertyData?.bathrooms || 0)
              : getBathroomCount(propertyData);
            
            // Get property ID for likes/save
            const propertyIdForSave = isNormalized
              ? propertyData?.id
              : (property as any)?.propertyId || propertyData?.id;
            
            // Get listing ID for navigation
            const listingId = isNormalized
              ? property.listingId
              : property?.id;
            
            return (
              <motion.div
                key={listingId || property?.id}
                className="flex-none w-[400px] group relative bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  href={`/property/${listingId || property?.id}`}
                  className="block h-full"
                >
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                    <img
                      src={mainImage}
                      alt={propertyName || "Property"}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-10 rounded-full shadow-md bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveProperty(e, property);
                      }}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5",
                          (() => {
                            // Convert to number for isPropertySaved
                            let idToCheck: number;
                            if (property?.listingId) {
                              idToCheck = typeof property.listingId === 'string' 
                                ? parseInt(property.listingId, 10) || 0
                                : Number(property.listingId) || 0;
                            } else if (propertyIdForSave) {
                              idToCheck = typeof propertyIdForSave === 'string' 
                                ? parseInt(propertyIdForSave, 10) || 0
                                : Number(propertyIdForSave) || 0;
                            } else {
                              idToCheck = 0;
                            }
                            return isPropertySaved(idToCheck);
                          })()
                            ? "fill-red-600 text-red-600"
                            : "text-gray-600"
                        )}
                      />
                    </Button>
                  </div>
                  <div className="p-3 mt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {propertyName || 'Property name not available'}
                        </h3>
                        {/* Show property context for rooms/units */}
                        {isNormalized && property?.hierarchy && property.hierarchy.level !== 'property' && property?.property?.name && (
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                            in {property.property.name}
                          </p>
                        )}
                      </div>
                      <FormattedPrice 
                        amount={propertyPriceValue} 
                        currency={propertyPriceCurrency}
                        className="ml-2 font-semibold whitespace-nowrap text-primary-500"
                      />
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {getPropertyLocation(propertyData) || 'Location not available'}
                    </p>
                    <div className="flex gap-4 items-center text-sm text-neutral-600">
                      <span className="flex gap-1 items-center">
                        <Bed className="w-4 h-4" />
                        {bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}
                      </span>
                      <span className="flex gap-1 items-center">
                        <Bath className="w-4 h-4" />
                        {bathrooms} bathroom{bathrooms !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
