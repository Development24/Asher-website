"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  documentsSchema,
  type DocumentsFormValues
} from "./schemas/documents-schema";
import React from "react";
import { useDocumentsApplication } from "@/services/application/applicationFn";
import {
  useUploadFiles,
  useUploadRawFiles
} from "@/services/general/generalFn";
import { useRouter } from "next/navigation";
import { ApplicationData } from "@/types/applicationInterface";
import { useReuseAbleStore } from "@/store/reuseAble";
interface DocumentsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationId: string;
  continueButtonClass: string;
  isStepCompleted: boolean;
  applicationData: ApplicationData;
}



export function DocumentsForm({
  onNext,
  onPrevious,
  applicationId,
  continueButtonClass,
  isStepCompleted,
  applicationData
}: DocumentsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: documentsApplication, isPending } = useDocumentsApplication();
  const { setApplicationId } = useReuseAbleStore((state: any) => state);

  const { mutateAsync: uploadFiles, isPending: uploadFilesPend } =
    useUploadRawFiles(true);
  const router = useRouter();
  const form = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      idDocument: applicationData?.documents?.[0]?.documentUrl
        ? new File([], applicationData?.documents?.[0]?.documentUrl, {
            type: applicationData?.documents?.[0]?.type
          })
        : null,
      bankStatements: applicationData?.documents?.[1]?.documentUrl
        ? new File([], applicationData?.documents?.[1]?.documentUrl, {
            type: applicationData?.documents?.[1]?.type
          })
        : null,
      proofOfIncome: applicationData?.documents?.[2]?.documentUrl
        ? new File([], applicationData?.documents?.[2]?.documentUrl, {
            type: applicationData?.documents?.[2]?.type
          })
        : null,
      proofOfAddress: applicationData?.documents?.[3]?.documentUrl
        ? new File([], applicationData?.documents?.[3]?.documentUrl, {
            type: applicationData?.documents?.[3]?.type
          })
        : null,
      proofOfBenefits: applicationData?.documents?.[4]?.documentUrl
        ? new File([], applicationData?.documents?.[4]?.documentUrl, {
            type: applicationData?.documents?.[4]?.type
          })
        : null
    }
  });

  async function onSubmit(values: DocumentsFormValues) {
    // try {
    //   // Create array of document payloads
    //   const documents = Object.entries(values)
    //     .filter(([_, file]) => file !== null)
    //     .map(([fieldName, file]) => ({
    //       documentName: fieldName,
    //       type: file?.type || '',
    //       size: file?.size.toString() || '',
    //       files: file as File,
    //       applicantId: applicationId
    //     }));

    //   // Update form data
    //   // updateFormData({ documents });

    //   // Prepare payload for API
    //   const payload = {
    //     applicationId,
    //     data: documents
    //   };
    //   console.log(payload);


    //   // Submit to your application API
    //   documentsApplication(payload, {
    //     onSuccess: () => {
    //       onNext();
    //     }
    //   });
      
    // } catch (error) {
    //   console.error('Error submitting documents:', error);
    //   // Handle error (show toast, etc.)
    // }

    try {
      // Create FormData object
      if (isStepCompleted) {
        onNext();
        return;
      }
      const formData = new FormData();
      // formData.append("applicationId", applicationId);

      // Append each document with its metadata
      Object.entries(values)
        .filter(([_, file]) => file !== null)
        .forEach(([fieldName, file]) => {
          formData.append(`documentName`, fieldName);
          formData.append(`type`, file?.type || "");
          formData.append(`size`, file?.size?.toString() || "");
          formData.append(`files`, file as File);
        });

      console.log(formData);
      // Send the formData
      documentsApplication({
        applicationId: String(applicationId),
        data: formData
      }, {
        onSuccess: (data: any) => {
        onNext();
        }
      });
    } catch (error) {
      console.error("Error submitting documents:", error);
      // Handle error (show toast, etc.)
    }
  }


  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs
      Object.values(form.getValues()).forEach((file) => {
        if (file && (file as File).type) {
          URL.revokeObjectURL(URL.createObjectURL(file as File));
        }
      });
    };
  }, []);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">REQUIRED DOCUMENTS</h2>
          <div className="space-y-6">
            <UploadBox
              name="idDocument"
              label="Photographic ID (Passport or Driving licence)"
              form={form}
            />

            <UploadBox
              name="bankStatements"
              label="Two most recent monthly Bank Statements (These cannot be screenshots)"
              form={form}
            />

            <UploadBox
              name="proofOfIncome"
              label="Proof of income (e.g. Two months' pay slips, copies of accounts, end of year accounts)"
              form={form}
            />

            <UploadBox
              name="proofOfBenefits"
              label="Proof of benefits (If applicable)"
              required={false}
              form={form}
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit" disabled={isPending} loading={isPending} className={continueButtonClass}>Continue</Button>
        </div>
      </form>
    </Form>
  );
}

export const UploadBox = ({
  name,
  label,
  required = true,
  form
}: {
  name: keyof DocumentsFormValues | any;
  label: string;
  required?: boolean;
  form: UseFormReturn<any>;
}) => {
  const { field, fieldState } = useController({
    name,
    control: form.control
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors",
                fieldState.error ? "border-red-500" : "border-gray-200"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  id={name}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  {...field}
                />
                <label
                  htmlFor={name}
                  className="flex flex-col items-center gap-2 cursor-pointer w-full text-center"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  {value ? (
                    <span className="text-sm text-gray-600">
                      {(value as File).name}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-medium">
                        Drag and drop or upload document
                      </span>
                      <span className="text-xs text-gray-500">
                        Accepted formats: Word, PDF
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};