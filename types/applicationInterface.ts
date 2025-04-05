export interface ApplicationData {
    id: string;
    completedSteps: string[];
    applicationInviteId: string;
    lastStep: string;
    leaseStartDate: null | string;
    leaseEndDate: null | string;
    propertyType: null | string;
    moveInDate: null | string;
    rentAmountPaid: null | string;
    securityDeposit: null | string;
    leaseTerm: null | string;
    status: string;
    invited: string;
    stepCompleted: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    residentialId: null | string;
    emergencyContactId: null | string;
    employmentInformationId: null | string;
    propertiesId: string;
    applicantPersonalDetailsId: string;
    guarantorInformationId: null | string;
    refereeId: null | string;
    tenantId: null | string;
    createdById: string;
    updatedById: null | string;
    user: User;
    residentialInfo: ResidentialInfo;
    guarantorInformation: GuarantorInformation | null;
    emergencyInfo: null;
    documents: Document[];
    employmentInfo: EmploymentInfo;
    properties: Properties;
    referee: Referee;
    Log: any[];
    declaration: Declaration[];
    applicationQuestions: ApplicationQuestions[];
    personalDetails: PersonalDetails;
    hasApplicationFee: boolean;
}

export interface Referee {
    id: string;
    professionalReferenceName: string;
    personalReferenceName: string;
    professionalEmail: string;
    personalEmail: string;
    professionalPhoneNumber: string;
    personalPhoneNumber: string;
    professionalRelationship: string;
    personalRelationship: string;
    applicantId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface MainApplicationInterface {
    pendingApplications: ApplicationData[];
    completedApplications: ApplicationData[];
    declinedApplications: ApplicationData[];
    makePaymentApplications: ApplicationData[];
    acceptedApplications: ApplicationData[];
    submittedApplications: ApplicationData[];
    invites: ApplicationData[];
}

export interface User {
    id: string;
    email: string;
    password: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    role: string[];
    profileId: string;
    stripeCustomerId: null | string;
}

export interface ResidentialInfo {
    id: string;
    address: string;
    addressStatus: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    lengthOfResidence: string;
    reasonForLeaving: string;
    landlordOrAgencyPhoneNumber: string;
    landlordOrAgencyEmail: string;
    landlordOrAgencyName: string;
    userId: string;
    prevAddresses: PrevAddress[];
    user: User;
}

export interface PrevAddress {
    id: string;
    address: string;
    lengthOfResidence: string;
    residentialInformationId: string;
}

export interface GuarantorInformation {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    relationship: string;
    identificationType: string;
    identificationNo: string;
    monthlyIncome: string;
    employerName: string;
    userId: string;
}

export interface Document {
    id: string;
    documentName: string;
    documentUrl: string;
    type: string;
    size: string;
    createdAt: string;
    updatedAt: string;
    applicantId: string;
    userId: null | string;
}

export interface EmploymentInfo {
    id: string;
    employmentStatus: string;
    taxCredit: string;
    startDate: string;
    zipCode: string;
    address: string;
    city: string;
    state: string;
    country: string;
    monthlyOrAnualIncome: string;
    childBenefit: string;
    childMaintenance: string;
    disabilityBenefit: string;
    housingBenefit: string;
    others: null | string;
    pension: string;
    moreDetails: null | string;
    employerCompany: string;
    employerEmail: string;
    employerPhone: string;
    positionTitle: string;
    userId: string;
}

export interface Properties {
    id: string;
    name: string;
    description: string;
    propertysize: number;
    isDeleted: boolean;
    showCase: boolean;
    landlordId: string;
    agencyId: null | string;
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
    longitude: null | string;
    latitude: null | string;
    availability: string;
    type: string;
    specificationType: string;
    useTypeCategory: string;
}

export interface Declaration {
    id: string;
    signature: string;
    declaration: string;
    additionalNotes: string;
    date: string;
    applicantId: string;
}

export interface ApplicationQuestions {
    id: string;
    havePet: string;
    youSmoke: string;
    requireParking: string;
    haveOutstandingDebts: string;
    additionalOccupants: string;
    additionalInformation: string;
    applicantId: string;
}

export interface PersonalDetails {
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
    identificationType: string;
    identificationNo: null | string;
    issuingAuthority: string;
    expiryDate: string;
    userId: null | string;
    nextOfKin: NextOfKin[];
}

export interface NextOfKin {
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
