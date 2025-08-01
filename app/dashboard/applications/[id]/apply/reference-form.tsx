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
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  referenceDetailsSchema,
  type ReferenceDetailsFormValues
} from "./schemas/reference-details-schema";
import { useRefereesApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
interface ReferenceFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationData?: ApplicationData;
  applicationId?: string;
  isStepCompleted: boolean;
  continueButtonClass: string;
}

export function ReferenceForm({
  onNext,
  onPrevious,
  applicationData,
  applicationId,
  isStepCompleted,
  continueButtonClass
}: ReferenceFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: refereesApplication, isPending } = useRefereesApplication();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ReferenceDetailsFormValues>({
    resolver: zodResolver(referenceDetailsSchema),
    defaultValues: {
      professionalReferenceName:
        applicationData?.referee?.professionalReferenceName || "",
      personalReferenceName:
        applicationData?.referee?.personalReferenceName || "",
      personalPhoneNumber:
        applicationData?.referee?.personalPhoneNumber || "",
      professionalPhoneNumber:
        applicationData?.referee?.professionalPhoneNumber || "",
      professionalEmail: applicationData?.referee?.professionalEmail || "",
      personalEmail: applicationData?.referee?.personalEmail || "",
      personalRelationship:
        applicationData?.referee?.personalRelationship || "",
      professionalRelationship:
        applicationData?.referee?.professionalRelationship || ""
    }
  });

  function onSubmit(values: ReferenceDetailsFormValues) {
    if (isStepCompleted) {
      onNext();
      return;
    }
    const payload = {
      ...values,
      applicationId: applicationId as string
    };
    refereesApplication(
      {
        applicationId: applicationId as string,
        data: payload
      },
      {
        onSuccess: () => {
          const params = new URLSearchParams(searchParams);
          params.set("applicationId", applicationId as string);
          router.replace(`${pathname}?${params.toString()}`);
          onNext();
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-6">REFERENCE INFORMATION</h2>

          {/* Professional Reference Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Professional Reference</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="professionalReferenceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter relationship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalPhoneNumber"
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
                name="professionalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Personal Reference Section */}
          <div className="space-y-4 mt-8">
            <h3 className="text-md font-medium">Personal Reference</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personalReferenceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter relationship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalPhoneNumber"
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
                name="personalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onPrevious}>
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
