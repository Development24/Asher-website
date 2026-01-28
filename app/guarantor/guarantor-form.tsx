"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/button";
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
import { LoadingStates } from "@/components/ui/loading-states";
import { UploadFilesResponse } from "@/services/general/general";

interface DocumentState {
  file: File | null;
  url: string | null;
  type: string | null;
  size: string | null;
}

interface DocumentsState {
  id: DocumentState;
  addressProof: DocumentState;
  incomeProof: DocumentState;
  additionalDocs: DocumentState[];
}

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
  const [employmentTypeError, setEmploymentTypeError] = useState("");
  const [documents, setDocuments] = useState<DocumentsState>({
    id: { file: null, url: null, type: null, size: null },
    addressProof: { file: null, url: null, type: null, size: null },
    incomeProof: { file: null, url: null, type: null, size: null },
    additionalDocs: []
  });
  const applicationId = applicationData?.id;
  const [idType, setIdType] = useState("passport");
  const [dragActive, setDragActive] = useState("");
  const {
    mutate: createGuarantorReference,
    isPending: isCreatingGuarantorReference
  } = useCreateGuarantorReference();
  const { mutateAsync: uploadFile, isPending: isUploadingFile } =
    uploadSingleFile();
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
    // guarantorName: "",
    guarantorSignature: "",
    guarantorSignedAt: "",
    tenantName: "",
    signedByGuarantor: false,
    employmentStartDate: "",
    monthlyIncome: "",
    portfolioWebsite: "",
    majorClients: "",
    jobTitle: "",
    tenancyStartDay: "",
    tenancyStartMonth: "",
    tenancyStartYear: "",
    dateOfBirthDay: "",
    dateOfBirthMonth: "",
    dateOfBirthYear: ""
  });

  const goToNextStep = () => {
    // Validate employment type on step 3 (Employment Details)
    if (currentStep === 3) {
      if (!formData.employmentType || !employmentType) {
        setEmploymentTypeError("Please select an employment status");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setEmploymentTypeError(""); // Clear error if validation passes
    }
    
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
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = (await uploadFile(file)) as UploadFilesResponse;
      if (process.env.NODE_ENV === "development") {
        console.log(`Upload response for ${docType}:`, response);
      }
      if (response.url) {
        const docState: DocumentState = {
          file,
          url: response.url,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        };

        if (process.env.NODE_ENV === "development") {
          console.log(`Created doc state for ${docType}:`, docState);
        }

        setDocuments((prev) => {
          const newState = { ...prev };
          switch (docType) {
            case "id":
              newState.id = docState;
              break;
            case "addressProof":
              newState.addressProof = docState;
              break;
            case "incomeProof":
              newState.incomeProof = docState;
              break;
            case "additionalDocs":
              newState.additionalDocs = [...prev.additionalDocs, docState];
              break;
          }
          return newState;
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
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
  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    docType: string
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive("");

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      const response = (await uploadFile(file)) as UploadFilesResponse;
      if (response.url) {
        const docState: DocumentState = {
          file,
          url: response.url,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        };

        setDocuments((prev) => {
          const newState = { ...prev };
          switch (docType) {
            case "id":
              newState.id = docState;
              break;
            case "addressProof":
              newState.addressProof = docState;
              break;
            case "incomeProof":
              newState.incomeProof = docState;
              break;
            case "additionalDocs":
              newState.additionalDocs = [...prev.additionalDocs, docState];
              break;
          }
          return newState;
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error uploading file:", error);
      }
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
      const uploadResponse: any = res?.url;
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
      const uploadResponse: any = res?.url;
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
      const uploadResponse: any = res?.url;
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
      const uploadResponse: any = res?.url;
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
      setDocuments((prev: any) => ({ ...prev, id: null }));
    } else if (docType === "addressProof") {
      setDocuments((prev: any) => ({ ...prev, addressProof: null }));
    } else if (docType === "incomeProof") {
      setDocuments((prev: any) => ({ ...prev, incomeProof: null }));
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
    "employmentType",
    "employmentStatus", // Also accept employmentStatus from payload
    "employmentStartDate",
    "startDate", // Also accept startDate from payload
    "monthlyIncome",
    "portfolioWebsite",
    "majorClients",
    "jobTitle",
    "positionTitle", // Also accept positionTitle from payload
    "businessAddress",
    "businessName",
    "businessNature",
    "businessType", // Also accept businessType from payload
    "yearsInBusiness",
    "annualIncome",
    "annualIncomeSelf",
    "monthlyOrAnualIncome", // Also accept monthlyOrAnualIncome from payload
    "businessAddressSole",
    "businessNameSole",
    "businessNatureSole",
    "businessYearsSole",
    "annualIncomeSole",
    "utrNumberSole",
    "freelanceType",
    "yearsFreelancing",
    "freelanceMonthlyIncome",
    "freelancePortfolioWebsite",
    "freelanceMajorClients",
    "freelanceUtrNumber",
    "companyName",
    "companyNumber",
    "position",
    "ownershipPercentage",
    "directorIncome",
    "companyFounded",
    "companyAddress",
    "employerName",
    "employerCompany", // Also accept employerCompany from payload
    "employerAddress",
    "employerPhone",
    "employerEmail"
  ];
  const handleSubmit = () => {
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
          value.forEach((doc) => {
            if (doc?.url) {
              acc.push({
                documentUrl: doc?.url?.documentUrl,
                type: doc?.type,
                size: doc?.size,
                documentName: doc?.url?.documentName || "Additional Document",
                idType: idType?.toUpperCase() || "PASSPORT",
                docType: "ID"
              });
            }
          });
        }
        // Handle single document objects
        else if (value && typeof value === "object" && value.url) {
          console.log("value", value);
          acc.push({
            documentUrl: value?.url?.documentUrl,
            type: value?.type,
            size: value?.size,
            documentName: key,
            idType: idType?.toUpperCase() || "PASSPORT",
            docType: "ID"
          });
        }
        return acc;
      },
      [] // Start with an empty array instead of an object
    );

    // Transform employment data to match backend schema requirements
    const transformEmploymentData = (data: Record<string, any>) => {
      const transformed: Record<string, any> = {};
      
      // Map frontend employment status to backend enum values
      const employmentStatusMap: Record<string, string> = {
        'Employed': 'EMPLOYED',
        'Self-employed': 'SELF_EMPLOYED',
        'Freelance': 'FREELANCE',
        'Director': 'DIRECTOR',
        'Sole Proprietor': 'SOLE_PROPRIETOR',
        'EMPLOYED': 'EMPLOYED',
        'SELF_EMPLOYED': 'SELF_EMPLOYED',
        'FREELANCE': 'FREELANCE',
        'DIRECTOR': 'DIRECTOR',
        'SOLE_PROPRIETOR': 'SOLE_PROPRIETOR',
      };
      
      // Map frontend field names to backend field names
      const fieldNameMap: Record<string, string> = {
        'employerCompany': 'employerName',
        'positionTitle': 'jobTitle',
        'businessType': 'businessNature',
        'monthlyOrAnualIncome': 'annualIncome', // Will be handled separately based on employment type
        'startDate': 'employmentStartDate',
        'employmentStatus': 'employmentType',
      };
      
      // Fields that should be numbers (convert string to number)
      const numberFields = [
        'yearsInBusiness', 'annualIncome', 'annualIncomeSelf',
        'yearsFreelancing', 'freelanceMonthlyIncome', 'freelanceUtrNumber',
        'ownershipPercentage', 'directorIncome', 'companyFounded',
        'businessYearsSole', 'annualIncomeSole'
      ];
      
      // Fields that should be dates (convert string to Date)
      const dateFields = ['employmentStartDate', 'startDate'];
      
      // Fields to exclude (not in backend schema)
      const excludeFields = ['monthlyIncome', 'portfolioWebsite', 'majorClients', 
        'businessEmail', 'businessPhone', 'taxCredit', 'childBenefit', 
        'childMaintenance', 'disabilityBenefit', 'housingBenefit', 'pension'];
      
      // Get employment type and map it
      let employmentType = data.employmentType || data.employmentStatus || '';
      if (employmentType) {
        employmentType = employmentStatusMap[employmentType] || employmentType.toUpperCase();
      }
      
      // If employment type is not supported, don't send employment data
      const supportedTypes = ['EMPLOYED', 'SELF_EMPLOYED', 'FREELANCE', 'DIRECTOR', 'SOLE_PROPRIETOR'];
      if (employmentType && !supportedTypes.includes(employmentType)) {
        // For Unemployed, Retired, Student - don't send employment data (it's optional)
        return {};
      }
      
      // Always include employmentType if it's valid
      if (employmentType && supportedTypes.includes(employmentType)) {
        transformed.employmentType = employmentType;
      }
      
      Object.entries(data).forEach(([key, value]) => {
        // Skip excluded fields
        if (excludeFields.includes(key)) {
          return;
        }
        
        // Skip null/undefined/empty strings
        if (value === null || value === undefined || value === "") {
          return;
        }
        
        // Map field names
        const backendKey = fieldNameMap[key] || key;
        
        // Handle special field mappings
        if (key === 'monthlyOrAnualIncome') {
          // Map to annualIncome or annualIncomeSelf based on employment type
          if (employmentType === 'SELF_EMPLOYED') {
            const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
            if (!isNaN(numValue) && isFinite(numValue)) {
              transformed.annualIncomeSelf = parseInt(String(numValue), 10);
            }
          } else {
            const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
            if (!isNaN(numValue) && isFinite(numValue)) {
              transformed.annualIncome = numValue;
            }
          }
          return;
        }
        
        // Convert number fields
        if (numberFields.includes(backendKey)) {
          const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
          if (!isNaN(numValue) && isFinite(numValue)) {
            // For integer fields, use parseInt
            const integerFields = ['yearsInBusiness', 'annualIncomeSelf', 'yearsFreelancing', 
              'ownershipPercentage', 'directorIncome', 'companyFounded', 'businessYearsSole'];
            transformed[backendKey] = integerFields.includes(backendKey) ? parseInt(String(numValue), 10) : numValue;
          }
        }
        // Convert date fields
        else if (dateFields.includes(key) || dateFields.includes(backendKey)) {
          if (typeof value === 'string' && value.trim() !== '') {
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
              transformed[backendKey] = dateValue;
            }
          } else if (value instanceof Date) {
            transformed[backendKey] = value;
          }
        }
        // Keep other fields as strings
        else {
          transformed[backendKey] = value;
        }
      });
      
      return transformed;
    };

    // Create guarantorEmployment object with only non-empty employment fields
    const rawGuarantorEmployment = Object.entries(formData)
      .filter(([key, value]) => value !== "" && employmentFields.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    // Also check if applicationData has employment info to merge (for pre-filled data from application)
    if (applicationData?.guarantorInformation?.employmentInfo || applicationData?.employmentInfo) {
      const employmentInfo = applicationData?.guarantorInformation?.employmentInfo || applicationData?.employmentInfo;
      Object.entries(employmentInfo).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          // Map frontend field names to form field names
          const fieldMap: Record<string, string> = {
            'employerCompany': 'employerName',
            'positionTitle': 'jobTitle',
            'businessType': 'businessNature',
            'employmentStatus': 'employmentType',
            'startDate': 'employmentStartDate',
            'monthlyOrAnualIncome': 'annualIncome',
          };
          const mappedKey = fieldMap[key] || key;
          // Only add if not already in formData and if it's an employment field
          if (!rawGuarantorEmployment[mappedKey as keyof typeof rawGuarantorEmployment] && employmentFields.includes(mappedKey)) {
            (rawGuarantorEmployment as any)[mappedKey as keyof typeof rawGuarantorEmployment] = value;
          }
        }
      });
    }
    
    // Transform the employment data to match backend schema
    const guarantorEmployment = transformEmploymentData(rawGuarantorEmployment);
    
    const {
      dateOfBirthDay,
      dateOfBirthMonth,
      dateOfBirthYear,
      additionalDocs,
      ...rest
    } = filteredFormData as any;
    
    // Only include guarantorEmployment if it has employmentType (required field)
    // For Unemployed, Retired, Student - employment is optional, so omit it
    const payload = {
      ...rest,
      ...(guarantorEmployment && guarantorEmployment.employmentType ? { guarantorEmployment } : {}),
      documents: cleanDocumentData,
      dateOfBirth: dateOfBirth.toISOString()
    };

    createGuarantorReference({
      applicationId: applicationId as string,
      data: payload
    });
  };

  const clearAllDocuments = () => {
    setDocuments({
      id: { file: null, url: null, type: null, size: null },
      addressProof: { file: null, url: null, type: null, size: null },
      incomeProof: { file: null, url: null, type: null, size: null },
      additionalDocs: []
    });
    console.log("All documents cleared.");
  };

  return (
    <div className="overflow-hidden mx-auto max-w-4xl bg-white rounded-xl shadow-lg">
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center mb-6">
          <button
            onClick={() => {}}
            className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="flex-1 mr-8 text-xl font-bold text-center">
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
        <div className="flex overflow-x-auto justify-between pb-2 mt-4">
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
          <LoadingStates.Form />
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
                  error={employmentTypeError}
                  setError={setEmploymentTypeError}
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

        <div className="flex gap-4 justify-between mt-12">
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
