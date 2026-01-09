import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EmploymentStepProps {
  formData: any;
  handleFormChange: (field: string, value: any) => void;
  employmentType: string;
  setEmploymentType: (type: string) => void;
  error?: string;
  setError?: (error: string) => void;
}

export function EmploymentStep({ formData, handleFormChange, employmentType, setEmploymentType, error, setError }: EmploymentStepProps) {
  // Get income proof label based on employment type
  const getIncomeProofLabel = () => {
    switch (employmentType) {
      case "EMPLOYED":
        return "Payslips (last 3 months)";
      case "SELF_EMPLOYED":
        return "Tax Return or Accounts";
      case "FREELANCE":
        return "Bank Statements (last 3 months)";
      case "DIRECTOR":
        return "Company Accounts or Director's Salary";
      case "SOLE_PROPRIETOR":
        return "Business Accounts or Tax Return";
      default:
        return "Proof of Income";
    }
  };

  // Get additional document requirements based on employment type
  const getAdditionalDocRequirements = () => {
    switch (employmentType) {
      case "SELF_EMPLOYED":
        return "Business Registration or Tax Certificate";
      case "FREELANCE":
        return "Client Contracts (optional)";
      case "DIRECTOR":
        return "Certificate of Incorporation";
      case "SOLE_PROPRIETOR":
        return "Business License or Registration";
      default:
        return "Any Additional Supporting Documents";
    }
  };

  return (
    <div className="space-y-8">
    <div className={`bg-gray-50 p-6 rounded-lg ${error ? 'border-2 border-red-500' : ''}`}>
      <Label className={`text-gray-800 font-semibold mb-4 block ${error ? 'text-red-600' : ''}`}>
        Employment Status {error && <span className="text-red-600">*</span>}
      </Label>
      <RadioGroup
        value={formData.employmentType}
        onValueChange={(value) => {
          setEmploymentType(value);
          handleFormChange("employmentType", value);
          // Clear error when employment type is selected
          if (setError) {
            setError("");
          }
        }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {[
          { value: "EMPLOYED", label: "Employed" },
          { value: "SELF_EMPLOYED", label: "Self-employed" },
          { value: "FREELANCE", label: "Freelance" },
          { value: "DIRECTOR", label: "Director" },
          { value: "SOLE_PROPRIETOR", label: "Sole Proprietor" }
        ].map((option) => (
          <Label
            key={option.value}
            htmlFor={`employment-${option.value}`}
            className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all ${
              formData.employmentType === option.value || employmentType === option.value
                ? "border-[#dc0a3c] bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => {
              setEmploymentType(option.value);
              handleFormChange("employmentType", option.value);
              // Clear error when employment type is selected
              if (setError) {
                setError("");
              }
            }}
          >
            <RadioGroupItem
              value={option.value}
              id={`employment-${option.value}`}
              className="text-[#dc0a3c]"
            />
            <span className="font-medium">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>

    <AnimatePresence mode="wait">
      {(formData.employmentType === "EMPLOYED" || employmentType === "EMPLOYED") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6 bg-white rounded-lg border"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Employment Details
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="employer-name"
                className="font-medium text-gray-700"
              >
                Employer name
              </Label>
              <Input
                id="employer-name"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.employerName}
                onChange={(e) =>
                  handleFormChange("employerName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="job-title"
                className="font-medium text-gray-700"
              >
                Job title
              </Label>
              <Input
                id="job-title"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.jobTitle}
                onChange={(e) =>
                  handleFormChange("jobTitle", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="employment-start-date"
                className="font-medium text-gray-700"
              >
                Employment start date
              </Label>
              <Input
                id="employment-start-date"
                type="date"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.employmentStartDate}
                onChange={(e) =>
                  handleFormChange(
                    "employmentStartDate",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="annual-income"
                className="font-medium text-gray-700"
              >
                Annual income
              </Label>
              <Input
                id="annual-income"
                placeholder="£"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.annualIncome}
                onChange={(e) =>
                  handleFormChange("annualIncome", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="employer-address"
              className="font-medium text-gray-700"
            >
              Employer address
            </Label>
            <Input
              id="employer-address"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.employerAddress}
              onChange={(e) =>
                handleFormChange("employerAddress", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="employer-phone"
                className="font-medium text-gray-700"
              >
                Employer phone
              </Label>
              <Input
                id="employer-phone"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.employerPhone}
                onChange={(e) =>
                  handleFormChange("employerPhone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="employer-email"
                className="font-medium text-gray-700"
              >
                Employer email
              </Label>
              <Input
                id="employer-email"
                type="email"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.employerEmail}
                onChange={(e) =>
                  handleFormChange("employerEmail", e.target.value)
                }
              />
            </div>
          </div>
        </motion.div>
      )}

      {(formData.employmentType === "SELF_EMPLOYED" || employmentType === "SELF_EMPLOYED") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6 bg-white rounded-lg border"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Self-Employment Details
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="business-name"
                className="font-medium text-gray-700"
              >
                Business name
              </Label>
              <Input
                id="business-name"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessName}
                onChange={(e) =>
                  handleFormChange("businessName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="business-nature"
                className="font-medium text-gray-700"
              >
                Nature of business
              </Label>
              <Input
                id="business-nature"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessNature}
                onChange={(e) =>
                  handleFormChange("businessNature", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="business-years"
                className="font-medium text-gray-700"
              >
                Years in business
              </Label>
              <Input
                id="business-years"
                type="number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.yearsInBusiness}
                onChange={(e) =>
                  handleFormChange("yearsInBusiness", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="annual-income-self"
                className="font-medium text-gray-700"
              >
                Annual income
              </Label>
              <Input
                id="annual-income-self"
                placeholder="£"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.annualIncomeSelf}
                onChange={(e) =>
                  handleFormChange(
                    "annualIncomeSelf",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="business-address"
              className="font-medium text-gray-700"
            >
              Business address
            </Label>
            <Input
              id="business-address"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.businessAddress}
              onChange={(e) =>
                handleFormChange("businessAddress", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="accountant-name"
                className="font-medium text-gray-700"
              >
                Accountant name
              </Label>
              <Input
                id="accountant-name"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.accountantName}
                onChange={(e) =>
                  handleFormChange("accountantName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="accountant-contact"
                className="font-medium text-gray-700"
              >
                Accountant contact
              </Label>
              <Input
                id="accountant-contact"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.accountantContact}
                onChange={(e) =>
                  handleFormChange(
                    "accountantContact",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="utr-number"
              className="font-medium text-gray-700"
            >
              UTR Number
            </Label>
            <Input
              id="utr-number"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.utrNumber}
              onChange={(e) =>
                handleFormChange("utrNumber", e.target.value)
              }
            />
          </div>
        </motion.div>
      )}

      {(formData.employmentType === "FREELANCE" || employmentType === "FREELANCE") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6 bg-white rounded-lg border"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Freelance Details
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="freelance-type"
                className="font-medium text-gray-700"
              >
                Type of work
              </Label>
              <Input
                id="freelance-type"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.freelanceType}
                onChange={(e) =>
                  handleFormChange("freelanceType", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="freelance-years"
                className="font-medium text-gray-700"
              >
                Years freelancing
              </Label>
              <Input
                id="freelance-years"
                type="number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.yearsFreelancing}
                onChange={(e) =>
                  handleFormChange("yearsFreelancing", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="monthly-income"
                className="font-medium text-gray-700"
              >
                Average monthly income
              </Label>
              <Input
                id="monthly-income"
                placeholder="£"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.freelanceMonthlyIncome}
                onChange={(e) =>
                  handleFormChange("freelanceMonthlyIncome", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="portfolio-website"
                className="font-medium text-gray-700"
              >
                Portfolio/Website
              </Label>
              <Input
                id="portfolio-website"
                placeholder="https://"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.freelancePortfolioWebsite}
                onChange={(e) =>
                  handleFormChange(
                    "freelancePortfolioWebsite",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="major-clients"
              className="font-medium text-gray-700"
            >
              Major clients (comma separated)
            </Label>
            <Input
              id="major-clients"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.freelanceMajorClients}
              onChange={(e) =>
                handleFormChange("freelanceMajorClients", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="utr-number-freelance"
              className="font-medium text-gray-700"
            >
              UTR Number
            </Label>
            <Input
              id="utr-number-freelance"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.freelanceUtrNumber}
              onChange={(e) =>
                handleFormChange(
                  "freelanceUtrNumber",
                  e.target.value
                )
              }
            />
          </div>
        </motion.div>
      )}

      {(formData.employmentType === "DIRECTOR" || employmentType === "DIRECTOR") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6 bg-white rounded-lg border"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Director Details
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="company-name"
                className="font-medium text-gray-700"
              >
                Company name
              </Label>
              <Input
                id="company-name"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.companyName}
                onChange={(e) =>
                  handleFormChange("companyName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="company-number"
                className="font-medium text-gray-700"
              >
                Company registration number
              </Label>
              <Input
                id="company-number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.companyNumber}
                onChange={(e) =>
                  handleFormChange("companyNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="font-medium text-gray-700"
              >
                Position in company
              </Label>
              <Input
                id="position"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.position}
                onChange={(e) =>
                  handleFormChange("position", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="ownership-percentage"
                className="font-medium text-gray-700"
              >
                Ownership percentage
              </Label>
              <Input
                id="ownership-percentage"
                type="number"
                placeholder="%"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.ownershipPercentage}
                onChange={(e) =>
                  handleFormChange(
                    "ownershipPercentage",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="director-income"
                className="font-medium text-gray-700"
              >
                Annual income
              </Label>
              <Input
                id="director-income"
                placeholder="£"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.directorIncome}
                onChange={(e) =>
                  handleFormChange("directorIncome", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="company-founded"
                className="font-medium text-gray-700"
              >
                Year company founded
              </Label>
              <Input
                id="company-founded"
                type="number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.companyFounded}
                onChange={(e) =>
                  handleFormChange("companyFounded", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="company-address"
              className="font-medium text-gray-700"
            >
              Company address
            </Label>
            <Input
              id="company-address"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.companyAddress}
              onChange={(e) =>
                handleFormChange("companyAddress", e.target.value)
              }
            />
          </div>
        </motion.div>
      )}

      {(formData.employmentType === "SOLE_PROPRIETOR" || employmentType === "SOLE_PROPRIETOR") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6 bg-white rounded-lg border"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Sole Proprietor Details
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="business-name-sole"
                className="font-medium text-gray-700"
              >
                Business name
              </Label>
              <Input
                id="business-name-sole"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessNameSole}
                onChange={(e) =>
                  handleFormChange(
                    "businessNameSole",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="business-nature-sole"
                className="font-medium text-gray-700"
              >
                Nature of business
              </Label>
              <Input
                id="business-nature-sole"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessNatureSole}
                onChange={(e) =>
                  handleFormChange(
                    "businessNatureSole",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="business-years-sole"
                className="font-medium text-gray-700"
              >
                Years in business
              </Label>
              <Input
                id="business-years-sole"
                type="number"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessYearsSole}
                onChange={(e) =>
                  handleFormChange(
                    "businessYearsSole",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="annual-income-sole"
                className="font-medium text-gray-700"
              >
                Annual income
              </Label>
              <Input
                id="annual-income-sole"
                placeholder="£"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.annualIncomeSole}
                onChange={(e) =>
                  handleFormChange(
                    "annualIncomeSole",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="business-address-sole"
              className="font-medium text-gray-700"
            >
              Business address
            </Label>
            <Input
              id="business-address-sole"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.businessAddressSole}
              onChange={(e) =>
                handleFormChange(
                  "businessAddressSole",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="business-registration"
                className="font-medium text-gray-700"
              >
                Business registration number
              </Label>
              <Input
                id="business-registration"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.businessRegistration}
                onChange={(e) =>
                  handleFormChange(
                    "businessRegistration",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="utr-number-sole"
                className="font-medium text-gray-700"
              >
                UTR Number
              </Label>
              <Input
                id="utr-number-sole"
                className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                value={formData.utrNumberSole}
                onChange={(e) =>
                  handleFormChange("utrNumberSole", e.target.value)
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
}
