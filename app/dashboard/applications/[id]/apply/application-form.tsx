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
import { useCompleteApplication } from "@/services/application/applicationFn";
import { useCreatePayment } from "@/services/finance/financeFn";
import DepositComponent from "../../components/stripe-comp/DepositComponent";
import { loadStripe } from "@stripe/stripe-js";
import { LoadingStates } from '@/components/ui/loading-states';

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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  customer: string;
  status: string;
  client_secret: string;
  transactionDetails?: Record<string, any>;
}

interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  customer: string;
  status: string;
  client_secret: string;
}

interface TransactionDetails {
  [key: string]: any;
}

interface IntialPaymentResInterface {
  paymentDetails: PaymentDetails;
  transactionDetails: TransactionDetails;
}

interface ApplicationFormProps {
  onShowPaymentModal: (paymentResponse: IntialPaymentResInterface) => void;
  propertyId: string;
  applicationData: ApplicationData;
  isApplicationFetching: boolean;
  applicationId?: string;
  refetch: () => void;
}

export function ApplicationForm({
  onShowPaymentModal,
  propertyId,
  applicationData,
  applicationId,
  isApplicationFetching,
  refetch
}: ApplicationFormProps) {
  const lastCompletedStep = applicationData?.lastStep;
  const lastStepInfo = steps.find(
    (step) => step.lastStep === lastCompletedStep
  );
  const nextStepInfo = steps.find(
    (step) => step.lastStep === lastStepInfo?.nextStep
  );
  const arrayLastStep = steps[steps.length - 1];
  const completedSteps = applicationData?.completedSteps;
  // Initialize with a default value
  const [currentStep, setCurrentStep] = useState(1);

  // Update currentStep when applicationData is available
  useEffect(() => {
    if (lastCompletedStep && nextStepInfo) {
      setCurrentStep(nextStepInfo.id);
    }
  }, [lastCompletedStep, nextStepInfo]);


  // Get the component for the current step
  const CurrentStepComponent = steps.find(
    (step) => step.id === currentStep
  )?.component;

  const isStepCompleted = (stepLastStep: string) => {
    return applicationData?.completedSteps?.includes(stepLastStep);
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { formData, updateFormData } = useApplicationFormStore();
  const router = useRouter();
  const [lastStep, setLastStep] = useState("");
  const { mutate: completeApplication, isPending } = useCompleteApplication();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const { mutate: createPayment, isPending: isCreatePaymentPending } =
    useCreatePayment();
  const handleAmountSubmit = (amount: number, currency: string) => {
    createPayment(
      {
        amount,
        paymentGateway: "STRIPE",
        payment_method_types: "card",
        currency
      },
      {
        onSuccess: (data) => {
          const response = data as IntialPaymentResInterface;
          const { paymentDetails } = response;
          setClientSecret(paymentDetails?.client_secret);
          setShowPaymentModal(true);
          refetch();
        },
        onError: (error) => {
          console.error("Payment creation failed:", error);
          // You could show a toast notification here
        }
      }
    );
  };
  const hasApplicationFee = applicationData?.applicationFee === "Yes";

  // Track which steps have been submitted
  const [submittedSteps, setSubmittedSteps] = useState<number[]>([]);

  // Update submittedSteps when applicationData changes
  useEffect(() => {
    if (lastCompletedStep) {
      const lastCompletedIndex = steps.findIndex(
        (s) => s.lastStep === lastCompletedStep
      );
      if (lastCompletedIndex !== -1) {
        const completedStepIds = steps
          .slice(0, lastCompletedIndex + 1)
          .map((step) => step.id);
        setSubmittedSteps(completedStepIds);
      }
    }
  }, [lastCompletedStep]);

  // Handle step complete
  const handleStepComplete = () => {
    const currentStepInfo = steps.find((step) => step.id === currentStep);
    const isComplete = currentStepInfo?.nextStep === null;

    // Add current step to submitted steps if not already there
    if (!submittedSteps.includes(currentStep)) {
      setSubmittedSteps((prev) => [...prev, currentStep]);
    }

    // Show payment modal if current step is the last step
    if (
      arrayLastStep.id === currentStep &&
      hasApplicationFee
    ) {
      // TODO: Get these values from the backend response
      // For now, using default values
      const applicationFee = 2000; // $20.00 in cents
      const currency = applicationData?.properties?.currency || "USD";
      handleAmountSubmit(applicationFee, currency);
      return;
    }

    // Move to next step
    const nextStepInfo = steps.find(
      (step) => step.lastStep === currentStepInfo?.nextStep
    );
    if (nextStepInfo !== undefined) {
      refetch();
      setCurrentStep(nextStepInfo.id);
    }

    if (nextStepInfo === undefined && isComplete) {
      completeApplication(String(applicationId), {
        onSuccess: (data: any) => {
          router.replace(
            `/dashboard/applications/${data?.id}/${data?.status?.toLowerCase()}`
          );
        }
      });
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    updateFormData({ propertyId }); // Ensure propertyId is saved with the form data
    router.push("/dashboard/applications");
  };

  // Previous step
  const handlePreviousStep = () => {
    // Find current step info
    const currentStepInfo = steps.find((step) => step.id === currentStep);

    if (!currentStepInfo || !currentStepInfo.previousStep) {
      // If we're at the first step or something's wrong, stay at step 1
      setCurrentStep(1);
      return;
    }

    // Find and set the previous step
    const prevStepInfo = steps.find(
      (step) => step.lastStep === currentStepInfo.previousStep
    );
    if (prevStepInfo) {
      setCurrentStep(prevStepInfo.id);
    }
    // refetch();
  };

  // Loading state
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
        <LoadingStates.Form />
      </div>
    );
  }

  // Application form
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
                    isStepCompleted(step.lastStep)
                      ? "bg-green-500"
                      : "bg-gray-200"
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
              loading={isPending}
              onPrevious={handlePreviousStep}
              continueButtonClass="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white"
              showContinueButton={
                !!steps.find((step) => step.id === currentStep)?.nextStep
              }
              showPreviousButton={currentStep !== 1}
              applicationData={applicationData}
              isStepCompleted={isStepCompleted(
                steps.find((step) => step.id === currentStep)?.lastStep || ""
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {showPaymentModal && (
        <DepositComponent
          stripePromise={stripePromise}
          opened={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          clientSecret={clientSecret}
          amount={2000}
          currency={applicationData?.properties?.currency || "USD"}
          onPaymentSuccess={() => {
            // Handle successful payment
            // You could show a success message or redirect
            router.push("/dashboard/applications/payment-success");
            refetch();
          }}
          onPaymentError={(error) => {
            console.error("Payment failed:", error);
            // You could show an error message
          }}
        />
      
      )}
    </div>
  );
}
