import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface EmployeeInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  applicationInfo: any;
}

// Helper function to format date to YYYY-MM-DD
const formatDateForInput = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch {
    return '';
  }
};

const EmployeeInfo = ({ formData, handleChange, applicationInfo }: EmployeeInfoProps) => {
  const employeeName = `${applicationInfo?.personalDetails?.firstName} ${applicationInfo?.personalDetails?.lastName}`;
  const jobTitle = applicationInfo?.employmentInfo?.positionTitle;
  const department = applicationInfo?.employmentInfo?.employerCompany;
  const employmentStartDate = formatDateForInput(applicationInfo?.employmentInfo?.startDate);
  const employmentEndDate = formatDateForInput(applicationInfo?.employmentInfo?.endDate) || 
                           formatDateForInput(formData?.employmentEndDate);
  const reasonForLeaving = applicationInfo?.employmentInfo?.reasonForLeaving || formData?.reasonForLeaving;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="employee-name" className="text-gray-700 font-medium">
          Employee's full name
        </Label>
        <Input
          id="employee-name"
          placeholder="Enter full name"
          disabled
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={employeeName}
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
            disabled
            placeholder="Enter job title"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-gray-700 font-medium">
            Department
          </Label>
          <Input
            id="department"
            disabled
            placeholder="Enter department"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={department}
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
              disabled
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={employmentStartDate}
              onChange={(e) => handleChange("employmentStartDate", e.target.value)}
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
              value={employmentEndDate}
              onChange={(e) => handleChange("employmentEndDate", e.target.value)}
              min={employmentStartDate}
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
          value={reasonForLeaving}
          onChange={(e) => handleChange("reasonForLeaving", e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeeInfo;
