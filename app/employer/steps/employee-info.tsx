import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface EmployeeInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const EmployeeInfo = ({ formData, handleChange }: EmployeeInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="employee-name" className="text-gray-700 font-medium">
          Employee's full name
        </Label>
        <Input
          id="employee-name"
          placeholder="Enter full name"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.employeeName}
          onChange={(e) => handleChange("employeeName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="job-title" className="text-gray-700 font-medium">
            Job title
          </Label>
          <Input
            id="job-title"
            placeholder="Enter job title"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-gray-700 font-medium">
            Department
          </Label>
          <Input
            id="department"
            placeholder="Enter department"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Employment period</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="employment-start-date"
              className="text-xs text-gray-500 mb-1 block"
            >
              Start date
            </Label>
            <Input
              id="employment-start-date"
              type="date"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.employmentStartDate}
              onChange={(e) =>
                handleChange("employmentStartDate", e.target.value)
              }
            />
          </div>
          <div>
            <Label
              htmlFor="employment-end-date"
              className="text-xs text-gray-500 mb-1 block"
            >
              End date
            </Label>
            <Input
              id="employment-end-date"
              type="date"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.employmentEndDate}
              onChange={(e) =>
                handleChange("employmentEndDate", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="reason-for-leaving"
          className="text-gray-700 font-medium"
        >
          Reason for leaving (if applicable)
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

export default EmployeeInfo;
