import * as z from "zod"

export const additionalDetailsSchema = z.object({
  pets: z.string().min(1, "Please specify if you have pets"),
  smoker: z.string().min(1, "Please specify if you are a smoker"),
  additionalOccupants: z.string().min(1, "Please provide information about additional occupants"),
  additionalInformation: z.string().optional(),
  outstandingDebts: z.string().optional(),
  requireParking: z.string().min(1, "Please specify if you require parking"),
})

export type AdditionalDetailsFormValues = z.infer<typeof additionalDetailsSchema> 