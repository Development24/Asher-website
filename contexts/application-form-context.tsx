"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([])

  useEffect(() => {
    // Load saved drafts from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedDraftsData = localStorage.getItem("savedDrafts")
      if (savedDraftsData) {
        setSavedDrafts(JSON.parse(savedDraftsData))
      }
    }
  }, [])

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const saveDraft = () => {
    const newDraft: SavedDraft = {
      id: Date.now(), // Use timestamp as a simple unique id
      propertyId: formData.propertyId || 0, // Assume propertyId is part of formData
      lastUpdated: new Date().toISOString(),
      completionStatus: calculateCompletionStatus(formData),
    }

    const updatedDrafts = [...savedDrafts, newDraft]
    setSavedDrafts(updatedDrafts)
    if (typeof window !== 'undefined') {
      localStorage.setItem("savedDrafts", JSON.stringify(updatedDrafts))
      localStorage.setItem(`draft_${newDraft.id}`, JSON.stringify(formData))
    }
  }

  const loadDraft = (draftId: number) => {
    if (typeof window !== 'undefined') {
      const draftData = localStorage.getItem(`draft_${draftId}`)
      if (draftData) {
        setFormData(JSON.parse(draftData))
        // You might want to set the current step based on the loaded data
        setCurrentStep(0) // or calculate the appropriate step
      }
    }
  }

  const calculateCompletionStatus = (data: FormData) => {
    // Implement logic to calculate completion percentage
    // This is a simplified example
    const totalFields = Object.keys(data).length
    const filledFields = Object.values(data).filter((value) => value !== "").length
    return Math.round((filledFields / totalFields) * 100)
  }

  return (
    <ApplicationFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        isValid,
        setIsValid,
        saveDraft,
        savedDrafts,
        loadDraft,
      }}
    >
      {children}
    </ApplicationFormContext.Provider>
  )
}

export function useApplicationForm() {
  const context = useContext(ApplicationFormContext)
  if (context === undefined) {
    throw new Error("useApplicationForm must be used within an ApplicationFormProvider")
  }
  return context
}

