import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EmploymentStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function EmploymentStep({ formData, onChange }: EmploymentStepProps) {
  const [employmentType, setEmploymentType] = useState("");
  // Get income proof label based on employment type
  const getIncomeProofLabel = () => {
    switch (employmentType) {
      case "employed":
        return "Payslips (last 3 months)";
      case "self-employed":
        return "Tax Return or Accounts";
      case "freelance":
        return "Bank Statements (last 3 months)";
      case "director":
        return "Company Accounts or Director's Salary";
      case "sole-proprietor":
        return "Business Accounts or Tax Return";
      default:
        return "Proof of Income";
    }
  };

  // Get additional document requirements based on employment type
  const getAdditionalDocRequirements = () => {
    switch (employmentType) {
      case "self-employed":
        return "Business Registration or Tax Certificate";
      case "freelance":
        return "Client Contracts (optional)";
      case "director":
        return "Certificate of Incorporation";
      case "sole-proprietor":
        return "Business License or Registration";
      default:
        return "Any Additional Supporting Documents";
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <Label className="text-gray-800 font-semibold mb-4 block">
          Employment Status
        </Label>
        <RadioGroup
          value={employmentType}
          onValueChange={setEmploymentType}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { value: "employed", label: "Employed" },
            { value: "self-employed", label: "Self-employed" },
            { value: "freelance", label: "Freelance" },
            { value: "director", label: "Director" },
            { value: "sole-proprietor", label: "Sole Proprietor" }
          ].map((option) => (
            <div
              key={option.value}
              className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all ${
                employmentType === option.value
                  ? "border-[#dc0a3c] bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setEmploymentType(option.value)}
            >
              <RadioGroupItem
                value={option.value}
                id={`employment-${option.value}`}
                className="text-[#dc0a3c]"
              />
              <Label
                htmlFor={`employment-${option.value}`}
                className="cursor-pointer font-medium"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <AnimatePresence mode="wait">
        {employmentType === "employed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="employer-name"
                  className="text-gray-700 font-medium"
                >
                  Employer name
                </Label>
                <Input
                  id="employer-name"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="job-title"
                  className="text-gray-700 font-medium"
                >
                  Job title
                </Label>
                <Input
                  id="job-title"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="employment-start-date"
                  className="text-gray-700 font-medium"
                >
                  Employment start date
                </Label>
                <Input
                  id="employment-start-date"
                  type="date"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="annual-income"
                  className="text-gray-700 font-medium"
                >
                  Annual income
                </Label>
                <Input
                  id="annual-income"
                  placeholder="£"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="employer-address"
                className="text-gray-700 font-medium"
              >
                Employer address
              </Label>
              <Input
                id="employer-address"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="employer-phone"
                  className="text-gray-700 font-medium"
                >
                  Employer phone
                </Label>
                <Input
                  id="employer-phone"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="employer-email"
                  className="text-gray-700 font-medium"
                >
                  Employer email
                </Label>
                <Input
                  id="employer-email"
                  type="email"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {employmentType === "self-employed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Self-Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="business-name"
                  className="text-gray-700 font-medium"
                >
                  Business name
                </Label>
                <Input
                  id="business-name"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="business-nature"
                  className="text-gray-700 font-medium"
                >
                  Nature of business
                </Label>
                <Input
                  id="business-nature"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="business-years"
                  className="text-gray-700 font-medium"
                >
                  Years in business
                </Label>
                <Input
                  id="business-years"
                  type="number"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="annual-income-self"
                  className="text-gray-700 font-medium"
                >
                  Annual income
                </Label>
                <Input
                  id="annual-income-self"
                  placeholder="£"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="business-address"
                className="text-gray-700 font-medium"
              >
                Business address
              </Label>
              <Input
                id="business-address"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="accountant-name"
                  className="text-gray-700 font-medium"
                >
                  Accountant name
                </Label>
                <Input
                  id="accountant-name"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="accountant-contact"
                  className="text-gray-700 font-medium"
                >
                  Accountant contact
                </Label>
                <Input
                  id="accountant-contact"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utr-number" className="text-gray-700 font-medium">
                UTR Number
              </Label>
              <Input
                id="utr-number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>
          </motion.div>
        )}

        {employmentType === "freelance" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Freelance Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="freelance-type"
                  className="text-gray-700 font-medium"
                >
                  Type of work
                </Label>
                <Input
                  id="freelance-type"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="freelance-years"
                  className="text-gray-700 font-medium"
                >
                  Years freelancing
                </Label>
                <Input
                  id="freelance-years"
                  type="number"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="monthly-income"
                  className="text-gray-700 font-medium"
                >
                  Average monthly income
                </Label>
                <Input
                  id="monthly-income"
                  placeholder="£"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="portfolio-website"
                  className="text-gray-700 font-medium"
                >
                  Portfolio/Website
                </Label>
                <Input
                  id="portfolio-website"
                  placeholder="https://"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="major-clients"
                className="text-gray-700 font-medium"
              >
                Major clients (comma separated)
              </Label>
              <Input
                id="major-clients"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="utr-number-freelance"
                className="text-gray-700 font-medium"
              >
                UTR Number
              </Label>
              <Input
                id="utr-number-freelance"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>
          </motion.div>
        )}

        {employmentType === "director" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Director Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="company-name"
                  className="text-gray-700 font-medium"
                >
                  Company name
                </Label>
                <Input
                  id="company-name"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="company-number"
                  className="text-gray-700 font-medium"
                >
                  Company registration number
                </Label>
                <Input
                  id="company-number"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-700 font-medium">
                  Position in company
                </Label>
                <Input
                  id="position"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="ownership-percentage"
                  className="text-gray-700 font-medium"
                >
                  Ownership percentage
                </Label>
                <Input
                  id="ownership-percentage"
                  type="number"
                  placeholder="%"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="director-income"
                  className="text-gray-700 font-medium"
                >
                  Annual income
                </Label>
                <Input
                  id="director-income"
                  placeholder="£"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="company-founded"
                  className="text-gray-700 font-medium"
                >
                  Year company founded
                </Label>
                <Input
                  id="company-founded"
                  type="number"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="company-address"
                className="text-gray-700 font-medium"
              >
                Company address
              </Label>
              <Input
                id="company-address"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>
          </motion.div>
        )}

        {employmentType === "sole-proprietor" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 bg-white p-6 rounded-lg border"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Sole Proprietor Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="business-name-sole"
                  className="text-gray-700 font-medium"
                >
                  Business name
                </Label>
                <Input
                  id="business-name-sole"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="business-nature-sole"
                  className="text-gray-700 font-medium"
                >
                  Nature of business
                </Label>
                <Input
                  id="business-nature-sole"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="business-years-sole"
                  className="text-gray-700 font-medium"
                >
                  Years in business
                </Label>
                <Input
                  id="business-years-sole"
                  type="number"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="annual-income-sole"
                  className="text-gray-700 font-medium"
                >
                  Annual income
                </Label>
                <Input
                  id="annual-income-sole"
                  placeholder="£"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="business-address-sole"
                className="text-gray-700 font-medium"
              >
                Business address
              </Label>
              <Input
                id="business-address-sole"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="business-registration"
                  className="text-gray-700 font-medium"
                >
                  Business registration number
                </Label>
                <Input
                  id="business-registration"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="utr-number-sole"
                  className="text-gray-700 font-medium"
                >
                  UTR Number
                </Label>
                <Input
                  id="utr-number-sole"
                  className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
