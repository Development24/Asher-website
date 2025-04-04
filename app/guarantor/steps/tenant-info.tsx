import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { days, months, years } from "@/lib/utils";
import { useState } from "react";

interface TenantInfoProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
  applicationInfo: any;
}

const TenantInfo = ({ formData, handleFormChange, applicationInfo }: TenantInfoProps) => {

  const tenancyStartDate = new Date(applicationInfo?.createdAt);
  const day = tenancyStartDate.getDate();
  const month = tenancyStartDate.getMonth() + 1;
  const year = tenancyStartDate.getFullYear();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="tenant-fullname" className="text-gray-700 font-medium">
          Full name
        </Label>
        <Input
          id="tenant-fullname"
          placeholder="Enter full name"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={`${applicationInfo?.personalDetails?.title} ${applicationInfo?.personalDetails?.firstName} ${applicationInfo?.personalDetails?.middleName} ${applicationInfo?.personalDetails?.lastName}`}
          disabled
          onChange={(e) => handleFormChange("fullName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="property-address"
            className="text-gray-700 font-medium"
          >
            Property address
          </Label>
          <Input
            id="property-address"
            placeholder="Address"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={`${applicationInfo?.properties?.location} ${applicationInfo?.properties?.city} ${applicationInfo?.properties?.country}`}
            disabled
            onChange={(e) =>
              handleFormChange("propertyAddress", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rent-amount" className="text-gray-700 font-medium">
            Rent amount
          </Label>
          <Input
            id="rent-amount"
            placeholder="Enter amount"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={applicationInfo?.properties?.rentalFee}
            disabled
            onChange={(e) => handleFormChange("rentAmount", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Application start date</Label>
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={day.toString()}
            disabled
            onValueChange={(value) =>
              handleFormChange("tenancyStartDay", value)
            }
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={month.toString()}
            disabled
            onValueChange={(value) =>
              handleFormChange("tenancyStartMonth", value)
            }
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year.toString()}
            disabled
            onValueChange={(value) =>
              handleFormChange("tenancyStartYear", value)
            }
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TenantInfo;
