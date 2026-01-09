"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLandlordReference } from "@/services/refrences/referenceFn";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import AdditionalInfo from "./steps/addidtional-info";
import LandlordInfo from "./steps/landlord-info";
import TenantConduct from "./steps/tenant-conduct";
import TenantInfo from "./steps/tenant-info";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../guarantor/SkeletonLoader";
export default function LandlordReferenceForm({
  applicationData,
  loading
}: {
  applicationData: any;
  loading: boolean;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const {
    mutate: createLandlordReference,
    isPending: isCreatingLandlordReference
  } = useCreateLandlordReference();
  const applicationId = applicationData?.id;
  
  // Helper function to extract state name (handles both object and string)
  const getStateName = (state: any): string => {
    if (!state) return "";
    if (typeof state === "string") return state;
    if (typeof state === "object" && state?.name) return state.name;
    if (typeof state === "object" && state?.id) return state.id;
    return "";
  };

  // Build address from properties or residentialInfo
  const buildAddress = () => {
    // Try properties first (current property)
    const propAddress = applicationData?.properties?.address;
    const propCity = applicationData?.properties?.city;
    const propState = getStateName(applicationData?.properties?.state);
    const propCountry = applicationData?.properties?.country;
    
    // Try residentialInfo as fallback (previous address)
    const resAddress = applicationData?.residentialInfo?.address;
    const resCity = applicationData?.residentialInfo?.city;
    const resState = getStateName(applicationData?.residentialInfo?.state);
    const resCountry = applicationData?.residentialInfo?.country;
    
    // Build address parts, filtering out empty values
    const addressParts = [
      propAddress || resAddress,
      propCity || resCity,
      propState || resState,
      propCountry || resCountry
    ].filter(Boolean);
    
    return addressParts.join(", ") || "";
  };

  const [formData, setFormData] = useState({
    // Tenant Information
    tenantName: "",
    currentAddress: buildAddress(),
    monthlyRent: "",
    rentalStartDate: "",
    rentalEndDate: "",
    reasonForLeaving: applicationData?.residentialInfo?.reasonForLeaving || "",

    // Landlord Information
    landlordName: "",
    contactNumber: "",
    emailAddress: "",

    // Tenant Conduct & Payment History
    rentOnTime: null,
    rentOnTimeDetails: "",
    rentArrears: null,
    rentArrearsDetails: "",
    propertyCondition: null,
    propertyConditionDetails: "",
    complaints: null,
    complaintsDetails: "",
    endCondition: null,
    endConditionDetails: "",
    rentAgain: null,
    rentAgainDetails: "",

    // Additional Comments
    additionalComments: "",

    // Signature
    signerName: "",
    signature: "",
    date: new Date().toISOString().split("T")[0] // Auto-fill with today's date
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleSubmit = () => {
    // Helper function to extract state name (handles both object and string)
    const getStateName = (state: any): string => {
      if (!state) return "";
      if (typeof state === "string") return state;
      if (typeof state === "object" && state?.name) return state.name;
      if (typeof state === "object" && state?.id) return state.id;
      return "";
    };

    // Build tenant name
    const firstName = applicationData?.personalDetails?.firstName || "";
    const lastName = applicationData?.personalDetails?.lastName || "";
    const tenantFullName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown Tenant";

    // Build address
    const buildAddressForSubmit = () => {
      const propAddress = applicationData?.properties?.address;
      const propCity = applicationData?.properties?.city;
      const propState = getStateName(applicationData?.properties?.state);
      const propCountry = applicationData?.properties?.country;
      
      const resAddress = applicationData?.residentialInfo?.address;
      const resCity = applicationData?.residentialInfo?.city;
      const resState = getStateName(applicationData?.residentialInfo?.state);
      const resCountry = applicationData?.residentialInfo?.country;
      
      const addressParts = [
        propAddress || resAddress,
        propCity || resCity,
        propState || resState,
        propCountry || resCountry
      ].filter(Boolean);
      
      return addressParts.join(", ") || formData.currentAddress;
    };

    // Group data into required categories
    const tenancyHistory = {
      tenantName: tenantFullName,
      currentAddress: buildAddressForSubmit(),
      rentAmount: formData.monthlyRent || "0", // Ensure rentAmount is not empty
      // Convert empty strings to undefined for optional date fields (Joi expects undefined, not empty string)
      rentStartDate: formData.rentalStartDate && formData.rentalStartDate.trim() !== "" 
        ? formData.rentalStartDate 
        : undefined,
      rentEndDate: formData.rentalEndDate && formData.rentalEndDate.trim() !== "" 
        ? formData.rentalEndDate 
        : undefined,
      reasonForLeaving: formData.reasonForLeaving && formData.reasonForLeaving.trim() !== "" 
        ? formData.reasonForLeaving 
        : undefined
    };

    const externalLandlord = {
      name: formData.landlordName,
      contactNumber: formData.contactNumber,
      emailAddress: formData.emailAddress
    };

    const conduct = {
      rentOnTime: formData.rentOnTime,
      rentArrears: formData.rentArrears,
      propertyCondition: formData.propertyCondition,
      propertyConditionDetails: formData.propertyConditionDetails || undefined,
      endCondition: formData.endCondition,
      rentAgain: formData.rentAgain
    };

    // Filter out empty values from each category, but keep required fields
    const cleanObject = (obj: Record<string, any>, requiredFields: string[] = []) => {
      return Object.entries(obj)
        .filter(([key, value]) => {
          if (requiredFields.includes(key)) return true;
          // Filter out empty strings and null, but keep false/0
          return value !== "" && value !== null && value !== undefined;
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    };

    const payload = {
      status: "COMPLETED",
      tenancyHistory: cleanObject(tenancyHistory, ["tenantName", "currentAddress", "rentAmount"]),
      externalLandlord: cleanObject(externalLandlord, ["name", "contactNumber", "emailAddress"]),
      conduct: cleanObject(conduct),
      additionalComments: formData.additionalComments || undefined,
      signerName: formData.signerName || undefined,
      signature: formData.signature || undefined
    };

    createLandlordReference(
      { applicationId: applicationId as string, data: payload },
      {
        onSuccess: () => {
          toast.success("Landlord reference created successfully");
          router.replace("/");
        },
        onError: (error: any) => {
          // Show the actual error message from the API
          const errorMessage = error?.response?.data?.message || 
                              error?.response?.data?.error || 
                              error?.message || 
                              "Failed to create landlord reference";
          const errorDetails = error?.response?.data?.details;
          
          if (errorDetails && Array.isArray(errorDetails)) {
            toast.error(`${errorMessage}: ${errorDetails.join(", ")}`);
          } else {
            toast.error(errorMessage);
          }
        }
      }
    );
  };

  const steps = [
    { id: 1, name: "Tenant Information" },
    { id: 2, name: "Landlord Information" },
    { id: 3, name: "Tenant Conduct" },
    { id: 4, name: "Comments & Signature" }
  ];

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
            Landlord Reference Form
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
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
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
              {/* Step 1: Tenant Information */}
              {currentStep === 1 && (
                <TenantInfo
                  formData={formData}
                  handleChange={handleChange}
                  applicationInfo={applicationData}
                />
              )}

              {/* Step 2: Landlord Information */}
              {currentStep === 2 && (
                <LandlordInfo formData={formData} handleChange={handleChange} />
              )}

              {/* Step 3: Tenant Conduct */}
              {currentStep === 3 && (
                <TenantConduct
                  formData={formData}
                  handleChange={handleChange}
                />
              )}

              {/* Step 4: Additional Comments & Signature */}
              {currentStep === 4 && (
                <AdditionalInfo
                  formData={formData}
                  handleChange={handleChange}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
        <div className="flex gap-4 justify-between mt-12">
          <Button
            onClick={goToPreviousStep}
            disabled={currentStep === 1 || isCreatingLandlordReference}
            variant="outline"
            className="flex-1 h-12 rounded-md border-[#dc0a3c] text-[#dc0a3c] bg-white hover:bg-gray-50 hover:text-[#dc0a3c] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingLandlordReference}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingLandlordReference}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
