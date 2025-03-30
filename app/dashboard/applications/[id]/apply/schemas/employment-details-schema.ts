import * as z from "zod"

export const employmentDetailsSchema = z.object({
  employmentStatus: z.union([z.enum(["Employed", "Self-employed", "Unemployed", "Retired", "Student"]), z.string()]),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  startDate: z.string().min(1, "Start date is required"),
  zipCode: z.string().min(4, "Zip code is required"),
  monthlyOrAnualIncome: z.string().min(1, "Income is required"),
  taxCredit: z.string().optional(),
  childBenefit: z.string().optional(),
  childMaintenance: z.string().optional(),
  disabilityBenefit: z.string().optional(),
  housingBenefit: z.string().optional(),
  pension: z.string().optional(),
  employerCompany: z.string().min(2, "Employer company name is required"),
  employerEmail: z.string().email("Invalid email address"),
  employerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  positionTitle: z.string().min(2, "Position title is required"),
})

export type EmploymentDetailsFormValues = z.infer<typeof employmentDetailsSchema> 