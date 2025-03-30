"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import { IApplicationInterface } from "@/types/application-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CheckSquare,
  ClipboardList,
  FileSignature,
  FileText,
  Home,
  User,
  UserPlus,
  Users
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AdditionalDetailsForm } from "./additional-details-form";
import { ChecklistForm } from "./checklist-form";
import { DeclarationForm } from "./declaration-form";
import { DocumentsForm } from "./documents-form";
import { EmploymentDetailsForm } from "./employment-details-form";
import { GuarantorDetailsForm } from "./guarantor-details-form";
import { PaymentModal } from "./payment-modal"; // Import PaymentModal from the same directory
import { PersonalDetailsForm } from "./personal-details-form";
import { ReferenceForm } from "./reference-form";
import { ResidentialDetailsForm } from "./residential-details-form";
import { ApplicationData } from "@/types/applicationInterface";

// PERSONAL_KIN
//   REFEREE
//   EMPLOYMENT
//   EMERGENCY_CONTACT
//   RESIDENTIAL_ADDRESS
//   DOCUMENT_UPLOAD
//   ADDITIONAL_INFO
//   GUARANTOR_INFO

const steps: {
  id: number;
  title: string;
  component: React.ComponentType<any>;
  icon: React.ElementType;
  lastStep: string;
  previousStep?: string | null;
  nextStep?: string | null;
}[] = [
  {
    id: 1,
    title: "Personal details",
    component: PersonalDetailsForm,
    icon: User,
    lastStep: "PERSONAL_KIN",
    nextStep: "RESIDENTIAL_ADDRESS",
    previousStep: null
  },
  {
    id: 2,
    title: "Residential details",
    component: ResidentialDetailsForm,
    icon: Home,
    lastStep: "RESIDENTIAL_ADDRESS",
    nextStep: "EMPLOYMENT",
    previousStep: "PERSONAL_KIN"
  },
  {
    id: 3,
    title: "Employment details",
    component: EmploymentDetailsForm,
    icon: Briefcase,
    lastStep: "EMPLOYMENT",
    nextStep: "ADDITIONAL_INFO",
    previousStep: "RESIDENTIAL_ADDRESS"
  },
  {
    id: 4,
    title: "Additional details",
    component: AdditionalDetailsForm,
    icon: FileText,
    lastStep: "ADDITIONAL_INFO",
    nextStep: "REFEREE",
    previousStep: "EMPLOYMENT"
  },
  {
    id: 5,
    title: "References",
    component: ReferenceForm,
    icon: Users,
    lastStep: "REFEREE",
    previousStep: "ADDITIONAL_INFO",
    nextStep: "DOCUMENT_UPLOAD"
  },
  {
    id: 6,
    title: "Required documents",
    component: DocumentsForm,
    icon: ClipboardList,
    lastStep: "DOCUMENT_UPLOAD",
    nextStep: "GUARANTOR_INFO",
    previousStep: "REFEREE"
  },
  {
    id: 7,
    title: "Guarantor details",
    component: GuarantorDetailsForm,
    icon: UserPlus,
    lastStep: "GUARANTOR_INFO",
    nextStep: "DECLARATION",
    previousStep: "DOCUMENT_UPLOAD"
  },
  {
    id: 8,
    title: "Declaration",
    component: DeclarationForm,
    icon: FileSignature,
    lastStep: "DECLARATION",
    nextStep: "CHECKLIST",
    previousStep: "GUARANTOR_INFO"
  },
  {
    id: 9,
    title: "Checklist",
    component: ChecklistForm,
    icon: CheckSquare,
    lastStep: "CHECKLIST",
    previousStep: "DECLARATION",
    nextStep: null
  }
];

interface ApplicationFormProps {
  onShowPaymentModal: () => void;
  propertyId: string;
  applicationData: ApplicationData;
  isApplicationFetching: boolean;
  applicationId?: string;
}

