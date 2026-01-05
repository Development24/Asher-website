"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useEffect } from "react"
import { Button, LoadingButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useApplicationFormStore } from "@/store/useApplicationFormStore"
import { residentialDetailsSchema, type ResidentialDetailsFormValues } from "./schemas/residential-details-schema"
import { useResidentApplication } from "@/services/application/applicationFn"
import { IApplicationInterface } from "@/types/application-form";
import { ApplicationData } from "@/types/applicationInterface"
interface ResidentialDetailsFormProps {
  onNext: () => void
  onPrevious: () => void
  params: {
    id: string;
  };
  applicationData: ApplicationData;
  isStepCompleted: boolean;
  applicationId?: string; 
  continueButtonClass?: string;
}

export function ResidentialDetailsForm({ onNext, onPrevious, params, applicationData, isStepCompleted, continueButtonClass, applicationId }: ResidentialDetailsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore()
  const { mutate: residentApplication, isPending } = useResidentApplication();
  
  // Clear any saved drafts on mount to prevent draft modal from showing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('application-form-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.savedDrafts?.length > 0) {
            // Clear saved drafts
            const updated = {
              ...parsed,
              state: {
                ...parsed.state,
                savedDrafts: []
              }
            };
            localStorage.setItem('application-form-storage', JSON.stringify(updated));
          }
        }
      } catch (error) {
        console.warn('Failed to clear drafts:', error);
      }
    }
  }, []);
  
  const form = useForm<ResidentialDetailsFormValues>({
    resolver: zodResolver(residentialDetailsSchema),
    mode: "onChange", // Validate on change to show errors immediately
    reValidateMode: "onChange", // Re-validate on change
    defaultValues: {
      address: applicationData?.residentialInfo?.address || "",
      addressStatus: applicationData?.residentialInfo?.addressStatus || "",
      city: applicationData?.residentialInfo?.city || "",
      state: applicationData?.residentialInfo?.state || "",
      country: applicationData?.residentialInfo?.country || "",
      zipCode: applicationData?.residentialInfo?.zipCode || "",
      lengthOfResidence: applicationData?.residentialInfo?.lengthOfResidence || "Years",
      landlordOrAgencyName: applicationData?.residentialInfo?.landlordOrAgencyName || "",
      landlordOrAgencyPhoneNumber: applicationData?.residentialInfo?.landlordOrAgencyPhoneNumber || "",
      landlordOrAgencyEmail: applicationData?.residentialInfo?.landlordOrAgencyEmail || "",
      reasonForLeaving: applicationData?.residentialInfo?.reasonForLeaving || "",
      prevAddresses: applicationData?.residentialInfo?.prevAddresses || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prevAddresses"
  })
  function onSubmit(values: ResidentialDetailsFormValues) {
    if (isStepCompleted) {
      onNext();
      return;
    }
    // updateFormData(values)
    const payload = {
      ...values,
    };

    residentApplication(
      {
        applicationId: applicationId as string,
        data: payload
      },
      {
        onSuccess: () => {
          onNext();
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="mb-6 text-lg font-semibold">RESIDENTIAL INFORMATION</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter current address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Status</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("addressStatus");
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rental accommodation">Rental accommodation</SelectItem>
                      <SelectItem value="Own property">Own property</SelectItem>
                      <SelectItem value="Living with family">Living with family</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lengthOfResidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length of Residence</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("lengthOfResidence");
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Months">Months</SelectItem>
                      <SelectItem value="Years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Landlord Information */}
            <FormField
              control={form.control}
              name="landlordOrAgencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord/Agency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter landlord name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landlordOrAgencyPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord/Agency Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter landlord phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="landlordOrAgencyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landlord/Agency Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter landlord email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reasonForLeaving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Leaving</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reason for leaving" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Previous Addresses */}
          <div className="mt-6">
            <h3 className="mb-4 font-semibold text-md">Previous Addresses</h3>
            {fields?.map((field: any, index: number) => (
              <div key={field.id} className="grid gap-4 mb-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`prevAddresses.${index}.address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter previous address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`prevAddresses.${index}.lengthOfResidence`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length of Stay</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter length of stay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mt-2"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ address: "", lengthOfResidence: "" })}
              className="mt-2"
            >
              <Plus className="mr-2 w-4 h-4" />
              Add Previous Address
            </Button>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onPrevious} disabled={isPending}>
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
  )
}

