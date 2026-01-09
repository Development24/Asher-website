import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TenantInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  applicationInfo: any;
}

const TenantInfo = ({
  formData,
  handleChange,
  applicationInfo
}: TenantInfoProps) => {
  // Extract tenant name safely, handling missing parts
  const firstName = applicationInfo?.personalDetails?.firstName || "";
  const lastName = applicationInfo?.personalDetails?.lastName || "";
  const tenantName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown Tenant";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tenant-name" className="font-medium text-gray-700">
          Full name
        </Label>
        <Input
          id="tenant-name"
          placeholder="Enter full name"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={tenantName}
          disabled
          onChange={(e) => handleChange("tenantName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="current-address"
            className="font-medium text-gray-700"
          >
            Current address
          </Label>
          <Input
            id="current-address"
            placeholder="Address"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.currentAddress}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly-rent" className="font-medium text-gray-700">
            Monthly Rent Paid (£)
          </Label>
          <Input
            id="monthly-rent"
            placeholder="Enter amount"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.monthlyRent}
            onChange={(e) => handleChange("monthlyRent", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-gray-700">Rental period</Label>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="rental-start-date"
              className="block mb-1 text-xs text-gray-500"
            >
              Start date
            </Label>
            <Input
              id="rental-start-date"
              type="date"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.rentalStartDate}
              onChange={(e) => handleChange("rentalStartDate", e.target.value)}
            />
          </div>
          <div>
            <Label
              htmlFor="rental-end-date"
              className="block mb-1 text-xs text-gray-500"
            >
              End date
            </Label>
            <Input
              id="rental-end-date"
              type="date"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.rentalEndDate}
              onChange={(e) => handleChange("rentalEndDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="reason-for-leaving"
          className="font-medium text-gray-700"
        >
          Reason for leaving
        </Label>
        <Input
          id="reason-for-leaving"
          placeholder="Please specify"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.reasonForLeaving}
          onChange={(e) => handleChange("reasonForLeaving", e.target.value)}
        />
      </div>
    </div>
  );
};

export default TenantInfo;
