"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useApplicationFormStore } from "@/store/useApplicationFormStore"

interface FormData {
  // Personal Details
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
  phone: string
  email: string
  maritalStatus: "single" | "married" | "divorced" | "separated"
  nextOfKin: {
    title: string
    firstName: string
    middleName: string
    lastName: string
    relationship: string
    address: string
    email: string
    phone: string
  }

  // Residential Details
  currentAddress: string
  residencyLength: "months" | "years"
  previousAddresses: Array<{
    address: string
    lengthOfStay: string
    type: string
  }>
  landlordDetails: {
    name: string
    phone: string
    email: string
  }

  // Employment Details
  employmentStatus: string
  employerName: string
  employerAddress: string
  salary: string
  startDate: string
  position: string
  additionalIncome: string

  // Guarantor Details
  guarantorName: string
  guarantorRelationship: string
  guarantorPhone: string
  guarantorEmail: string
  guarantorIdType: string
  guarantorIdNumber: string
  guarantorEmployer: string
  guarantorIncome: string

  // Checklist fields
  checklist: Record<number, boolean>

  // Documents
  idDocument: File | null
  proofOfIncome: File | null
  bankStatements: File | null
  proofOfAddress: File | null

  // Declaration
  declaration: boolean
  signature: string
  date: string
  additionalNotes: string
  propertyId?: number // Added propertyId to FormData
}

interface SavedDraft {
  id: number
  propertyId: number
  lastUpdated: string
  completionStatus: number
}

interface ApplicationFormContextType {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  isValid: boolean
  setIsValid: (valid: boolean) => void
  saveDraft: () => void
  savedDrafts: SavedDraft[]
  loadDraft: (draftId: number) => void
}

const ApplicationFormContext = createContext<ApplicationFormContextType | undefined>(undefined)

const initialFormData: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: "",
  },
  phone: "",
  email: "",
  maritalStatus: "single",
  nextOfKin: {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    relationship: "",
    address: "",
    email: "",
    phone: "",
  },
  currentAddress: "",
  residencyLength: "years",
  previousAddresses: [],
  landlordDetails: {
    name: "",
    phone: "",
    email: "",
  },
  employmentStatus: "",
  employerName: "",
  employerAddress: "",
  salary: "",
  startDate: "",
  position: "",
  additionalIncome: "",
  guarantorName: "",
  guarantorRelationship: "",
  guarantorPhone: "",
  guarantorEmail: "",
  guarantorIdType: "",
  guarantorIdNumber: "",
  guarantorEmployer: "",
  guarantorIncome: "",
  checklist: {},
  idDocument: null,
  proofOfIncome: null,
  bankStatements: null,
  proofOfAddress: null,
  declaration: false,
  signature: "",
  date: "",
  additionalNotes: "",
  propertyId: 0, // Added initial value for propertyId
}

export function ApplicationFormProvider({ children }: { children: ReactNode }) {
  // This provider now just provides access to the Zustand store
  // All state management is handled by the store
  return (
    <ApplicationFormContext.Provider value={{} as any}>
      {children}
    </ApplicationFormContext.Provider>
  )
}

export function useApplicationForm() {
  // Now delegates to the Zustand store instead of using React Context state
  const store = useApplicationFormStore()
  return {
    formData: store.formData,
    updateFormData: store.updateFormData,
    currentStep: store.currentStep,
    setCurrentStep: store.setCurrentStep,
    isValid: store.isValid,
    setIsValid: store.setIsValid,
    saveDraft: store.saveDraft,
    savedDrafts: store.savedDrafts,
    loadDraft: store.loadDraft,
  }
}

