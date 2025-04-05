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
  const tenantName = `${applicationInfo?.personalDetails?.firstName} ${applicationInfo?.personalDetails?.lastName}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tenant-name" className="text-gray-700 font-medium">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="current-address"
            className="text-gray-700 font-medium"
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
          <Label htmlFor="monthly-rent" className="text-gray-700 font-medium">
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
        <Label className="text-gray-700 font-medium">Rental period</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="rental-start-date"
              className="text-xs text-gray-500 mb-1 block"
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
              className="text-xs text-gray-500 mb-1 block"
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
          className="text-gray-700 font-medium"
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
