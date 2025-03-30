"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChevronLeft,
  CheckCircle2,
  Upload,
  X,
  FileText,
  AlertCircle,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuarantorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [employmentType, setEmploymentType] = useState("");
  const [documents, setDocuments] = useState({
    id: null,
    addressProof: null,
    incomeProof: null,
    additionalDocs: []
  });
  const [idType, setIdType] = useState("passport");
  const [dragActive, setDragActive] = useState("");

  const idInputRef = useRef<HTMLInputElement>(null);
  const addressProofInputRef = useRef<HTMLInputElement>(null);
  const incomeProofInputRef = useRef<HTMLInputElement>(null);
  const additionalDocsInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    propertyAddress: "",
    rentAmount: "",
    tenancyStartDate: "",
    employmentType: "",
    idType: "",
    idNumber: "",
    idExpiryDate: "",
    incomeProof: "",
    additionalDocs: [],
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    nationalInsuranceNumber: "",
    contactNumber: "",
    emailAddress: "",
    employerName: "",
    employerAddress: "",
    employerPhone: "",
    employerEmail: "",
    businessName: "",
    businessNature: "",
    businessYears: "",
    annualIncome: "",
    annualIncomeSelf: "",
    businessAddress: "",
    accountantName: "",
    accountantContact: "",
    utrNumber: "",
    freelanceType: "",
    freelanceYears: "",
    freelanceMonthlyIncome: "",
    freelancePortfolioWebsite: "",
    freelanceMajorClients: "",
    freelanceUtrNumber: "",
    companyName: "",
    companyNumber: "",
    position: "",
    ownershipPercentage: "",
    directorIncome: "",
    companyFounded: "",
    companyAddress: "",
    businessNameSole: "",
    businessNatureSole: "",
    businessYearsSole: "",
    annualIncomeSole: "",
    businessAddressSole: "",
    businessRegistration: "",
    utrNumberSole: "",
    guarantorName: "",
    guarantorSignature: "",
    guarantorDate: "",
    tenantName: "",
    declaration: false,
    employmentStartDate: "",
    monthlyIncome: "",
    portfolioWebsite: "",
    majorClients: "",
    jobTitle: "",
    businessRegistrationNumber: "",
  });

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate days, months, and years for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const steps = [
    { id: 1, name: "Tenant Information" },
    { id: 2, name: "Guarantor Information" },
    { id: 3, name: "Employment Details" },
    { id: 4, name: "Documents" },
    { id: 5, name: "Agreement Terms" },
    { id: 6, name: "Declaration & Signature" }
  ];

  // Handle file upload
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file, docType);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    console.log(`Field ${field} updated:`, value);
  };

  // Handle drag events
  const handleDrag = (
    event: React.DragEvent<HTMLDivElement>,
    docType: string,
    active: boolean
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (active) setDragActive(docType);
    else setDragActive("");
  };

  // Handle drop event
  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    docType: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive("");

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0], docType);
    }
  };

  // Process the file
  const handleFile = (file: File, docType: string) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG, PNG, or PDF file.");
      return;
    }

    // Create a URL for the file
    const fileURL = URL.createObjectURL(file);

    // Update state based on document type
    if (docType === "id") {
      setDocuments((prev) => ({ ...prev, id: { file, url: fileURL } as any }));
    } else if (docType === "addressProof") {
      setDocuments((prev) => ({
        ...prev,
        addressProof: { file, url: fileURL } as any
      }));
    } else if (docType === "incomeProof") {
      setDocuments((prev) => ({
        ...prev,
        incomeProof: { file, url: fileURL } as any
      }));
    } else if (docType === "additionalDocs") {
      setDocuments(
        (prev) =>
          ({
            ...prev,
            additionalDocs: [...prev.additionalDocs, { file, url: fileURL }]
          } as any)
      );
    }
  };

  // Remove a document
  const removeDocument = (docType: string, index: number | null) => {
    if (docType === "id") {
      setDocuments((prev) => ({ ...prev, id: null }));
    } else if (docType === "addressProof") {
      setDocuments((prev) => ({ ...prev, addressProof: null }));
    } else if (docType === "incomeProof") {
      setDocuments((prev) => ({ ...prev, incomeProof: null }));
    } else if (docType === "additionalDocs" && index !== null) {
      setDocuments((prev) => ({
        ...prev,
        additionalDocs: prev.additionalDocs.filter((_, i) => i !== index)
      }));
    }
  };

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

  const handleSubmit = () => {

    console.log("Form submission started");
    console.log("Form Data:", formData);
    console.log("Documents:", documents);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center mb-6">
          <button
            onClick={() => {}}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">
            Guarantor Agreement Form
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#dc0a3c] h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4 overflow-x-auto pb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center min-w-[80px]"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "border-[#dc0a3c] bg-[#dc0a3c] text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center ${
                  currentStep >= step.id ? "text-[#dc0a3c]" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {steps[currentStep - 1].name}
          </h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-600">
              Today's Date
            </span>
            <Input type="date" className="w-40" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="tenant-fullname"
                    className="text-gray-700 font-medium"
                  >
                    Full name
                  </Label>
                  <Input
                    id="tenant-fullname"
                    placeholder="Enter full name"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange("fullName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="property-address"
                      className="text-gray-700 font-medium"
                    >
                      Property address
                    </Label>
                    <Input
                      id="property-address"
                      placeholder="Address"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.propertyAddress}
                      onChange={(e) => handleFormChange("propertyAddress", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="rent-amount"
                      className="text-gray-700 font-medium"
                    >
                      Rent amount
                    </Label>
                    <Input
                      id="rent-amount"
                      placeholder="Enter amount"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.rentAmount}
                      onChange={(e) => handleFormChange("rentAmount", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Tenancy start date
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Select
                      value={formData.tenancyStartDate}
                      onValueChange={(value) => handleFormChange("tenancyStartDate", value)}
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
                      value={formData.tenancyStartDate}
                      onValueChange={(value) => handleFormChange("tenancyStartDate", value)}
                    >
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem
                            key={month}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.tenancyStartDate}
                      onValueChange={(value) => handleFormChange("tenancyStartDate", value)}
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
              </div>
            )}

            {currentStep === 2 && (
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
                  <Label className="text-gray-700 font-medium">
                    Date of birth
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Select
                      value={formData.dateOfBirth}
                      onValueChange={(value) => handleFormChange("dateOfBirth", value)}
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
                      value={formData.dateOfBirth}
                      onValueChange={(value) => handleFormChange("dateOfBirth", value)}
                    >
                      <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem
                            key={month}
                            value={(index + 1).toString()}
                          >
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.dateOfBirth}
                      onValueChange={(value) => handleFormChange("dateOfBirth", value)}
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
                    onChange={(e) => handleFormChange("nationalInsuranceNumber", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-number"
                      className="text-gray-700 font-medium"
                    >
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
                    <Label
                      htmlFor="email-address"
                      className="text-gray-700 font-medium"
                    >
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
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Label className="text-gray-800 font-semibold mb-4 block">
                    Employment Status
                  </Label>
                  <RadioGroup
                    value={formData.employmentType}
                    onValueChange={(value) => handleFormChange("employmentType", value)}
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
                            value={formData.employerName}
                            onChange={(e) => handleFormChange("employerName", e.target.value)}
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
                            value={formData.jobTitle}
                            onChange={(e) => handleFormChange("jobTitle", e.target.value)}
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
                            value={formData.employmentStartDate}
                            onChange={(e) => handleFormChange("employmentStartDate", e.target.value)}
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
                            value={formData.annualIncome}
                            onChange={(e) => handleFormChange("annualIncome", e.target.value)}
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
                          value={formData.employerAddress}
                          onChange={(e) => handleFormChange("employerAddress", e.target.value)}
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
                            value={formData.employerPhone}
                            onChange={(e) => handleFormChange("employerPhone", e.target.value)}
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
                            value={formData.employerEmail}
                            onChange={(e) => handleFormChange("employerEmail", e.target.value)}
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
                            value={formData.businessName}
                            onChange={(e) => handleFormChange("businessName", e.target.value)}
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
                            value={formData.businessNature}
                            onChange={(e) => handleFormChange("businessNature", e.target.value)}
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
                            value={formData.businessYears}
                            onChange={(e) => handleFormChange("businessYears", e.target.value)}
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
                            value={formData.annualIncomeSelf}
                            onChange={(e) => handleFormChange("annualIncomeSelf", e.target.value)}
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
                          value={formData.businessAddress}
                          onChange={(e) => handleFormChange("businessAddress", e.target.value)}
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
                            value={formData.accountantName}
                            onChange={(e) => handleFormChange("accountantName", e.target.value)}
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
                            value={formData.accountantContact}
                            onChange={(e) => handleFormChange("accountantContact", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="utr-number"
                          className="text-gray-700 font-medium"
                        >
                          UTR Number
                        </Label>
                        <Input
                          id="utr-number"
                          className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                          value={formData.utrNumber}
                          onChange={(e) => handleFormChange("utrNumber", e.target.value)}
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
                            value={formData.freelanceType}
                            onChange={(e) => handleFormChange("freelanceType", e.target.value)}
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
                            value={formData.freelanceYears}
                            onChange={(e) => handleFormChange("freelanceYears", e.target.value)}
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
                            value={formData.monthlyIncome}
                            onChange={(e) => handleFormChange("monthlyIncome", e.target.value)}
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
                            value={formData.portfolioWebsite}
                            onChange={(e) => handleFormChange("portfolioWebsite", e.target.value)}
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
                          value={formData.majorClients}
                          onChange={(e) => handleFormChange("majorClients", e.target.value)}
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
                          value={formData.freelanceUtrNumber}
                          onChange={(e) => handleFormChange("freelanceUtrNumber", e.target.value)}
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
                            value={formData.companyName}
                            onChange={(e) => handleFormChange("companyName", e.target.value)}
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
                            value={formData.companyNumber}
                            onChange={(e) => handleFormChange("companyNumber", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="position"
                            className="text-gray-700 font-medium"
                          >
                            Position in company
                          </Label>
                          <Input
                            id="position"
                            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                            value={formData.position}
                            onChange={(e) => handleFormChange("position", e.target.value)}
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
                            value={formData.ownershipPercentage}
                            onChange={(e) => handleFormChange("ownershipPercentage", e.target.value)}
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
                            value={formData.directorIncome}
                            onChange={(e) => handleFormChange("directorIncome", e.target.value)}
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
                            value={formData.companyFounded}
                            onChange={(e) => handleFormChange("companyFounded", e.target.value)}
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
                          value={formData.companyAddress}
                          onChange={(e) => handleFormChange("companyAddress", e.target.value)}
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
                            value={formData.businessNameSole}
                            onChange={(e) => handleFormChange("businessNameSole", e.target.value)}
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
                            value={formData.businessNatureSole}
                            onChange={(e) => handleFormChange("businessNatureSole", e.target.value)}
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
                            value={formData.businessYearsSole}
                            onChange={(e) => handleFormChange("businessYearsSole", e.target.value)}
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
                            value={formData.annualIncomeSole}
                            onChange={(e) => handleFormChange("annualIncomeSole", e.target.value)}
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
                          value={formData.businessAddressSole}
                          onChange={(e) => handleFormChange("businessAddressSole", e.target.value)}
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
                            value={formData.businessRegistration}
                            onChange={(e) => handleFormChange("businessRegistration", e.target.value)}
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
                            value={formData.utrNumberSole}
                            onChange={(e) => handleFormChange("utrNumberSole", e.target.value)}
                            />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-800 mb-6">
                    Required Documents
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please upload the following documents. Accepted formats:
                    JPEG, PNG, PDF (max 5MB each)
                  </p>

                  <div className="space-y-8">
                    {/* ID Document Upload */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-gray-700 font-medium">
                          ID Document
                        </Label>
                        <div className="flex space-x-2">
                          <RadioGroup
                            value={idType}
                            onValueChange={setIdType}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="passport" id="passport" />
                              <Label htmlFor="passport" className="text-sm">
                                Passport
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="driving-license"
                                id="driving-license"
                              />
                              <Label
                                htmlFor="driving-license"
                                className="text-sm"
                              >
                                Driving License
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      {documents.id ? (
                        <div className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <span className="text-sm font-medium truncate max-w-xs">
                                {documents.id.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({Math.round(documents.id.file.size / 1024)} KB)
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Uploaded
                              </span>
                            </div>
                            <button
                              onClick={() => removeDocument("id", documents.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center ${
                            dragActive === "id"
                              ? "border-[#dc0a3c] bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragOver={(e) => handleDrag(e, "id", true)}
                          onDragEnter={(e) => handleDrag(e, "id", true)}
                          onDragLeave={(e) => handleDrag(e, "id", false)}
                          onDrop={(e) => handleDrop(e, "id")}
                        >
                          <input
                            ref={idInputRef}
                            type="file"
                            id="id-upload"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileUpload(e, "id")}
                          />
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Drag & drop your{" "}
                              {idType === "passport"
                                ? "passport"
                                : "driving license"}{" "}
                              here
                            </p>
                            <p className="text-xs text-gray-500 mb-3">or</p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => idInputRef.current?.click()}
                              className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Proof of Address Upload */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">
                        Proof of Address (Utility Bill, Bank Statement)
                      </Label>

                      {documents.addressProof ? (
                        <div className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <span className="text-sm font-medium truncate max-w-xs">
                                {documents.addressProof.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                (
                                {Math.round(
                                  documents.addressProof.file.size / 1024
                                )}{" "}
                                KB)
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Uploaded
                              </span>
                            </div>
                            <button
                              onClick={() => removeDocument("addressProof", documents.addressProof)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center ${
                            dragActive === "addressProof"
                              ? "border-[#dc0a3c] bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragOver={(e) =>
                            handleDrag(e, "addressProof", true)
                          }
                          onDragEnter={(e) =>
                            handleDrag(e, "addressProof", true)
                          }
                          onDragLeave={(e) =>
                            handleDrag(e, "addressProof", false)
                          }
                          onDrop={(e) => handleDrop(e, "addressProof")}
                        >
                          <input
                            ref={addressProofInputRef}
                            type="file"
                            id="address-proof-upload"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                              handleFileUpload(e, "addressProof")
                            }
                          />
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Drag & drop your proof of address here
                            </p>
                            <p className="text-xs text-gray-500 mb-3">or</p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                addressProofInputRef.current?.click()
                              }
                              className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Proof of Income Upload */}
                    {employmentType && (
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          {getIncomeProofLabel()}
                        </Label>

                        {documents.incomeProof ? (
                          <div className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium truncate max-w-xs">
                                  {documents.incomeProof.file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (
                                  {Math.round(
                                    documents.incomeProof.file.size / 1024
                                  )}{" "}
                                  KB)
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <Check className="h-3 w-3 mr-1" />
                                  Uploaded
                                </span>
                              </div>
                              <button
                                onClick={() => removeDocument("incomeProof", documents.incomeProof)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${
                              dragActive === "incomeProof"
                                ? "border-[#dc0a3c] bg-red-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onDragOver={(e) =>
                              handleDrag(e, "incomeProof", true)
                            }
                            onDragEnter={(e) =>
                              handleDrag(e, "incomeProof", true)
                            }
                            onDragLeave={(e) =>
                              handleDrag(e, "incomeProof", false)
                            }
                            onDrop={(e) => handleDrop(e, "incomeProof")}
                          >
                            <input
                              ref={incomeProofInputRef}
                              type="file"
                              id="income-proof-upload"
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) =>
                                handleFileUpload(e, "incomeProof")
                              }
                            />
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Drag & drop your income proof here
                              </p>
                              <p className="text-xs text-gray-500 mb-3">or</p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  incomeProofInputRef.current?.click()
                                }
                                className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                              >
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Documents Upload */}
                    {employmentType && employmentType !== "employed" && (
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          {getAdditionalDocRequirements()}
                        </Label>

                        <div className="space-y-4">
                          {documents.additionalDocs.map((doc, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 bg-white"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-5 w-5 text-blue-500" />
                                  <span className="text-sm font-medium truncate max-w-xs">
                                    {doc.file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({Math.round(doc.file.size / 1024)} KB)
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <Check className="h-3 w-3 mr-1" />
                                    Uploaded
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    removeDocument("additionalDocs", index)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${
                              dragActive === "additionalDocs"
                                ? "border-[#dc0a3c] bg-red-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            onDragOver={(e) =>
                              handleDrag(e, "additionalDocs", true)
                            }
                            onDragEnter={(e) =>
                              handleDrag(e, "additionalDocs", true)
                            }
                            onDragLeave={(e) =>
                              handleDrag(e, "additionalDocs", false)
                            }
                            onDrop={(e) => handleDrop(e, "additionalDocs")}
                          >
                            <input
                              ref={additionalDocsInputRef}
                              type="file"
                              id="additional-docs-upload"
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) =>
                                handleFileUpload(e, "additionalDocs")
                              }
                            />
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Drag & drop additional documents here
                              </p>
                              <p className="text-xs text-gray-500 mb-3">or</p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  additionalDocsInputRef.current?.click()
                                }
                                className="bg-white text-[#dc0a3c] border-[#dc0a3c] hover:bg-red-50"
                              >
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Important Note
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      All documents must be clear, legible, and current (issued
                      within the last 3 months for utility bills and bank
                      statements). Incomplete or unclear documents may delay
                      your application.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
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
                      I will be liable for any unpaid rent, damages, or other
                      financial obligations related to the tenancy.
                    </li>
                    <li className="text-gray-700">
                      My liability remains in effect for the duration of the
                      tenancy, including any renewal periods.
                    </li>
                    <li className="text-gray-700">
                      If the tenant defaults, I will pay the owed amount upon
                      request.
                    </li>
                    <li className="text-gray-700">
                      My liability is joint and several, meaning the landlord
                      can seek payment from me if necessary.
                    </li>
                    <li className="text-gray-700">
                      This agreement remains binding even if circumstances
                      change, including job loss or relocation.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="flex items-start space-x-3 bg-gray-50 p-6 rounded-lg">
                  <Checkbox
                    id="declaration"
                    className="mt-1 h-5 w-5 border-gray-300 text-[#dc0a3c] rounded focus:ring-[#dc0a3c]"
                    checked={formData.declaration}
                    onChange={(e) => handleFormChange("declaration", e.target)}
                  />
                  <Label
                    htmlFor="declaration"
                    className="font-medium text-gray-700"
                  >
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
                        onChange={(e) => handleFormChange("guarantorName", e.target.value)}
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
                        onChange={(e) => handleFormChange("guarantorSignature", e.target.value)}
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
                        value={formData.guarantorDate}
                        onChange={(e) => handleFormChange("guarantorDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 gap-4">
          <Button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex-1 h-12 rounded-md border-[#dc0a3c] text-[#dc0a3c] bg-white hover:bg-gray-50 hover:text-[#dc0a3c] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
