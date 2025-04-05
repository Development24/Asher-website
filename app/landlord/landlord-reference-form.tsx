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
export default function LandlordReferenceForm({ id }: { id: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const {
    mutate: createLandlordReference,
    isPending: isCreatingLandlordReference
  } = useCreateLandlordReference();
  const [formData, setFormData] = useState({
    // Tenant Information
    tenantName: "",
    currentAddress: "",
    monthlyRent: "",
    rentalStartDate: "",
    rentalEndDate: "",
    reasonForLeaving: "",

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
    date: ""
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
    // Group data into required categories
    const tenancyHistory = {
      tenantName: formData.tenantName,
      currentAddress: formData.currentAddress,
      rentAmount: formData.monthlyRent,
      // monthlyRent: formData.monthlyRent,
      rentStartDate: formData.rentalStartDate,
      rentEndDate: formData.rentalEndDate,
      reasonForLeaving: formData.reasonForLeaving
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
      propertyConditionDetails: formData.propertyConditionDetails,
      endCondition: formData.endCondition,
      rentAgain: formData.rentAgain
    };

    // Filter out empty values from each category
    const cleanObject = (obj: Record<string, any>) => {
      return Object.entries(obj)
        .filter(([_, value]) => value !== "" && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    };

    const payload = {
      // applicationId: applicationId as string,
      status: "COMPLETED",
      tenancyHistory: cleanObject(tenancyHistory),
      externalLandlord: cleanObject(externalLandlord),
      conduct: cleanObject(conduct),
      additionalComments: formData.additionalComments,
      signerName: formData.signerName,
      signature: formData.signature
    };

    console.log("Form submitted:", payload);
    createLandlordReference(
      { applicationId: id as string, data: payload },
      {
        onSuccess: () => {
          toast.success("Landlord reference created successfully");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to create landlord reference");
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
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
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
            {/* Step 1: Tenant Information */}
            {currentStep === 1 && (
              <TenantInfo formData={formData} handleChange={handleChange} />
            )}

            {/* Step 2: Landlord Information */}
            {currentStep === 2 && (
              <LandlordInfo formData={formData} handleChange={handleChange} />
            )}

            {/* Step 3: Tenant Conduct */}
            {currentStep === 3 && (
              <TenantConduct formData={formData} handleChange={handleChange} />
            )}

            {/* Step 4: Additional Comments & Signature */}
            {currentStep === 4 && (
              <AdditionalInfo formData={formData} handleChange={handleChange} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 gap-4">
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
