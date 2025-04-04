import { Input } from "@/components/ui/input";
import React from "react";

interface DeclerationSectionProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
  applicationInfo: any;
}

const DeclerationSection = ({
  formData,
  handleFormChange,
  applicationInfo
}: DeclerationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap bg-gray-50 p-4 rounded-lg gap-2 items-center">
        <span className="whitespace-nowrap font-medium">I,</span>
        <div className="inline-block px-4 py-2 bg-white rounded-lg border border-gray-300 shadow-sm min-w-[200px]">
          <span className="text-gray-900">
            {`${formData.title} ${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim()}
          </span>
        </div>
        <span className="whitespace-nowrap font-medium">
          agree to act as a guarantor for
        </span>
        <div className="inline-block px-4 py-2 bg-white rounded-lg border border-gray-300 shadow-sm min-w-[200px]">
          <span className="text-gray-900">
            {`${applicationInfo?.personalDetails?.title} ${applicationInfo?.personalDetails?.firstName} ${applicationInfo?.personalDetails?.middleName} ${applicationInfo?.personalDetails?.lastName}`.trim()}
          </span>
        </div>
        <span className="text-balance text-gray-900">
          regarding their tenancy at{" "}
          {`${applicationInfo?.properties?.location} ${applicationInfo?.properties?.city} ${applicationInfo?.properties?.country}`.trim()}
          .
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
