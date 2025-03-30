"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
export default function SearchPage() {
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const location = searchParams.get("state");
    if (location) {
      setCurrentLocation(location);
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

  return (
    <div className="min-h-screen flex flex-col">
      <SearchHeader />

      <div className="layout">
        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,1fr,auto] gap-4">
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
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
          <div>
            <label className="text-sm font-medium mb-1.5 block text-gray-500">
              Price
            </label>
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
          <div className="flex items-end">
            <Button
              variant="outline"
              className="gap-2 h-10"
              onClick={() => setIsFilterPanelOpen(true)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Map View */}
        <div className="h-[300px] rounded-lg mb-4 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
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
              <p className="text-sm text-gray-500 mt-1">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h3 className="text-lg font-semibold mb-2">Failed to load properties</h3>
              <p className="text-gray-500 mb-4">
                There was an error loading the properties. Please try again.
              </p>
              <Button 
                onClick={() => window.location.reload()}
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-gray-500 mb-4">
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
                  onClick={() => window.location.reload()}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyResults.map((property: any, index: number) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PropertyCard
                    {...property}
                    showViewProperty
                    isSaved={isPropertySaved(Number(property.property.id))}
                    property={property}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination - Only show if we have results */}
          {!isLoading && !error && propertyResults && propertyResults.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
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
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === pagination?.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
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
