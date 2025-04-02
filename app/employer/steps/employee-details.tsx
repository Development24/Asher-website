import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface EmployeeDetailsProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const EmployeeDetails = ({ formData, handleChange }: EmployeeDetailsProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-gray-700 font-medium">
          1. Nature of Employment
        </Label>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="full-time"
              checked={formData.employmentType === "full-time"}
              onCheckedChange={(checked) => {
                if (checked) handleChange("employmentType", "full-time");
              }}
            />
            <Label htmlFor="full-time" className="text-gray-700">
              Full-Time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="part-time"
              checked={formData.employmentType === "part-time"}
              onCheckedChange={(checked) => {
                if (checked) handleChange("employmentType", "part-time");
              }}
            />
            <Label htmlFor="part-time" className="text-gray-700">
              Part-Time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="temporary-contract"
              checked={formData.employmentType === "temporary-contract"}
              onCheckedChange={(checked) => {
                if (checked)
                  handleChange("employmentType", "temporary-contract");
              }}
            />
            <Label htmlFor="temporary-contract" className="text-gray-700">
              Temporary/Contract
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="main-responsibilities"
          className="text-gray-700 font-medium"
        >
          2. Main Responsibilities
        </Label>
        <Textarea
          id="main-responsibilities"
          placeholder="Please describe the employee's main duties and responsibilities"
          className="min-h-[120px] rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.mainResponsibilities}
          onChange={(e) => handleChange("mainResponsibilities", e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeeDetails;
