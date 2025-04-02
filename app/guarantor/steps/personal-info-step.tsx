import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from "@/components/ui/select";
import { days, months, years } from "@/lib/utils";
interface PersonalInfoStepProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
}

export function PersonalInfoStep({
  formData,
  handleFormChange
}: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Full name</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            placeholder="Title"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.title}
            onChange={(e) => handleFormChange("title", e.target.value)}
          />
          <Input
            placeholder="First name"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.firstName}
            onChange={(e) => handleFormChange("firstName", e.target.value)}
          />
          <Input
            placeholder="Middle name"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.middleName}
            onChange={(e) => handleFormChange("middleName", e.target.value)}
          />
          <Input
            placeholder="Last name"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.lastName}
            onChange={(e) => handleFormChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Date of birth</Label>
        <div className="grid grid-cols-3 gap-4">
          <Select
            value={formData.dateOfBirthDay}
            onValueChange={(value) => handleFormChange("dateOfBirthDay", value)}
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.dateOfBirthMonth}
            onValueChange={(value) =>
              handleFormChange("dateOfBirthMonth", value)
            }
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.dateOfBirthYear}
            onValueChange={(value) =>
              handleFormChange("dateOfBirthYear", value)
            }
          >
            <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="national-insurance"
          className="text-gray-700 font-medium"
        >
          National Insurance Number
        </Label>
        <Input
          id="national-insurance"
          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.nationalInsuranceNumber}
          onChange={(e) =>
            handleFormChange("nationalInsuranceNumber", e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-number" className="text-gray-700 font-medium">
            Contact number
          </Label>
          <Input
            id="contact-number"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.contactNumber}
            onChange={(e) => handleFormChange("contactNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-address" className="text-gray-700 font-medium">
            Email address
          </Label>
          <Input
            id="email-address"
            type="email"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
            value={formData.emailAddress}
            onChange={(e) => handleFormChange("emailAddress", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
