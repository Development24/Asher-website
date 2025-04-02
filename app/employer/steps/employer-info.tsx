import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface EmployerInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const EmployerInfo = ({ formData, handleChange }: EmployerInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company-name" className="text-gray-700 font-medium">
          Company name
        </Label>
        <Input
          id="company-name"
          placeholder="Enter company name"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="referee-name" className="text-gray-700 font-medium">
            Referee's name
          </Label>
          <Input
            id="referee-name"
            placeholder="Enter name"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.refereeName}
            onChange={(e) => handleChange("refereeName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="referee-position"
            className="text-gray-700 font-medium"
          >
            Position
          </Label>
          <Input
            id="referee-position"
            placeholder="Enter position"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.refereePosition}
            onChange={(e) => handleChange("refereePosition", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-number" className="text-gray-700 font-medium">
            Contact number
          </Label>
          <Input
            id="contact-number"
            placeholder="Enter phone number"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-address" className="text-gray-700 font-medium">
            Email address
          </Label>
          <Input
            id="email-address"
            type="email"
            placeholder="Enter email"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.emailAddress}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployerInfo;
