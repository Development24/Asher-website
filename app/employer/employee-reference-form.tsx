"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateEmployeeReference } from "@/services/refrences/referenceFn";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Decleration from "./steps/decleration";
import EmployeeDetails from "./steps/employee-details";
import EmployeeInfo from "./steps/employee-info";
import EmployerInfo from "./steps/employer-info";
import Performance from "./steps/performance";
import { toast } from "sonner";
const steps = [
  { id: 1, name: "Employee Information" },
  { id: 2, name: "Employer Information" },
  { id: 3, name: "Employment Details" },
  { id: 4, name: "Performance & Comments" },
  { id: 5, name: "Declaration & Signature" }
];
export default function EmployeeReferenceForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { id: applicationId } = useParams();
  const {
    mutate: createEmployeeReference,
    isPending: isCreatingEmployeeReference
  } = useCreateEmployeeReference();
  const [formData, setFormData] = useState({
    // Employee Information
    employeeName: "",
    jobTitle: "",
    department: "",
    employmentStartDate: "",
    employmentEndDate: "",
    reasonForLeaving: "",

    // Employer Information
    companyName: "",
    refereeName: "",
    refereePosition: "",
    contactNumber: "",
    emailAddress: "",

    // Employment Details
    employmentType: "",
    mainResponsibilities: "",

    // Performance Ratings
    workPerformance: "",
    punctualityAttendance: "",
    reliabilityProfessionalism: "",
    teamworkInterpersonal: "",

    // Re-employment
    wouldReemploy: null,
    reemployDetails: "",

    // Additional Comments
    additionalComments: "",

    // Declaration
    declarationConfirmed: false,

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
    const payload = {
      employeeName: formData.employeeName || "John Doe",
      jobTitle: formData.jobTitle || "Software Engineer",
      department: formData.department || "Engineering",
      employmentStartDate: formData.employmentStartDate || "2023-01-01",
      employmentEndDate: formData.employmentEndDate || "2023-12-31",
      reasonForLeaving: formData.reasonForLeaving || "Career growth",
      companyName: formData.companyName || "Tech Corp Ltd",
      refereeName: formData.refereeName || "Jane Smith",
      refereePosition: formData.refereePosition || "Engineering Manager",
      contactNumber: formData.contactNumber || "+44 7911 000000",
      emailAddress: formData.emailAddress || "referee@company.com",
      employmentType: formData.employmentType || "Full-Time",
      mainResponsibilities:
        formData.mainResponsibilities ||
        "Software development and system design",
      workPerformance: Number(formData.workPerformance) || 4,
      punctualityAttendance: Number(formData.punctualityAttendance) || 4,
      reliabilityProfessionalism:
        Number(formData.reliabilityProfessionalism) || 4,
      teamworkInterpersonal: Number(formData.teamworkInterpersonal) || 4,
      wouldReemploy: formData.wouldReemploy ?? true,
      reemployDetails:
        formData.reemployDetails || "Strong performer, would rehire",
      additionalComments: formData.additionalComments || "Valuable team member",
      declarationConfirmed: formData.declarationConfirmed ?? true,
      signerName: formData.signerName || "Referee Name",
      signature: formData.signature || "referee-signature-2023",
      date:
        new Date(formData.date).toISOString().split("T")[0] ||
        new Date().toISOString().split("T")[0]
    };

    console.log("Form submitted:", payload);
    createEmployeeReference(
      {
        applicationId: applicationId as string,
        data: payload
      },
      {
        onSuccess: () => {
          toast.success("Employee reference created successfully");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to create employee reference");
        }
      }
    );
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
            Employee Reference Form
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
            {/* Step 1: Employee Information */}
            {currentStep === 1 && (
              <EmployeeInfo formData={formData} handleChange={handleChange} />
            )}

            {/* Step 2: Employer Information */}
            {currentStep === 2 && (
              <EmployerInfo formData={formData} handleChange={handleChange} />
            )}

            {/* Step 3: Employment Details */}
            {currentStep === 3 && (
              <EmployeeDetails
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {/* Step 4: Performance & Comments */}
            {currentStep === 4 && (
              <Performance formData={formData} handleChange={handleChange} />
            )}

            {/* Step 5: Declaration & Signature */}
            {currentStep === 5 && (
              <Decleration formData={formData} handleChange={handleChange} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 gap-4">
          <Button
            onClick={goToPreviousStep}
            disabled={currentStep === 1 || isCreatingEmployeeReference}
            variant="outline"
            className="flex-1 h-12 rounded-md border-[#dc0a3c] text-[#dc0a3c] bg-white hover:bg-gray-50 hover:text-[#dc0a3c] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={goToNextStep}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingEmployeeReference}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
              loading={isCreatingEmployeeReference}
              disabled={!formData.declarationConfirmed}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
