interface Profile {
    id: string;
    gender: string | null;
    phoneNumber: string | null;
    address: string | null;
    country: string | null;
    city: string | null;
    maritalStatus: string | null;
    dateOfBirth: string | null;
    fullname: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    profileUrl: string | null;
    zip: string | null;
    unit: string | null;
    state: string | null;
    timeZone: string | null;
    taxPayerId: string | null;
    taxType: string | null;
    title: string | null;
}

export interface User {
    email: string;
    id: string;
    profile: Profile;
}

export interface Property {
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
    longitude: string;
    latitude: string;
    availability: string;
    type: string;
    specificationType: string;
    useTypeCategory: string;
}

export interface Enquiry {
    id: string;
    subjects: string | any;
    viewAgain: string | any;
    considerRenting: string | any;
    events: string | any;
    type: string | any;
    status: string | any;
    createdAt: string | any;
    propertyId: string;
    applicationId: string | null;
    transactionId: string | null;
    createdById: string;
    property: Property;
    users: User;
    applicationInvites: any[];
}

export interface ApplicationsStats {
    activeApplications: number;
    completedApplications: number;
}

export interface Landlord {
    id: string;
    userId: string;
    landlordCode: string;
    isDeleted: boolean;
    stripeCustomerId: string | null;
    emailDomains: string;
    user: User;
}

export interface PropertyInvite {
    id: string;
    isDeleted: boolean;
    applicationFee: string | null;
    createdAt: string;
    updatedAt: string;
    scheduleDate: string;
    reScheduleDate: string | null;
    response: string;
    responseStepsCompleted: string[];
    propertiesId: string;
    apartmentsId: string | null;
    invitedByLandordId: string;
    tenantsId: string | null;
    userInvitedId: string;
    enquiryId: string;
    properties: Property;
    apartments: any | null;
    tenants: any | null;
    userInvited: User;
    landlords: Landlord;
    enquires: Enquiry;
}
