import * as z from "zod"

export const referenceDetailsSchema = z.object({
  professionalReferenceName: z.string().min(2, "Professional reference name is required"),
  personalReferenceName: z.string().min(2, "Personal reference name is required"),
  personalPhoneNumber: z.string().min(10, "Personal phone number must be at least 10 digits"),
  professionalPhoneNumber: z.string().min(10, "Professional phone number must be at least 10 digits"),
  professionalEmail: z.string().email("Invalid professional email address"),
  personalEmail: z.string().email("Invalid personal email address"),
  personalRelationship: z.string().min(2, "Personal relationship is required"),
  professionalRelationship: z.string().min(2, "Professional relationship is required"),
})

export type ReferenceDetailsFormValues = z.infer<typeof referenceDetailsSchema> 