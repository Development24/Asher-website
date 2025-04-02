import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const AdditionalInfo = ({ formData, handleChange }: AdditionalInfoProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Additional Comments
        </h3>
        <Textarea
          placeholder="Please provide any additional information that may be helpful"
          className="min-h-[150px] rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.additionalComments}
          onChange={(e) => handleChange("additionalComments", e.target.value)}
        />
      </div>

      <div className="space-y-6 pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Signature</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="signer-name" className="text-gray-700 font-medium">
              Name
            </Label>
            <Input
              id="signer-name"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.signerName}
              onChange={(e) => handleChange("signerName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signature" className="text-gray-700 font-medium">
              Signature
            </Label>
            <Input
              id="signature"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.signature}
              onChange={(e) => handleChange("signature", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="signature-date" className="text-gray-700 font-medium">
            Date
          </Label>
          <Input
            id="signature-date"
            type="date"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
