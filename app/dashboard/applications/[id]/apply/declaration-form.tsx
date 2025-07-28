"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  declarationSchema,
  type DeclarationFormValues
} from "./schemas/declaration-schema";
import DatePicker from "@/app/components/DatePicker";
import { useDeclarationApplication } from "@/services/application/applicationFn";
import { IApplicationInterface } from "@/types/application-form";
import { UploadBox } from "./documents-form";
import { FileUploadBox } from "./uploadDocs";
import { ApplicationData } from "@/types/applicationInterface";
import { useReuseAbleStore } from "@/store/reuseAble";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
interface DeclarationFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationId: string;
  applicationData: ApplicationData;
  continueButtonClass: string;
  isStepCompleted: boolean;
}

export function DeclarationForm({
  onNext,
  onPrevious,
  applicationId,
  applicationData,
  continueButtonClass,
  isStepCompleted
}: DeclarationFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: declarationApplication, isPending } =
    useDeclarationApplication();

  const form = useForm<DeclarationFormValues>({
    resolver: zodResolver(declarationSchema),
    defaultValues: {
      declaration: !!applicationData?.declaration?.[0]?.declaration || false,
      signature:
        applicationData?.personalDetails?.firstName +
          " " +
          applicationData?.personalDetails?.lastName || "",
      date: applicationData?.declaration?.[0]?.date
        ? new Date(applicationData?.declaration?.[0]?.date)?.toISOString()
        : new Date().toISOString(),
      additionalNotes: applicationData?.declaration?.[0]?.additionalNotes || "",
      files: applicationData?.declaration?.[0]?.signature || ""
    }
  });

  function onSubmit(values: DeclarationFormValues) {
    // updateFormData({
    //   ...values,
    //   date: values.date ? new Date(values.date).toISOString() : ""
    // });
    if (isStepCompleted) {
      onNext();
      return;
    }
    const payload = {
      applicationId: applicationId,
      data: {
        declaration:
          applicationData?.personalDetails?.firstName +
          " " +
          applicationData?.personalDetails?.lastName,
        date: values.date ? new Date(values.date).toISOString() : "",
        additionalNotes: values.additionalNotes,
        files: values.files,
        // signature: values.files
        // signature: applicationData?.personalDetails?.firstName + " " + applicationData?.personalDetails?.lastName
      }
    };
    declarationApplication(payload, {
      onSuccess: (data: any) => {
        onNext();
      },
      onError: (error: any) => {
        console.error("Declaration form submission error:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">DECLARATION</h2>
          <div className="space-y-6">
            <div className="text-sm space-y-4">
              <p>I hereby declare that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All information provided in this application is true and
                  accurate
                </li>
                <li>
                  I understand that providing false information may result in
                  rejection
                </li>
                <li>I authorize the necessary credit and reference checks</li>
                <li>I agree to the terms and conditions of the application</li>
              </ul>
            </div>

            <FormField
              control={form.control}
              name="declaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    I agree to the above declaration
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Signature</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <DatePicker field={field} />
                </FormItem>
              )}
            />

            <FileUploadBox name="files" label="Declaration Form" form={form} />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information you'd like to provide"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isPending}
          >
            Previous
          </Button>
          <LoadingButton
            type="submit"
            disabled={!form.formState.isValid}
            loading={isPending}
            className={continueButtonClass}
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
