import * as z from "zod"

export const personalDetailsSchema = z.object({
  title: z.enum(["Mr.", "Mrs.", "Miss", "Dr."]),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z.union([z.string(), z.date()]).refine((date) => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return new Date(date) <= eighteenYearsAgo;
  }, "You must be at least 18 years old"),
  invited: z.string(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Separated"]),
  nationality: z.string().min(2, "Nationality is required"),
  identificationType: z.enum(["passport", "driving licence", "national id"]),
  identificationNo: z.string().min(1, "ID number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  expiryDate: z.string().refine((date) => {
    return new Date(date) > new Date();
  }, "Expiry date must be in the future"),
  nextOfKin: z.array(z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    relationship: z.string().min(2, "Relationship is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  })),
})

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema> 