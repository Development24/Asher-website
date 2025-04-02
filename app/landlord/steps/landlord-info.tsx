import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LandlordInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}
const LandlordInfo = ({ formData, handleChange }: LandlordInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="landlord-name" className="text-gray-700 font-medium">
          Landlord/Agent Name
        </Label>
        <Input
          id="landlord-name"
          placeholder="Enter name"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.landlordName}
          onChange={(e) => handleChange("landlordName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-number" className="text-gray-700 font-medium">
            Contact number
          </Label>
          <Input
            id="contact-number"
            placeholder="Phone number"
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
            placeholder="Email"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.emailAddress}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LandlordInfo;
