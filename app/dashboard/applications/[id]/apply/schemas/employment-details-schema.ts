import * as z from "zod"

// Base schema with common fields
const baseEmploymentSchema = {
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
  // Employer fields (required only for "Employed")
  employerCompany: z.string().optional(),
  employerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  employerPhone: z.string().optional(),
  positionTitle: z.string().optional(),
  // Business fields (for "Self-employed")
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  businessPhone: z.string().optional(),
}

// Conditional schema based on employment status
export const employmentDetailsSchema = z.object(baseEmploymentSchema).refine(
  (data) => {
    // If employed, require employer fields
    if (data.employmentStatus === "Employed") {
      if (!data.employerCompany || data.employerCompany.length < 2) {
        return false;
      }
      if (!data.employerEmail || !z.string().email().safeParse(data.employerEmail).success) {
        return false;
      }
      if (!data.employerPhone || data.employerPhone.length < 10) {
        return false;
      }
      if (!data.positionTitle || data.positionTitle.length < 2) {
        return false;
      }
    }
    
    // If self-employed, require business fields
    if (data.employmentStatus === "Self-employed") {
      if (!data.businessName || data.businessName.length < 2) {
        return false;
      }
      if (!data.businessType || data.businessType.length < 2) {
        return false;
      }
    }
    
    return true;
  },
  {
    message: "Please fill in all required fields for your employment status",
    path: ["employmentStatus"], // This will show the error on the employment status field
  }
).superRefine((data, ctx) => {
  // More specific error messages for each field
  if (data.employmentStatus === "Employed") {
    if (!data.employerCompany || data.employerCompany.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Employer company name is required",
        path: ["employerCompany"],
      });
    }
    if (!data.employerEmail || !z.string().email().safeParse(data.employerEmail).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid employer email is required",
        path: ["employerEmail"],
      });
    }
    if (!data.employerPhone || data.employerPhone.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number must be at least 10 digits",
        path: ["employerPhone"],
      });
    }
    if (!data.positionTitle || data.positionTitle.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Position title is required",
        path: ["positionTitle"],
      });
    }
  }
  
  if (data.employmentStatus === "Self-employed") {
    if (!data.businessName || data.businessName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business name is required",
        path: ["businessName"],
      });
    }
    if (!data.businessType || data.businessType.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Type of business is required",
        path: ["businessType"],
      });
    }
  }
})

export type EmploymentDetailsFormValues = z.infer<typeof employmentDetailsSchema> 