"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import { cn, formatPrice, getPropertyPrice } from "@/lib/utils";
import Link from "next/link";
import type React from "react";
import { useGetProperties } from "@/services/property/propertyFn";
import { Property } from "@/services/property/types";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="flex overflow-x-scroll scrollbar-hide gap-6 pb-4">
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
              <Skeleton className="h-6 w-48" /> {/* Property name */}
              <Skeleton className="h-6 w-24" /> {/* Price */}
            </div>
            <Skeleton className="h-4 w-3/4" /> {/* Location */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" /> {/* Bedrooms */}
              <Skeleton className="h-4 w-24" /> {/* Bathrooms */}
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

  const properties = propertiesData?.properties || [];

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
    property: (typeof properties)
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
      <div className="layout py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-96" /> {/* Subtitle */}
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
    <section className="layout py-20 overflow-hidden">
      <div className=" px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <span className="text-primary-500 font-semibold mb-2 block uppercase tracking-wider text-sm">
              FEATURED PROPERTIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Explore handpicked homes tailored for you.
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full w-12 h-12 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full w-12 h-12 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <motion.div
          ref={scrollRef}
          className="flex overflow-x-scroll scrollbar-hide gap-6 pb-4 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {properties?.map((property: any) => (
            <motion.div
              key={property?.property?.id}
              className="flex-none w-[400px] group relative bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href={`/property/${property?.id}`}
                className="block h-full"
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                  <img
                    src={
                      property?.property?.images?.[0]?.url ||
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XThvalCn27NjVEYyN5daXfRo5eWDjR.png"
                    }
                    alt={property?.property?.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10 rounded-full shadow-md"
                    onClick={(e) => handleSaveProperty(e, property)}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        isPropertySaved(Number(property?.property?.id))
                          ? "fill-red-600 text-red-600"
                          : "text-gray-600"
                      )}
                    />
                  </Button>
                </div>
                <div className="mt-4 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {property?.property?.name}
                    </h3>
                    <span className="text-primary-500 font-semibold">
                      {getPropertyPrice(property?.property)}
                    </span>
                  </div>
                  <p className="text-neutral-600 text-sm mb-2">{`${
                    property?.property?.address
                  }, ${
                    property?.property?.address2 !== ""
                      ? property?.property?.address2
                      : ""
                  } ${property?.property?.city}, ${
                    property?.property?.state?.name
                  } ${property?.property?.country}`}</p>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property?.property?.bedrooms} bedrooms
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property?.property?.bathrooms} bathrooms
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
