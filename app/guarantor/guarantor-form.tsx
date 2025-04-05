"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadSingleFile } from "@/services/general/general";
import { useCreateGuarantorReference } from "@/services/refrences/referenceFn";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import DeclerationFinal from "./steps/decleration-final";
import DeclerationSection from "./steps/decleration-section";
import { DocumentUploadStep } from "./steps/document-upload-step";
import { EmploymentStep } from "./steps/employment-step";
import { PersonalInfoStep } from "./steps/personal-info-step";
import TenantInfo from "./steps/tenant-info";
import SkeletonLoader from "./SkeletonLoader";

interface GuarantorFormProps {
  applicationData: any;
  loading: boolean;
}

interface UploadResponse {
  documentName: string;
  type: string;
  size: string;
  documentUrl: string;
}

export default function GuarantorForm({
  applicationData,
  loading
}: GuarantorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [employmentType, setEmploymentType] = useState("");
  const [documents, setDocuments] = useState({
    id: null,
    addressProof: null,
    incomeProof: null,
    additionalDocs: []
  });
  const applicationId = applicationData?.id;
  const [idType, setIdType] = useState("passport");
  const [dragActive, setDragActive] = useState("");
  const {
    mutate: createGuarantorReference,
    isPending: isCreatingGuarantorReference
  } = useCreateGuarantorReference();
  const { mutateAsync: uploadFile, isPending: isUploadingFile } = uploadSingleFile();
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
    yearsInBusiness: "",
    annualIncome: "",
    annualIncomeSelf: "",
    businessAddress: "",
    accountantName: "",
    accountantContact: "",
    utrNumber: "",
    freelanceType: "",
    yearsFreelancing: "",
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
    guarantorSignedAt: "",
    tenantName: "",
    signedByGuarantor: false,
    employmentStartDate: "",
    monthlyIncome: "",
    portfolioWebsite: "",
    majorClients: "",
    jobTitle: "",
    businessRegistrationNumber: "",
    tenancyStartDay: "",
    tenancyStartMonth: "",
    tenancyStartYear: "",
    dateOfBirthDay: "",
    dateOfBirthMonth: "",
    dateOfBirthYear: ""
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

  const handleCheckboxChange = (field: string, value: string | boolean) => {
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
  const handleFile = async (file: File, docType: string) => {
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
      const res = await uploadFile(file);
      const uploadResponse: UploadResponse = res?.url;
      console.log(res);
      setDocuments((prev) => ({
        ...prev,
        id: {
          file,
          url: uploadResponse?.documentUrl,
          type: uploadResponse?.type,
          size: uploadResponse?.size
        } as any
      }));
    } else if (docType === "addressProof") {
      const res = await uploadFile(file);
      const uploadResponse: UploadResponse = res?.url;
      console.log(res);
      setDocuments((prev) => ({
        ...prev,
        addressProof: {
          file,
          url: uploadResponse?.documentUrl,
          type: uploadResponse?.type,
          size: uploadResponse?.size
        } as any
      }));
    } else if (docType === "incomeProof") {
      const res = await uploadFile(file);
      const uploadResponse: UploadResponse = res?.url;
      console.log(res);
      setDocuments((prev) => ({
        ...prev,
        incomeProof: {
          file,
          url: uploadResponse?.documentUrl,
          type: uploadResponse?.type,
          size: uploadResponse?.size
        } as any
      }));
    } else if (docType === "additionalDocs") {
      const res = await uploadFile(file);
      const uploadResponse: UploadResponse = res?.url;
      console.log(res);
      setDocuments(
        (prev) =>
          ({
            ...prev,
            additionalDocs: [
              ...prev.additionalDocs,
              {
                file,
                url: uploadResponse?.documentUrl,
                type: uploadResponse?.type,
                size: uploadResponse?.size
              } as any
            ]
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

  // Define employment-related fields
  const employmentFields = [
    'employmentType',
    'employmentStartDate',
    'monthlyIncome',
    'portfolioWebsite',
    'majorClients',
    'jobTitle',
    'businessRegistrationNumber',
    'businessAddress',
    'businessName',
    'businessNature',
    'yearsInBusiness',
    'annualIncome',
    'annualIncomeSelf',
    'businessAddressSole',
    'businessNameSole',
    'businessNatureSole',
    'businessYearsSole',
    'annualIncomeSole',
    'utrNumberSole',
    'freelanceType',
    'yearsFreelancing',
    'freelanceMonthlyIncome',
    'freelancePortfolioWebsite',
    'freelanceMajorClients',
    'freelanceUtrNumber',
    'companyName',
    'companyNumber',
    'position',
    'ownershipPercentage',
    'directorIncome',
    'companyFounded',
    'companyAddress',
    'employerName',
    'employerAddress',
    'employerPhone',
    'employerEmail'
  ];
  const handleSubmit = () => {
    console.log("Form submission started");
    console.log("Form Data:", formData);
    console.log("Documents:", documents);


    const dateOfBirth = new Date(
      `${formData.dateOfBirthYear}-${formData.dateOfBirthMonth}-${formData.dateOfBirthDay}`
    );
    // filter form data that has value
    const filteredFormData = Object.entries(formData)
      .filter(([key, value]) => value !== "" && !employmentFields.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const cleanDocumentData = Object.entries(documents).reduce(
      (acc: any[], [key, value]: [string, any]) => {
        // Handle additionalDocs array
        if (key === "additionalDocs" && Array.isArray(value)) {
          value.forEach(doc => {
            if (doc?.url) {
              acc.push({
                documentUrl: doc.url,
                type: doc.type,
                size: doc.size,
                documentName: doc.documentName || "Additional Document",
                idType: idType?.toUpperCase() || "PASSPORT",
                docType: "ID"
              });
            }
          });
        } 
        // Handle single document objects
        else if (value && typeof value === "object" && value.url) {
          acc.push({
            documentUrl: value.url,
            type: value.type,
            size: value.size,
            documentName: key,
            idType: idType?.toUpperCase() || "PASSPORT",
            docType: "ID"
          });
        }
        return acc;
      },
      [] // Start with an empty array instead of an object
    );

    // Create guarantorEmployment object with only non-empty employment fields
    const guarantorEmployment = Object.entries(formData)
      .filter(([key, value]) => value !== "" && employmentFields.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    const {dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear, additionalDocs, ...rest} = filteredFormData as any
    const payload = {
      ...rest,
      guarantorEmployment,
      documents: cleanDocumentData,
      // tenancyStartDate: new Date(applicationData?.createdAt).toISOString(),
      dateOfBirth: dateOfBirth.toISOString(),
      // applicationId: applicationId as string
    };
    console.log("Payload:", payload);

    createGuarantorReference({ applicationId: applicationId as string, data: payload });
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
            <Input
              type="date"
              className="w-40"
              value={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : (
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
                <TenantInfo
                  formData={formData}
                  applicationInfo={applicationData}
                  handleFormChange={handleFormChange}
                />
              )}

              {currentStep === 2 && (
                <PersonalInfoStep
                  formData={formData}
                  handleFormChange={handleFormChange}
                />
              )}

              {currentStep === 3 && (
                <EmploymentStep
                  formData={formData}
                  handleFormChange={handleFormChange}
                  employmentType={employmentType}
                  setEmploymentType={setEmploymentType}
                />
              )}

              {currentStep === 4 && (
                <DocumentUploadStep
                  documents={documents}
                  idType={idType}
                  setIdType={setIdType}
                  dragActive={dragActive}
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                  employmentType={employmentType}
                  getIncomeProofLabel={getIncomeProofLabel}
                  getAdditionalDocRequirements={getAdditionalDocRequirements}
                  idInputRef={idInputRef}
                  addressProofInputRef={addressProofInputRef}
                  incomeProofInputRef={incomeProofInputRef}
                  additionalDocsInputRef={additionalDocsInputRef}
                  removeDocument={removeDocument}
                  handleFileUpload={handleFileUpload}
                />
              )}

              {currentStep === 5 && (
                <DeclerationSection
                  formData={formData}
                  handleFormChange={handleFormChange}
                  applicationInfo={applicationData}
                />
              )}

              {currentStep === 6 && (
                <DeclerationFinal
                  formData={formData}
                  handleFormChange={handleFormChange}
                  handleCheckboxChange={handleCheckboxChange}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex justify-between mt-12 gap-4">
          <Button
            onClick={goToPreviousStep}
            disabled={currentStep === 1 || isCreatingGuarantorReference}
            variant="outline"
            className="flex-1 h-12 rounded-md border-[#dc0a3c] text-[#dc0a3c] bg-white hover:bg-gray-50 hover:text-[#dc0a3c] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingGuarantorReference}
              disabled={isUploadingFile}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingGuarantorReference}
              disabled={!formData.signedByGuarantor}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
