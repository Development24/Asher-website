"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  guarantorDetailsSchema,
  type GuarantorDetailsFormValues
} from "./schemas/guarantor-details-schema";
import { useGuarantorApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { useReuseAbleStore } from "@/store/reuseAble";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
interface GuarantorDetailsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationId: string;
  continueButtonClass: string;
  isStepCompleted: boolean;
  applicationData: ApplicationData;
}

export function GuarantorDetailsForm({
  onNext,
  onPrevious,
  applicationId,
  continueButtonClass,
  isStepCompleted,
  applicationData
}: GuarantorDetailsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: guarantorApplication, isPending } = useGuarantorApplication();
  const form = useForm<GuarantorDetailsFormValues>({
    resolver: zodResolver(guarantorDetailsSchema),
    defaultValues: {
      fullName: applicationData?.guarantorInformation?.fullName || "",
      phoneNumber: applicationData?.guarantorInformation?.phoneNumber || "",
      email: applicationData?.guarantorInformation?.email || "",
      address: applicationData?.guarantorInformation?.address || "",
      relationship: applicationData?.guarantorInformation?.relationship || "",
      // identificationType:
      //   applicationData?.guarantorInformation?.identificationType || "",
      // identificationNo:
      //   applicationData?.guarantorInformation?.identificationNo || "",
      // monthlyIncome: applicationData?.guarantorInformation?.monthlyIncome || "",
      employerName: applicationData?.guarantorInformation?.employerName || ""
    }
  });

  function handleSubmit() {
    const values = form.getValues();
    if (isStepCompleted) {
      onNext();
      return;
    }
    // const guarantorData = {
    //   guarantor: {
    //     fullName: values.fullName,
    //     phoneNumber: values.phoneNumber,
    //     email: values.email,
    //     address: values.address,
    //     relationship: values.relationship,
    //     identificationType: values.identificationType,
    //     identificationNo: values.identificationNo,
    //     monthlyIncome: values.monthlyIncome,
    //     employerName: values.employerName
    //   }
    // };

    // updateFormData(guarantorData);
    guarantorApplication(
      {
        applicationId: applicationId,
        data: {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          address: values.address,
          relationship: values.relationship,
          // identificationType: values.identificationType,
          // identificationNo: values.identificationNo,
          // monthlyIncome: values.monthlyIncome,
          employerName: values.employerName
        }
      },
      {
        onSuccess: (data: any) => {
          onNext();
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">GUARANTOR INFORMATION</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter guarantor's full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter relationship to applicant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="identificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Driving Licence">
                        Driving Licence
                      </SelectItem>
                      <SelectItem value="National ID">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* <FormField
              control={form.control}
              name="identificationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ID number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="employerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter monthly income" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