export function ApplicationForm({
  onShowPaymentModal,
  propertyId,
  applicationData,
  applicationId,
  isApplicationFetching
}: ApplicationFormProps) {
  const lastCompletedStep = applicationData?.lastStep;
  const lastStepInfo = steps.find((step) => step.lastStep === lastCompletedStep);
  console.log(lastStepInfo);
  const nextStepInfo = steps.find((step) => step.lastStep === lastStepInfo?.nextStep);
  const completedSteps = applicationData?.completedSteps;
  // Initialize with a default value
  const [currentStep, setCurrentStep] = useState(1);

  // Update currentStep when applicationData is available
  useEffect(() => {
    if (lastCompletedStep && nextStepInfo) {
      setCurrentStep(nextStepInfo.id);
    }
  }, [lastCompletedStep, nextStepInfo]);

  console.log({
    lastCompletedStep,
    lastStepInfo,
    nextStepInfo,
    currentStep
  });

  // Get the component for the current step
  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component;

  const isStepCompleted = (stepLastStep: string) => {
    return applicationData?.completedSteps?.includes(stepLastStep);
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { formData, updateFormData } = useApplicationFormStore();
  const router = useRouter();
  console.log(propertyId);
  const [lastStep, setLastStep] = useState("");

  console.log(applicationData);

  // Track which steps have been submitted
  const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);

  // Update submittedSteps when applicationData changes
  useEffect(() => {
    if (lastCompletedStep) {
      const lastCompletedIndex = steps.findIndex((s) => s.lastStep === lastCompletedStep);
      if (lastCompletedIndex !== -1) {
        const completedStepIds = steps
          .slice(0, lastCompletedIndex + 1)
          .map(step => step.id);
        setSubmittedSteps(completedStepIds);
      }
    }
  }, [lastCompletedStep]);

  const handleStepComplete = () => {
    const currentStepInfo = steps.find((step) => step.id === currentStep);
    
    // Add current step to submitted steps if not already there
    if (!submittedSteps.includes(currentStep)) {
      setSubmittedSteps(prev => [...prev, currentStep]);
    }

    if (!currentStepInfo?.nextStep) {
      setShowPaymentModal(true);
      return;
    }

    const nextStepInfo = steps.find((step) => step.lastStep === currentStepInfo.nextStep);
    if (nextStepInfo) {
      setCurrentStep(nextStepInfo.id);
    }
  };

  const handleSaveDraft = () => {
    updateFormData({ propertyId }); // Ensure propertyId is saved with the form data
    router.push("/dashboard/applications");
  };

  const handlePreviousStep = () => {
    // Find current step info
    const currentStepInfo = steps.find((step) => step.id === currentStep);
    
    if (!currentStepInfo || !currentStepInfo.previousStep) {
      // If we're at the first step or something's wrong, stay at step 1
      setCurrentStep(1);
      return;
    }

    // Find and set the previous step
    const prevStepInfo = steps.find((step) => step.lastStep === currentStepInfo.previousStep);
    if (prevStepInfo) {
      setCurrentStep(prevStepInfo.id);
    }
  };

  if (isApplicationFetching) {
    return (
      <div className="layout bg-white rounded-lg shadow-sm p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-64" /> 
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center mx-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-16 mt-1" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="w-full h-[600px]" /> 
      </div>
    );
  }

  return (
    <div className="layout bg-white rounded-lg shadow-sm p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tenant Application Form</h1>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center mx-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.id === currentStep
                    ? "bg-red-600 text-white"
                    : isStepCompleted(step.lastStep)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 text-center whitespace-nowrap">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full absolute left-0 top-5 -z-10 ${
                    isStepCompleted(step.lastStep) ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {CurrentStepComponent && (
            <CurrentStepComponent
              params={{ id: propertyId.toString() }}
              applicationId={applicationId}
              onNext={handleStepComplete}
              onPrevious={handlePreviousStep}
              continueButtonClass="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white"
              showContinueButton={!!steps.find((step) => step.id === currentStep)?.nextStep}
              showPreviousButton={currentStep !== 1}
              applicationData={applicationData}
              isStepCompleted={isStepCompleted(
                steps.find(step => step.id === currentStep)?.lastStep || ''
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
}
