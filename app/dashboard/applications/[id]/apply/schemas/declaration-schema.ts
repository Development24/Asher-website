import * as z from "zod"

export const declarationSchema = z.object({
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration",
  }),
  signature: z.string().min(2, "Signature is required"),
  date: z.string().min(1, "Date is required"),
  additionalNotes: z.string().optional(),
  files: z.union([z.instanceof(File), z.string()]).optional(),
})

export type DeclarationFormValues = z.infer<typeof declarationSchema> 