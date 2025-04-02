import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface DeclerationProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const Decleration = ({ formData, handleChange }: DeclerationProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 bg-gray-50 p-6 rounded-lg">
        <Checkbox
          id="declaration"
          className="h-5 w-5 border-gray-300 text-[#dc0a3c] rounded focus:ring-[#dc0a3c]"
          checked={formData.declarationConfirmed}
          onCheckedChange={(checked) =>
            handleChange("declarationConfirmed", checked)
          }
        />
        <Label htmlFor="declaration" className="font-medium text-gray-700">
          I confirm that the information provided in this reference is accurate
          and based on my knowledge of the employee's performance.
        </Label>
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

export default Decleration;
