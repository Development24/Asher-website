"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  Home,
  AlertCircle,
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
import { SearchHeader } from "@/app/components/SearchHeader";
import { Footer } from "@/app/components/Footer";
import FilterPanel from "@/app/components/FilterPanel";
import { useSavedProperties } from "@/app/contexts/saved-properties-context";
import PropertyCard from "@/app/components/PropertyCard";
import { useGetProperties } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing } from "@/services/property/types";
import { PropertyRentalFilter } from "@/services/property/property";

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("popular");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [filters, setFilters] = useState<PropertyRentalFilter>({
    state: currentLocation || undefined,
    page: 1,
    limit: 10
  });
  const { data: properties, isLoading, error } = useGetProperties(filters);
  const propertyResults = properties?.properties as Listing[];
  const pagination = properties?.pagination as Pagination;

  const { isPropertySaved } = useSavedProperties();

  // Client-side only check
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const location = searchParams.get("state");
      if (location) {
        setCurrentLocation(location);
      }
    }
  }, [searchParams, isClient]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      state: currentLocation
    }));
  }, [currentLocation]);

  const handleApplyFilters = useCallback((newFilters: Partial<PropertyRentalFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const handlePropertyTypeChange = useCallback((value: string) => {
    handleApplyFilters({ type: value === "all" ? undefined : value });
  }, [handleApplyFilters]);

  const handleBedroomChange = useCallback((value: string) => {
    if (value === "any") {
      handleApplyFilters({ minBedRoom: undefined, maxBedRoom: undefined });
    } else {
      const bedrooms = parseInt(value);
      handleApplyFilters({
        minBedRoom: bedrooms,
        maxBedRoom: bedrooms === 3 ? undefined : bedrooms
      });
    }
  }, [handleApplyFilters]);

  const handlePriceChange = useCallback((value: string) => {
    if (value === "any") {
      handleApplyFilters({ minRentalFee: undefined, maxRentalFee: undefined });
    } else {
      const [min, max] = value.split("-").map((v) => parseInt(v));
      handleApplyFilters({
        minRentalFee: min,
        maxRentalFee: max || undefined
      });
    }
  }, [handleApplyFilters]);

  const handleHierarchyLevelChange = useCallback((value: string) => {
    handleApplyFilters({ hierarchyLevel: value === "all" ? undefined : value as any });
  }, [handleApplyFilters]);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const getPaginationRange = useMemo(() => {
    return (currentPage: number, totalPages: number) => {
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
  }, []);

  // Memoize computed values
  const memoizedValues = useMemo(() => {
    const resultCount = propertyResults?.length || 0;
    const currentPage = filters.page || 1;
    const totalPages = pagination?.totalPages || 1;
    const paginationRange = getPaginationRange(currentPage, totalPages);
    
    return {
      resultCount,
      currentPage,
      totalPages,
      paginationRange,
      showResults: !isLoading && !error && propertyResults && propertyResults.length > 0,
      showEmptyState: !isLoading && !error && (!propertyResults || propertyResults.length === 0)
    };
  }, [propertyResults, filters.page, pagination?.totalPages, getPaginationRange, isLoading, error]);

  return (
    <div className="flex flex-col min-h-screen">
      <SearchHeader />

      <div className="layout">
        {/* Search Filters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
              Enter a location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter a location"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
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
                <SelectItem value="HOUSE">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
              Bedrooms
            </label>
            <Select defaultValue="any" value={filters?.minBedRoom?.toString()} onValueChange={handleBedroomChange}>
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
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
              Price
            </label>
            <Select defaultValue="any" value={filters?.minRentalFee?.toString()} onValueChange={handlePriceChange}>
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
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
              Space Type
            </label>
            <Select defaultValue="all" value={filters.hierarchyLevel || "all"} onValueChange={handleHierarchyLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="property">Properties</SelectItem>
                <SelectItem value="unit">Units</SelectItem>
                <SelectItem value="room">Rooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="gap-2 h-10"
              onClick={() => setIsFilterPanelOpen(true)}
            >
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Map View */}
        <div className="h-[300px] rounded-lg mb-4 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <div className="flex absolute inset-0 flex-col gap-4 justify-center items-center">
            <MapPin className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentLocation || "Property location"}
            </div>
            <button
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() =>
                window.open(
                  `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                    currentLocation || "United Kingdom"
                  )}`,
                  "_blank"
                )
              }
            >
              View on OpenStreetMap
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold capitalize">
                {currentLocation ? 
                  `Properties for rent in ${currentLocation}` : 
                  'All Properties'
                }
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isLoading ? 'Searching...' : 
                 error ? 'Error loading properties' :
                 `${propertyResults?.length || 0} properties found`}
              </p>
            </div>
            {propertyResults?.length > 0 && (
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
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <div className="p-3 mb-4 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Failed to load properties</h3>
              <p className="mb-4 text-gray-500">
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
          {!isLoading && !error && (!propertyResults || propertyResults.length === 0) && (
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <div className="p-3 mb-4 bg-gray-100 rounded-full">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No properties found</h3>
              <p className="mb-4 text-gray-500">
                {currentLocation
                  ? `We couldn't find any properties in ${currentLocation} matching your criteria.`
                  : "We couldn't find any properties matching your criteria."}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    setCurrentLocation('');
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

          {/* Results Grid */}
          {!isLoading && !error && propertyResults && propertyResults.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {propertyResults?.map((property: any, index: number) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PropertyCard
                    {...property}
                    showViewProperty
                    isSaved={
                      property?.listingId 
                        ? isPropertySaved(property.listingId) 
                        : property?.propertyId 
                        ? isPropertySaved(Number(property.propertyId)) 
                        : false
                    }
                    property={property}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination - Only show if we have results */}
          {!isLoading && !error && propertyResults && propertyResults.length > 0 && (
            <div className="flex gap-2 justify-center mt-8">
              <Button
                variant="outline"
                className="p-0 w-8 h-8"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {getPaginationRange(
                filters.page || 1,
                pagination?.totalPages || 1
              ).map((page, index) => (
                <Button
                  key={index}
                  variant={page === filters.page ? "default" : "outline"}
                  className={`w-8 h-8 p-0 ${
                    page === filters.page ? "bg-red-600 hover:bg-red-700" : ""
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
                className="p-0 w-8 h-8"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === pagination?.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
