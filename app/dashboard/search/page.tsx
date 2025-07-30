"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  RefreshCcw,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PropertyCard } from "../components/property-card";
import { Footer } from "@/app/components/Footer";
import FilterPanel from "@/app/components/FilterPanel";
import { useGetProperties } from "@/services/property/propertyFn";
import { Listing } from "@/services/property/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyRentalFilter } from "@/services/property/property";
export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
export default function SearchPage() {
  const [sortBy, setSortBy] = useState("popular");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  // const { data, isFetching } = useGetProperties();

  const [filters, setFilters] = useState<PropertyRentalFilter>({
    state: currentLocation || undefined
  });

  const { data, isFetching, error } = useGetProperties(filters);

  const propertiesData: Listing[] = data?.properties;
  const pagination = data?.pagination as Pagination;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const location = searchParams.get("state");
      if (location) {
        setCurrentLocation(location);
      }
    }
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      state: currentLocation
    }));
  }, [currentLocation]);

  const handleApplyFilters = (newFilters: Partial<PropertyRentalFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  };

  const handlePropertyTypeChange = (value: string) => {
    handleApplyFilters({ type: value === "all" ? undefined : value });
  };

  const handleBedroomChange = (value: string) => {
    if (value === "any") {
      handleApplyFilters({ minBedRoom: undefined, maxBedRoom: undefined });
    } else {
      const bedrooms = parseInt(value);
      handleApplyFilters({
        minBedRoom: bedrooms,
        maxBedRoom: bedrooms === 3 ? undefined : bedrooms
      });
    }
  };

  const handlePriceChange = (value: string) => {
    if (value === "any") {
      handleApplyFilters({ minRentalFee: undefined, maxRentalFee: undefined });
    } else {
      const [min, max] = value.split("-").map((v) => parseInt(v));
      handleApplyFilters({
        minRentalFee: min,
        maxRentalFee: max || undefined
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  if (!propertiesData || isFetching) {
    return (
      <div className="layout">
        {/* Search Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton className="h-4 w-24 mb-1.5" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input/Select */}
            </div>
          ))}
          <Skeleton className="h-10 w-24" /> {/* Filter button */}
        </div>

        <div className="mt-12">
          {/* Header and Sort Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-7 w-64" /> {/* Title */}
            <Skeleton className="h-10 w-[180px]" /> {/* Sort select */}
          </div>

          {/* Properties Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[400px] w-full rounded-xl" />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="w-10 h-10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="text-sm font-medium mb-1.5 block">
              Enter a location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter a location"
                defaultValue="Lagos"
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <label className="text-sm font-medium mb-1.5 block">
              Property type
            </label>
            <Select defaultValue="all" value={filters.type} onValueChange={handlePropertyTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Show all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show all</SelectItem>
                <SelectItem value="SINGLE_UNIT">Single Unit</SelectItem>
                <SelectItem value="MULTI_UNIT">Multi Unit</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="text-sm font-medium mb-1.5 block">Bedrooms</label>
            <Select defaultValue="any" value={filters.minBedRoom?.toString()} onValueChange={handleBedroomChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any beds</SelectItem>
                <SelectItem value="1">1 bedroom</SelectItem>
                <SelectItem value="2">2 bedrooms</SelectItem>
                <SelectItem value="3">3+ bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="text-sm font-medium mb-1.5 block">Price</label>
            <Select defaultValue="any" value={filters.minRentalFee?.toString()} onValueChange={handlePriceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="0-200000">₦0 - ₦200,000</SelectItem>
                <SelectItem value="200000-400000">
                  ₦200,000 - ₦400,000
                </SelectItem>
                <SelectItem value="400000+">₦400,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 px-8"
            onClick={() => setIsFilterPanelOpen(true)}
          >
            Filters
          </Button>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold capitalize">
                {currentLocation
                  ? `Properties for rent in ${currentLocation}`
                  : "All Properties"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isFetching
                  ? "Searching..."
                  : error
                  ? "Error loading properties"
                  : `${propertiesData?.length || 0} properties found`}
              </p>
            </div>
            {propertiesData?.length > 0 && (
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Most popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Loading State */}
          {isFetching && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={`skeleton-${index}`}
                  className="h-[400px] w-full rounded-xl"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Failed to load properties
              </h3>
              <p className="text-gray-500 mb-4">
                There was an error loading the properties. Please try again.
              </p>
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                variant="outline"
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isFetching &&
            !error &&
            (!propertiesData || propertiesData.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-4">
                  {currentLocation
                    ? `We couldn't find any properties in ${currentLocation} matching your criteria.`
                    : "We couldn't find any properties matching your criteria."}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentLocation("");
                      setFilters({});
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </Button>
                  <Button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}
                    variant="default"
                    className="gap-2"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            )}

          {/* Properties Grid */}
          {!isFetching &&
            !error &&
            propertiesData &&
            propertiesData.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {propertiesData?.map((property, index) => (
                  <motion.div
                    key={Number(property.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PropertyCard
                      {...property}
                      showViewProperty
                      property={property}
                    />
                  </motion.div>
                ))}
              </div>
            )}

          {!isFetching &&
            !error &&
            propertiesData &&
            propertiesData.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0"
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                {getPaginationRange(
                  filters.page || 1,
                  pagination?.totalPages || 1
                ).map((page, index) => (
                  <Button
                    key={index}
                    variant={page === filters.page ? "default" : "outline"}
                    className={`w-10 h-10 p-0 ${
                      page === pagination?.page
                        ? "bg-red-600 text-white  hover:bg-red-700"
                        : ""
                    }`}
                    onClick={() =>
                      typeof page === "number" ? handlePageChange(page) : null
                    }
                    disabled={typeof page === "string"}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="w-10 h-10 p-0"
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={filters.page === pagination?.totalPages}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
        </div>
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </div>
  );
}
