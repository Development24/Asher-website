import { Input } from "@/components/ui/input";
import React from "react";

interface DeclerationSectionProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
}

const DeclerationSection = ({
  formData,
  handleFormChange
}: DeclerationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-gray-50 p-4 rounded-lg">
        <span className="whitespace-nowrap font-medium">I,</span>
        <Input
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          placeholder="Guarantor's name"
          value={`${formData.title} ${formData.firstName} ${formData.middleName} ${formData.lastName}`}
          onChange={(e) => handleFormChange("guarantorName", e.target.value)}
        />
        <span className="whitespace-nowrap font-medium">
          agree to act as a guarantor for
        </span>
        <Input
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          placeholder="Tenant's name"
          value={formData.tenantName}
          onChange={(e) => handleFormChange("tenantName", e.target.value)}
        />
        <span className="whitespace-nowrap font-medium">
          regarding their tenancy at [Property Address].
        </span>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="font-semibold text-gray-800 mb-4">
          I understand and agree to the following terms:
        </p>

        <ol className="list-decimal pl-6 space-y-4">
          <li className="text-gray-700">
            I will be liable for any unpaid rent, damages, or other financial
            obligations related to the tenancy.
          </li>
          <li className="text-gray-700">
            My liability remains in effect for the duration of the tenancy,
            including any renewal periods.
          </li>
          <li className="text-gray-700">
            If the tenant defaults, I will pay the owed amount upon request.
          </li>
          <li className="text-gray-700">
            My liability is joint and several, meaning the landlord can seek
            payment from me if necessary.
          </li>
          <li className="text-gray-700">
            This agreement remains binding even if circumstances change,
            including job loss or relocation.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DeclerationSection;
