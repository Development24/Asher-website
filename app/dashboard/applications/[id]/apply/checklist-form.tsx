"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  checklistSchema,
  type ChecklistFormValues
} from "./schemas/checklist-schema";
import { ApplicationData } from "@/types/applicationInterface";
import { useCompleteApplication } from "@/services/application/applicationFn";
interface ChecklistFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationData: ApplicationData;
  continueButtonClass: string;
  isStepCompleted: boolean;
  loading: boolean;
}

export function ChecklistForm({
  onNext,
  onPrevious,
  applicationData,
  continueButtonClass,
  isStepCompleted,
  loading
}: ChecklistFormProps) {
  const { formData } = useApplicationFormStore();
  // const { mutate: completeApplication, isPending } = useCompleteApplication();
  // Function to check if a section is complete
  const isComplete = {
    personalDetails: () =>
      applicationData?.personalDetails?.firstName &&
      applicationData?.personalDetails?.lastName &&
      applicationData?.personalDetails?.email &&
      applicationData?.personalDetails?.phoneNumber,
    contactInfo: () =>
      applicationData?.residentialInfo?.address &&
      applicationData?.residentialInfo?.city &&
      applicationData?.residentialInfo?.country,
    employment: () =>
      applicationData?.employmentInfo?.employerCompany &&
      applicationData?.employmentInfo?.employmentStatus,
    currentAddress: () =>
      applicationData?.residentialInfo?.address &&
      applicationData?.residentialInfo?.addressStatus,
    prevAddresses: () =>
      applicationData?.residentialInfo?.prevAddresses?.length > 0,
    incomeDetails: () => applicationData?.employmentInfo?.monthlyOrAnualIncome,
    documents: () =>
      applicationData?.documents?.[0]?.documentUrl ||
      applicationData?.documents?.[1]?.documentUrl ||
      applicationData?.documents?.[2]?.documentUrl,
    identification: () =>
      applicationData?.guarantorInformation?.identificationType &&
      applicationData?.guarantorInformation?.identificationNo,
    references: () =>
      applicationData?.referee?.professionalReferenceName &&
      applicationData?.referee?.personalReferenceName,
    guarantor: () => applicationData?.guarantorInformation?.fullName,
    declaration: () => applicationData?.declaration?.[0]?.declaration
  };

  const checklistItems = [
    { text: "Personal details completed", check: isComplete.personalDetails() },
    { text: "Contact information provided", check: isComplete.contactInfo() },
    { text: "Employment history verified", check: isComplete.employment() },
    { text: "Current address confirmed", check: isComplete.currentAddress() },
    { text: "Previous addresses listed", check: isComplete.prevAddresses() },
    { text: "Income details provided", check: isComplete.incomeDetails() },
    { text: "Required documents uploaded", check: isComplete.documents() },
    { text: "Proof of ID submitted", check: isComplete.identification() },
    { text: "References provided", check: isComplete.references() },
    { text: "Guarantor details verified", check: isComplete.guarantor() },
    { text: "Declaration signed", check: isComplete.declaration() }
  ];

  const completedItems = checklistItems.filter((item) => item.check).length;
  const totalItems = checklistItems.length;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-2">APPLICATION PROGRESS</h2>
        <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
          <div
            className="h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center
                ${item.check ? "bg-green-500" : "bg-gray-200"}`}
              >
                {item.check && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className={item.check ? "text-gray-900" : "text-gray-500"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={loading}
        >
          Previous
        </Button>
        <Button type="button" onClick={onNext} className={continueButtonClass} disabled={loading}>
          {loading ? "Submitting..." : "Complete Application"}
        </Button>
      </div>
    </div>
  );
}
