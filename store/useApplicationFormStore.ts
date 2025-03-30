import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EmploymentDetailsFormValues, FormData, GuarantorDetailsFormValues, SavedDraft } from '@/types/application-form' // We'll create these types

interface ApplicationFormState {
  formData: FormData
  currentStep: number
  isValid: boolean
  savedDrafts: SavedDraft[]
  updateFormData: (data: Partial<FormData>) => void
  setCurrentStep: (step: number) => void
  setIsValid: (valid: boolean) => void
  saveDraft: () => void
  loadDraft: (draftId: number) => void
}
const initialGurantorDetails: GuarantorDetailsFormValues = {
  fullName: "",
  phoneNumber: "",
  email: "",
  address: "",
  relationship: "",
  identificationType: "",
  identificationNo: "",
  monthlyIncome: "",
  employerName: "",
}

export const initialEmploymentDetails: EmploymentDetailsFormValues = {
  employmentStatus: "Employed",
  address: "",
  city: "",
  state: "",
  country: "",
  startDate: "",
  zipCode: "",
  monthlyOrAnualIncome: "",
  taxCredit: "",
  childBenefit: "",
  childMaintenance: "",
  disabilityBenefit: "",
  housingBenefit: "",
  pension: "",
  employerCompany: "",
  employerEmail: "",
  employerPhone: "",
  positionTitle: "",
  additionalIncome: "",
}


const initialFormData: FormData = {
  applicationId: "",
  title: "",
  startDate: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  email: "",
  phoneNumber: "",
  maritalStatus: "Single",
  invited: "No",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  nationality: "",
  identificationType: "",
  identificationNo: "",
  issuingAuthority: "",
  expiryDate: "",
  nextOfKin: {
    firstName: "",
    lastName: "",
    relationship: "",
    email: "",
    middleName: "",
    phoneNumber: ""
  },
  currentAddress: "",
  residencyLength: "months",
  previousAddresses: [],
  landlordDetails: {
    name: "",
    phone: "",
    email: "",
  },
  employment: initialEmploymentDetails,
  guarantor: initialGurantorDetails,
  propertyId: "",
  propertyType: "",
  propertyAddress: "",
  propertyRent: "",
  propertyDeposit: "",
  moveInDate: "",
  leaseTerm: "",
  checklist: {},
  idDocument: null,
  proofOfIncome: null,
  proofOfBenefits: null,
  bankStatements: null,
  proofOfAddress: null,
  declaration: false,
  signature: "",
  date: "",
  additionalNotes: "",
  pets: "",
  smoker: "",
  additionalOccupants: "",
  additionalInformation: "",
  landlordOrAgencyName: "",
  landlordOrAgencyPhoneNumber: "",
  landlordOrAgencyEmail: "",
  reasonForLeaving: "",
  prevAddresses: [],
  professionalReferenceName: "",
  personalReferenceName: "",
  personalPhoneNumber: "",
  professionalPhoneNumber: "",
  professionalEmail: "",
  personalEmail: "",
  personalRelationship: "",
  professionalRelationship: "",
  references: [],
  addressStatus: "",
  lengthOfResidence: "",
  outstandingDebts: "",
}

export const useApplicationFormStore = create<ApplicationFormState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 0,
      isValid: false,
      savedDrafts: [],

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      setCurrentStep: (step) =>
        set({ currentStep: step }),

      setIsValid: (valid) =>
        set({ isValid: valid }),

      saveDraft: () => {
        const state = get()
        const newDraft: SavedDraft = {
          id: Date.now(),
          propertyId: state.formData.propertyId || "",
          lastUpdated: new Date().toISOString(),
          completionStatus: calculateCompletionStatus(state.formData),
          formData: state.formData,
        }

        set((state) => ({
          savedDrafts: [...state.savedDrafts, newDraft]
        }))
      },

      loadDraft: (draftId) => {
        const draft = get().savedDrafts.find(d => d.id === draftId)
        if (draft) {
          set({
            formData: draft.formData,
            currentStep: 0
          })
        }
      },
    }),
    {
      name: 'application-form-storage',
    }
  )
)

// Helper function
const calculateCompletionStatus = (data: FormData) => {
  const totalFields = Object.keys(data).length
  const filledFields = Object.values(data).filter(value => value !== "").length
  return Math.round((filledFields / totalFields) * 100)
} 