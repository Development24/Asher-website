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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  additionalDetailsSchema,
  type AdditionalDetailsFormValues
} from "./schemas/additional-details-schema";
import { useAdditionalDetailsApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { useQueryClient } from "@tanstack/react-query";
interface AdditionalDetailsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationId?: string;
  applicationData?: ApplicationData;
  isStepCompleted: boolean;
  continueButtonClass: string;
}

export function AdditionalDetailsForm({
  onNext,
  onPrevious,
  applicationId,
  applicationData,
  isStepCompleted,
  continueButtonClass
}: AdditionalDetailsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: additionalDetailsApplication, isPending } =
    useAdditionalDetailsApplication();
  const queryClient = useQueryClient();
  const form = useForm<AdditionalDetailsFormValues>({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      pets: applicationData?.applicationQuestions?.[0]?.havePet || "",
      smoker: applicationData?.applicationQuestions?.[0]?.youSmoke || "",
      additionalOccupants:
        applicationData?.applicationQuestions?.[0]?.additionalOccupants || "",
      additionalInformation:
        applicationData?.applicationQuestions?.[0]?.additionalInformation || "",
      outstandingDebts:
        applicationData?.applicationQuestions?.[0]?.haveOutstandingDebts || "",
      requireParking:
        applicationData?.applicationQuestions?.[0]?.requireParking || ""
    }
  });

  function onSubmit(values: AdditionalDetailsFormValues) {
    // updateFormData(values);
    // const payload = {
    //   ...values,
    //   applicationId: formData.applicationId
    // };
    if (isStepCompleted) {
      onNext();
      return;
    }
    additionalDetailsApplication(
      {
        applicationId: applicationId as string,
        data: {
          havePet: values.pets,
          youSmoke: values.smoker,
          haveOutstandingDebts: values.outstandingDebts,
          additionalOccupants: values.additionalOccupants,
          additionalInformation: values.additionalInformation,
          requireParking: values.requireParking
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["singleApplication", "application", applicationId] });
          onNext();
        }
      }
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">ADDITIONAL INFORMATION</h2>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="pets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have any pets?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="YES">Yes</SelectItem>
                      <SelectItem value="NO">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smoker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Are you a smoker?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NO">No</SelectItem>
                      <SelectItem value="YES">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalOccupants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Occupants</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List names  of any additional occupants"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outstandingDebts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding Debts</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NO">No</SelectItem>
                      <SelectItem value="YES">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requireParking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you require parking?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NO">No</SelectItem>
                      <SelectItem value="YES">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
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
