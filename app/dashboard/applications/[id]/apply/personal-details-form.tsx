"use client";

import DatePicker from "@/app/components/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useStartApplication } from "@/services/application/applicationFn";
import { useReuseAbleStore } from "@/store/reuseAble";
import { useApplicationFormStore } from "@/store/useApplicationFormStore";
import { ApplicationData } from "@/types/applicationInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  personalDetailsSchema,
  type PersonalDetailsFormValues
} from "./schemas/personal-details-schema";
interface PersonalDetailsFormProps {
  params: {
    id: string;
  };
  onNext: () => void;
  continueButtonClass?: string;
  applicationData: ApplicationData;
  isStepCompleted: boolean;
}

export function PersonalDetailsForm({
  params,
  onNext,
  continueButtonClass,
  applicationData,
  isStepCompleted
}: PersonalDetailsFormProps) {
  const { formData, updateFormData } = useApplicationFormStore();
  const { id } = useParams();
  const searchParams = useSearchParams();
  // const applicationInvitedId = searchParams.get("applicationId");
  // console.log(id);
  const applicationInvitedId = useReuseAbleStore((state) => state.applicationInvitedId);

  const { mutate: startApplication, isPending } = useStartApplication();
  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      title: applicationData?.personalDetails?.title as
        | "Mr."
        | "Mrs."
        | "Miss"
        | "Dr."
        | undefined,
      firstName: applicationData?.personalDetails?.firstName,
      middleName: applicationData?.personalDetails?.middleName,
      lastName: applicationData?.personalDetails?.lastName,
      dob: applicationData?.personalDetails?.dob
        ? applicationData?.personalDetails?.dob.split("T")[0]
        : "",
      invited: applicationData?.invited,
      email: applicationData?.personalDetails?.email,
      phoneNumber: applicationData?.personalDetails?.phoneNumber,
      maritalStatus: applicationData?.personalDetails?.maritalStatus as
        | "Single"
        | "Married"
        | "Divorced"
        | "Separated"
        | undefined,
      nationality: applicationData?.personalDetails?.nationality,
      identificationType: applicationData?.personalDetails
        ?.identificationType as
        | "passport"
        | "driving licence"
        | "national id"
        | undefined,
      identificationNo:
        (applicationData?.personalDetails?.identificationNo as string | null) ||
        "",
      issuingAuthority: applicationData?.personalDetails?.issuingAuthority,
      expiryDate: applicationData?.personalDetails?.expiryDate
        ? applicationData?.personalDetails?.expiryDate.split("T")[0]
        : "",
      nextOfKin: applicationData?.personalDetails?.nextOfKin?.length > 0 ? applicationData?.personalDetails?.nextOfKin : [{
        firstName: "",
        middleName: "",
        lastName: "",
        relationship: "",
        email: "",
        phoneNumber: ""
      }]
    }
  });

  const { setApplicationId } = useReuseAbleStore();
  console.log(form.formState.errors);
  console.log(isStepCompleted);

  function onSubmit(values: PersonalDetailsFormValues) {
    // const isStepCompleted =
    //   applicationData?.completedSteps?.includes("PERSONAL_KIN");

    if (isStepCompleted) {
      // If step is already completed, just move to next step
      console.log("Step already completed, skipping submission");
      onNext();
      return;
    }

    // If not completed, proceed with submission
    const payload = {
      ...values,
      dob: values.dob ? new Date(values.dob).toISOString() : "",
      expiryDate: values.expiryDate
        ? new Date(values.expiryDate).toISOString()
        : "",
      nextOfKin: values.nextOfKin[0],
      applicationInviteId: applicationInvitedId
    };

    startApplication(
      {
        propertyId: id as string,
        data: payload
      },
      {
        onSuccess: (data: any) => {
          // updateFormData({
          //   ...formData,
          //   applicationId: data?.application?.id
          // });
          setApplicationId(data?.application?.id);
          onNext();
        },
        onError: (err: any) => {
          console.log(err?.response?.data?.message);
          // if (
          //   err?.response?.data?.message.includes(
          //     "You have already applied for this property in the last 3 months"
          //   )
          // ) {
          //   onNext();
          // }
          toast.error(err?.response?.data?.message);
        }
      }
    );
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nextOfKin",
    rules: {
      minLength: {
        value: 1,
        message: "At least one next of kin is required"
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">BASIC INFORMATION</h2>

          {/* Full Name Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Date of Birth Section */}
          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <DatePicker field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Identification Section */}
          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="Nationality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Details</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ID Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving licence">
                          Driving Licence
                        </SelectItem>
                        <SelectItem value="national id">National ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identificationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuingAuthority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Authority</FormLabel>
                  <FormControl>
                    <Input placeholder="Issuing Authority" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Expiry Date</FormLabel>
                  <DatePicker field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
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
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Marital Information Section */}
          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital information</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Next of Kin Information Section */}
          <div className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Next of Kin Information</h3>
              {fields.length < 3 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    relationship: "",
                    email: "",
                    phoneNumber: ""
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Next of Kin
              </Button>
            )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Next of Kin #{index + 1}</h4>
                  {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.middleName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Relationship" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`nextOfKin.${index}.phoneNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="invited"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invited</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select invited" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">Yes</SelectItem>
                        <SelectItem value="NO">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className={continueButtonClass}
            disabled={isPending}
            loading={isPending}
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
