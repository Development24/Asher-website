"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PropertyRentalFilter } from "@/services/property/property";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  onApplyFilters
}: FilterPanelProps) {
  const [filters, setFilters] = useState<PropertyRentalFilter>({
    type: undefined,
    minBedRoom: undefined,
    maxBedRoom: undefined,
    minBathRoom: undefined,
    maxBathRoom: undefined,
    minRentalFee: undefined,
    maxRentalFee: undefined,
    mustHaves: [],
    minGarage: undefined,
    maxGarage: undefined,
    features: [],
    // Simple Yes/No filters
    hasGarden: false,
    hasGarage: false,
    hasParking: false,
    isFurnished: false,
    isPetFriendly: false,
    // High-level amenities
    hasSwimmingPool: false,
    hasGym: false,
    hasSecurity: false,
    hasAirConditioning: false,
    hasBalcony: false,
    nearPublicTransport: false,
    nearSchools: false,
    nearShopping: false
  });

  const resetFilters = () => {
    setFilters({
      type: undefined,
      minBedRoom: undefined,
      maxBedRoom: undefined,
      minBathRoom: undefined,
      maxBathRoom: undefined,
      minRentalFee: undefined,
      maxRentalFee: undefined,
      mustHaves: [],
      minGarage: undefined,
      maxGarage: undefined,
      features: [],
      // Simple Yes/No filters
      hasGarden: false,
      hasGarage: false,
      hasParking: false,
      isFurnished: false,
      isPetFriendly: false,
      // High-level amenities
      hasSwimmingPool: false,
      hasGym: false,
      hasSecurity: false,
      hasAirConditioning: false,
      hasBalcony: false,
      nearPublicTransport: false,
      nearSchools: false,
      nearShopping: false
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-md bg-background/30 backdrop-filter backdrop-blur-lg shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-6 border-b border-foreground/10">
          <h2 className="text-2xl font-semibold text-foreground">
            Filter your results
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-foreground/10"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* Bedrooms Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Bedrooms
            </Label>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <Select
                value={filters.minBedRoom?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minBedRoom: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No min</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxBedRoom?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxBedRoom: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No max</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bathrooms Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Bathrooms
            </Label>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <Select
                value={filters.minBathRoom?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minBathRoom: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No min</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxBathRoom?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxBathRoom: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No max</SelectItem>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Price
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={filters.minRentalFee?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRentalFee: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No min</SelectItem>
                  {[100000, 200000, 300000, 400000, 500000].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      ₦{num.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxRentalFee?.toString() || "none"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxRentalFee: value === "none" ? undefined : parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No max</SelectItem>
                  {[200000, 300000, 400000, 500000, 1000000].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      ₦{num.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Property type
            </Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  type: value === "all" ? undefined : value
                }))
              }
            >
              <SelectTrigger className="w-full border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600">
                <SelectValue placeholder="Show all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show all</SelectItem>
                <SelectItem value="SINGLE_UNIT">Single Unit</SelectItem>
                <SelectItem value="MULTI_UNIT">Multi Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Features */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Property Features
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "hasGarden", label: "Has Garden" },
                { id: "hasGarage", label: "Has Garage" },
                { id: "hasParking", label: "Has Parking" },
                { id: "isFurnished", label: "Furnished" },
                { id: "isPetFriendly", label: "Pet Friendly" }
              ].map((feature) => (
                <div key={feature.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={filters[feature.id as keyof PropertyRentalFilter] as boolean}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        [feature.id]: checked
                      }));
                    }}
                    className="border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`feature-${feature.id}`}
                    className="text-sm text-foreground"
                  >
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Amenities
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "hasSwimmingPool", label: "Swimming Pool" },
                { id: "hasGym", label: "Gym/Fitness Center" },
                { id: "hasSecurity", label: "Security System" },
                { id: "hasAirConditioning", label: "Air Conditioning" },
                { id: "hasBalcony", label: "Balcony/Terrace" },
                { id: "nearPublicTransport", label: "Near Public Transport" },
                { id: "nearSchools", label: "Near Schools" },
                { id: "nearShopping", label: "Near Shopping" }
              ].map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={filters[amenity.id as keyof PropertyRentalFilter] as boolean}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        [amenity.id]: checked
                      }));
                    }}
                    className="border border-gray-200 bg-white/50 dark:bg-gray-700/50 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm text-foreground"
                  >
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="flex gap-4 p-6 border-t border-foreground/10">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            Reset filters
          </Button>
          <Button
            className="flex-1 text-white bg-primary hover:bg-primary-dark"
            onClick={handleApplyFilters}
          >
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}
