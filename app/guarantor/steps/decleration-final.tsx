import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeclerationFinalProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
  handleCheckboxChange: (field: string, value: any) => void;
}
const DeclerationFinal = ({
  formData,
  handleFormChange,
  handleCheckboxChange
}: DeclerationFinalProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 bg-gray-50 p-6 rounded-lg">
        <Checkbox
          id="declaration"
          className="h-5 w-5 border-gray-300 text-[#dc0a3c] rounded focus:ring-[#dc0a3c]"
          checked={formData.signedByGuarantor}
          onCheckedChange={(value) =>
            handleCheckboxChange("signedByGuarantor", value)
          }
        />
        <Label htmlFor="signedByGuarantor" className="font-medium text-gray-700">
          I confirm that I have read and understood this agreement. I
          acknowledge my legal responsibility as a guarantor.
        </Label>
      </div>

      <div className="space-y-6 p-6 bg-gray-50 rounded-lg max-w-xl mx-auto">
        <h3 className="font-semibold text-gray-800">Guarantor</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="guarantor-name"
              className="text-gray-700 font-medium"
            >
              Guarantor's Name
            </Label>
            <Input
              id="guarantor-name"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={`${formData.title} ${formData.firstName} ${formData.middleName} ${formData.lastName}`}
              onChange={(e) =>
                handleFormChange("guarantorName", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="guarantor-signature"
              className="text-gray-700 font-medium"
            >
              Guarantor's Signature
            </Label>
            <Input
              id="guarantor-signature"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.guarantorSignature}
              onChange={(e) =>
                handleFormChange("guarantorSignature", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="guarantor-date"
              className="text-gray-700 font-medium"
            >
              Date
            </Label>
            <Input
              id="guarantor-date"
              type="date"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.guarantorSignedAt}
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                handleFormChange("guarantorSignedAt", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclerationFinal;
