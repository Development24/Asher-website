import * as z from "zod"

// For form input validation
export const documentsSchema = z.object({
  idDocument: z.instanceof(File).nullable(),
  bankStatements: z.instanceof(File).nullable(),
  proofOfIncome: z.instanceof(File).nullable(),
  proofOfAddress: z.instanceof(File).nullable(),
  proofOfBenefits: z.instanceof(File).nullable()
})

export type DocumentsFormValues = z.infer<typeof documentsSchema>

// For the document payload
export const DocumentPayloadSchema = z.object({
  documentName: z.string(),
  type: z.string(),
  size: z.string(),
  files: z.instanceof(File),
  applicantId: z.string().optional(),
})

export type DocumentPayload = z.infer<typeof DocumentPayloadSchema> 