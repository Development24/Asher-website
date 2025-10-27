"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    area: "this-area",
    propertyType: [],
    minBedRoom: 0,
    maxBedRoom: 0,
    minBathRoom: 0,
    maxBathRoom: 0,
    minRentalFee: 0,
    maxRentalFee: 0,
    mustHaves: [],
    minGarage: 0,
    maxGarage: 0,
    addedToSite: "anytime",
    features: [],
    hierarchyLevel: undefined,
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
      area: "this-area",
      minBedRoom: 0,
      maxBedRoom: 0,
      minBathRoom: 0,
      maxBathRoom: 0,
      minRentalFee: 0,
      maxRentalFee: 0,
      mustHaves: [],
      minGarage: 0,
      maxGarage: 0,
      addedToSite: "anytime",
      propertyType: [],
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
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h2 className="text-2xl font-semibold text-foreground">
            Filter your results
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Location Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              This area only
            </Label>
            <Select
              value={filters.area}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, area: value }))
              }
            >
              <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-area">This area only</SelectItem>
                <SelectItem value="nearby">Include nearby areas</SelectItem>
                <SelectItem value="all">All areas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Bedrooms
            </Label>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={filters.minBedRoom?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minBedRoom: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxBedRoom?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxBedRoom: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={filters.minBathRoom?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minBathRoom: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxBathRoom?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxBathRoom: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
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
                value={filters.minRentalFee?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRentalFee: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {[100000, 200000, 300000, 400000, 500000].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      ₦{num.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.maxRentalFee?.toString() || "0"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxRentalFee: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "show-all", label: "Show all" },
                { id: "single-unit", label: "Single-unit" },
                { id: "multi-unit", label: "Multi-unit" },
                { id: "high-rise", label: "High-rise" }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={filters.propertyType.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({
                          ...prev,
                          propertyType: [...(prev.propertyType || []), type.id]
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          propertyType: prev.propertyType?.filter(
                            (t: string) => t !== type.id
                          )
                        }));
                      }
                    }}
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="text-sm text-foreground"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Hierarchy Level Filter */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Space Type
            </Label>
            <RadioGroup
              value={filters.hierarchyLevel || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  hierarchyLevel: value === "all" ? undefined : value as any
                }));
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "all", label: "All Types" },
                  { id: "property", label: "Properties" },
                  { id: "unit", label: "Units" },
                  { id: "room", label: "Rooms" }
                ].map((level) => (
                  <div key={level.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={level.id} id={`hierarchy-${level.id}`} />
                    <Label
                      htmlFor={`hierarchy-${level.id}`}
                      className="text-sm text-foreground cursor-pointer"
                    >
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
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
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
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
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
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

          {/* Added to site */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Added to site
            </Label>
            <RadioGroup
              value={filters.addedToSite}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, addedToSite: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "anytime", label: "Anytime" },
                { value: "last-24h", label: "Last 24 hours" },
                { value: "last-3d", label: "Last 3 days" },
                { value: "last-7d", label: "Last 7 days" },
                { value: "last-14d", label: "Last 14 days" },
                { value: "last-30d", label: "Last 30 days" }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`time-${option.value}`}
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`time-${option.value}`}
                    className="text-sm text-foreground"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="p-6 border-t border-foreground/10 flex gap-4">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            Reset filters
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            onClick={handleApplyFilters}
          >
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}
