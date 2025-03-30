import * as z from "zod"

const previousAddressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  lengthOfResidence: z.string().min(1, "Length of residence is required"),
})

export const residentialDetailsSchema = z.object({
  address: z.string().min(5, "Address is required"),
  addressStatus: z.string().min(2, "Address status is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().min(4, "Zip code is required"),
  lengthOfResidence: z.union([z.enum(["Months", "Years"]), z.string()]),
  landlordOrAgencyName: z.string().min(2, "Landlord/Agency name is required"),
  landlordOrAgencyPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  landlordOrAgencyEmail: z.string().email("Invalid email address"),
  reasonForLeaving: z.string().min(2, "Reason for leaving is required"),
  prevAddresses: z.array(previousAddressSchema),
})

export type ResidentialDetailsFormValues = z.infer<typeof residentialDetailsSchema> 