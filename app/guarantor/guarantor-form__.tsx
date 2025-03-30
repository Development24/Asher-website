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
import { PersonalInfoStep } from "./components/steps/personal-info-step";
import { EmploymentStep } from "./components/steps/employment-step";
import { DocumentUploadStep } from "./components/steps/document-upload-step";
import { useToast } from "@/components/ui/use-toast";

export default function GuarantorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState({
    addressProof: null,
    incomeProof: null,
    additionalDocs: []
  });
  const { toast } = useToast();

  const idInputRef = useRef(null);
  const addressProofInputRef = useRef(null);
  const incomeProofInputRef = useRef(null);
  const additionalDocsInputRef = useRef(null);

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

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    console.log(`Field ${field} updated:`, value);
  };

  const handleDocumentUpload = (type: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { file }
    }));
    console.log(`Document ${type} uploaded:`, file);
  };

  const handleDocumentRemove = (type: string, index?: number) => {
    setDocuments((prev) => {
      if (type === "additionalDocs") {
        const newDocs = [...prev.additionalDocs];
        newDocs.splice(index!, 1);
        return { ...prev, additionalDocs: newDocs };
      }
      return { ...prev, [type]: null };
    });
    console.log(`Document ${type} removed`, index);
  };

  const handleSubmit = async () => {
    console.log("Form submission started");
    console.log("Form Data:", formData);
    console.log("Documents:", documents);

    try {
      // Add your submission logic here
      toast({
        title: "Success",
        description: "Guarantor form submitted successfully"
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep formData={formData} onChange={handleFormChange} />
        );
      case 2:
        return (
          <EmploymentStep formData={formData} onChange={handleFormChange} />
        );
      case 3:
        return (
          <DocumentUploadStep
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onDocumentRemove={handleDocumentRemove}
          />
        );
      // Add other steps
      default:
        return null;
    }
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
            {renderStep()}
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
