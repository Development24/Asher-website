export interface DocumentFile {
    name: string;
    type: string;
    url: string;
    size: number;
}

export interface FormData {
    applicationId: string
    // Personal Details
    title: string | any
    firstName: string
    middleName: string | undefined
    lastName: string
    dob: string
    email: string
    invited: string
    phoneNumber: string
    maritalStatus: "Single" | "Married" | "Divorced" | "Separated"
    nationality: string
    identificationType: string | any
    identificationNo: string
    issuingAuthority: string
    expiryDate: string
    nextOfKin: {
        firstName: string
        lastName: string
        relationship: string
        email: string
        phoneNumber: string
        middleName?: string | undefined
    }

    // Residential Details
    address: string
    addressStatus: string
    city: string
    state: string
    country: string
    zipCode: string
    lengthOfResidence: "Months" | "Years" | string
    landlordOrAgencyName: string
    landlordOrAgencyPhoneNumber: string
    landlordOrAgencyEmail: string
    reasonForLeaving: string
    prevAddresses: Array<{
        address: string
        lengthOfResidence: string
    }>
    startDate: string

    // Employment Details
    employment: EmploymentDetailsFormValues

    // Guarantor Details
    guarantor: GuarantorDetailsFormValues

    // Checklist fields
    checklist: Record<number, boolean>

    // Documents
    idDocument: DocumentFile | null
    proofOfIncome: DocumentFile | null
    bankStatements: DocumentFile | null
    proofOfAddress: DocumentFile | null
    proofOfBenefits: DocumentFile | null
    // Declaration
    declaration: boolean
    signature: string
    date: string
    additionalNotes: string
    propertyId?: string // Added propertyId to FormData
    propertyType: string
    propertyAddress: string
    propertyRent: string
    propertyDeposit: string
    moveInDate: string
    leaseTerm: string

    // Additional Details
    pets: string
    smoker: string
    additionalOccupants: string
    additionalInformation: string
    outstandingDebts: string
    // Keep existing residential fields
    currentAddress: string
    residencyLength: "months" | "years" | string
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

    // Reference Details
    professionalReferenceName: string
    personalReferenceName: string
    personalPhoneNumber: string
    professionalPhoneNumber: string
    professionalEmail: string
    personalEmail: string
    personalRelationship: string
    professionalRelationship: string

    // Keep existing reference fields
    references: Array<{
        name: string
        relationship: string
        phone: string
        email: string
    }>
}

export interface SavedDraft {
    id: number
    propertyId: string
    lastUpdated: string
    completionStatus: number
    formData: FormData
}

export interface GuarantorDetailsFormValues {
    fullName: string
    phoneNumber: string
    email: string
    address: string
    relationship: string
    identificationType: string
    identificationNo: string
    monthlyIncome: string
    employerName: string
}

export interface EmploymentDetailsFormValues {
    employmentStatus: "Employed" | "Self-employed" | "Unemployed" | "Retired" | "Student" | string
    address: string
    city: string
    state: string
    country: string
    startDate: string
    zipCode: string
    monthlyOrAnualIncome: string
    taxCredit?: string
    childBenefit?: string
    childMaintenance?: string
    disabilityBenefit?: string
    housingBenefit?: string
    pension?: string
    employerEmail: string
    employerPhone: string
    positionTitle: string
    employerCompany: string
    salary?: string
    additionalIncome?: string
}

interface User {
    id: string;
    email: string;
    password: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    role: string[];
    profileId: string;
    stripeCustomerId: string | null;
}

interface Property {
    id: string;
    name: string;
    description: string;
    propertysize: number;
    isDeleted: boolean;
    showCase: boolean;
    landlordId: string;
    agencyId: string | null;
    currency: string;
    marketValue: string;
    rentalFee: string;
    initialDeposit: string;
    dueDate: string;
    yearBuilt: string;
    createdAt: string;
    noBedRoom: number;
    noKitchen: number;
    noGarage: number;
    noBathRoom: number;
    city: string;
    stateId: string;
    country: string;
    zipcode: string;
    location: string;
    images: string[];
    videourl: string[];
    amenities: string[];
    totalApartments: number;
    longitude: number | null;
    latitude: number | null;
    availability: string;
    type: string;
    specificationType: string;
    useTypeCategory: string;
}
interface NextOfKin {

    id: string;
    lastName: string;
    relationship: string;
    email: string;
    firstName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    middleName: string;
    applicantPersonalDetailsId: string;
    userId: string;
}

interface PersonalDetails {
    id: string;
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    email: string;
    phoneNumber: string;
    maritalStatus: string;
    nationality: string;
    nextOfKin: NextOfKin[];
    identificationType: string;
    identificationNo: string | null;
    issuingAuthority: string;
    expiryDate: string;
    userId: string | null;
}

export interface IApplicationInterface {
    id: string;
    lastStep: string;
    leaseStartDate: string | null;
    leaseEndDate: string | null;
    propertyType: string | null;
    moveInDate: string | null;
    rentAmountPaid: string | null;
    securityDeposit: string | null;
    leaseTerm: string | null;
    status: string;
    invited: string;
    stepCompleted: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    residentialId: string | null;
    emergencyContactId: string | null;
    employmentInformationId: string | null;
    propertiesId: string;
    applicantPersonalDetailsId: string;
    guarantorInformationId: string | null;
    refereeId: string | null;
    tenantId: string | null;
    createdById: string;
    updatedById: string | null;
    user: User;
    residentialInfo: string | any;
    emergencyInfo: string | null;
    employmentInfo: string | null;
    documents: any[];
    properties: Property;
    personalDetails: PersonalDetails;
    guarantorInformation: string | null;
    declaration: {
        files: File | string
    }

}

