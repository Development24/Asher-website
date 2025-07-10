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
    features: []
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
      features: []
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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

          {/* Must-haves */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Must-haves
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "garden", label: "Garden" },
                { id: "parking", label: "Parking/garage" },
                { id: "balcony", label: "Balcony/terrace" },
                { id: "high-rise", label: "High-rise" }
              ].map((feature) => (
                <div key={feature.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`must-${feature.id}`}
                    checked={filters.mustHaves?.includes(feature.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({
                          ...prev,
                          mustHaves: [...(prev.mustHaves || []), feature.id]
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          mustHaves: prev.mustHaves?.filter(
                            (f) => f !== feature.id
                          )
                        }));
                      }
                    }}
                    className="bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`must-${feature.id}`}
                    className="text-sm text-foreground"
                  >
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Property Features */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">
              Property Features
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "show-all", label: "Show all" },
                { id: "patio", label: "Patio" },
                { id: "kitchen-island", label: "Kitchen island" },
                { id: "smart-home", label: "Smart home integration" }
              ].map((feature) => (
                <div key={feature.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={filters.features.includes(feature.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters((prev) => ({
                          ...prev,
                          features: [...prev.features, feature.id]
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          features: prev.features.filter(
                            (f: string) => f !== feature.id
                          )
                        }));
                      }
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
