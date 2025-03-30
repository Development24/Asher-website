import * as z from "zod"

export const guarantorDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  relationship: z.string().min(2, "Relationship is required"),
  identificationType: z.union([z.enum(["Passport", "Driving Licence", "National ID"]), z.string()]),
  identificationNo: z.string().min(1, "ID number is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  employerName: z.string().min(2, "Employer name is required"),
})

export type GuarantorDetailsFormValues = z.infer<typeof guarantorDetailsSchema> 