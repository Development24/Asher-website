"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import {
  employmentDetailsSchema,
  type EmploymentDetailsFormValues
} from "./schemas/employment-details-schema";
import DatePicker from "@/app/components/DatePicker";
import { useEmployerApplication } from "@/services/application/applicationFn";
import { ApplicationData } from "@/types/applicationInterface";
import { getCachedUserCurrency, getUserCurrencyCached } from "@/lib/locationCurrency";
interface EmploymentDetailsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  applicationId?: string;
  applicationData: ApplicationData;
  continueButtonClass?: string;
  isStepCompleted: boolean;
}

export function EmploymentDetailsForm({
  onNext,
  onPrevious,
  applicationId,
  continueButtonClass,
  isStepCompleted,
  applicationData
}: EmploymentDetailsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { mutate: employerApplication, isPending } = useEmployerApplication();
  
  // Get user's preference currency (preferences override everything)
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  
  useEffect(() => {
    // Get cached currency first (faster), then fetch if needed
    const cached = getCachedUserCurrency();
    if (cached) {
      setUserCurrency(cached);
    } else {
      getUserCurrencyCached().then(setUserCurrency).catch(() => {
        setUserCurrency('USD'); // Fallback
      });
    }
  }, []);

  const form = useForm<EmploymentDetailsFormValues>({
    resolver: zodResolver(employmentDetailsSchema),
    defaultValues: {
      employmentStatus: applicationData?.employmentInfo?.employmentStatus || "Employed",
      address: applicationData?.employmentInfo?.address || "",
      city: applicationData?.employmentInfo?.city || "",
      state: applicationData?.employmentInfo?.state || "",
      country: applicationData?.employmentInfo?.country || "",
      startDate: applicationData?.employmentInfo?.startDate
        ? applicationData?.employmentInfo?.startDate.split("T")[0]
        : "",
      zipCode: applicationData?.employmentInfo?.zipCode || "",
      monthlyOrAnualIncome: applicationData?.employmentInfo?.monthlyOrAnualIncome || "",
      taxCredit: applicationData?.employmentInfo?.taxCredit || "",
      childBenefit: applicationData?.employmentInfo?.childBenefit || "",
      childMaintenance: applicationData?.employmentInfo?.childMaintenance || "",
      disabilityBenefit: applicationData?.employmentInfo?.disabilityBenefit || "",
      housingBenefit: applicationData?.employmentInfo?.housingBenefit || "",
      pension: applicationData?.employmentInfo?.pension || "",
      employerCompany: applicationData?.employmentInfo?.employerCompany || "",
      employerEmail: applicationData?.employmentInfo?.employerEmail || "",
      employerPhone: applicationData?.employmentInfo?.employerPhone || "",
      positionTitle: applicationData?.employmentInfo?.positionTitle || ""
    }
  });

  function handleSubmit() {
    const values = form.getValues();
    // updateFormData({
    //   employment: {
    //     ...values,
    //     startDate: values.startDate ? new Date(values.startDate).toISOString() : ""
    //   }
    // });
    if (isStepCompleted) {
      onNext();
      return;
    }
    const payload = {
      ...values,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : ""
    };
    employerApplication(
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">EMPLOYMENT INFORMATION</h2>

        <div className="space-y-4">
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current employment status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Self-employed">
                        Self-employed
                      </SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-4">
              <FormField
                control={form.control}
                name="employerCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employer company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter position title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>

                    <DatePicker field={field} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyOrAnualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly/Annual Income</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Enter income" {...field} className="flex-1" />
                      </FormControl>
                      <FormControl>
                        <Input 
                          value={userCurrency} 
                          disabled 
                          className="w-20 bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="text-xs text-gray-500">
                      Currency is set based on your preferences
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Employer Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employer email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employer phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Employer Address Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
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
            </div>

            {/* Additional Income Section */}
            <div className="space-y-6 mt-8">
              <h3 className="text-sm font-medium text-gray-500">
                ADDITIONAL INCOME INFORMATION
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="taxCredit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Credit</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childBenefit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child Benefit</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childMaintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child Maintenance</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disabilityBenefit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disability Benefit</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="housingBenefit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Housing Benefit</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pension</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} className="flex-1" />
                        </FormControl>
                        <FormControl>
                          <Input 
                            value={userCurrency} 
                            disabled 
                            className="w-20 bg-gray-100 cursor-not-allowed"
                            readOnly
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
            />
          </div>
            </div>
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
