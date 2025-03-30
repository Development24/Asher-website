export interface User {
    id: string;
    email: string;
    profile: Profile;
}

export interface Profile {
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

export interface Landlord {
    id: string;
    userId: string;
    landlordCode: string;
    isDeleted: boolean;
    stripeCustomerId: string | null;
    emailDomains: string;
    user: User;
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
    dueDate: string | null;
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
    useTypeCategory: string | null;
    landlord: Landlord;
}

export interface InviteData {
    id: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    scheduleDate: string;
    reScheduleDate: string | null;
    response: string;
    propertiesId: string;
    apartmentsId: string | null;
    invitedByLandordId: string;
    tenantsId: string | null;
    userInvitedId: string;
    invitationId: string | null;
    properties: Property;
}

export interface InviteResponse {
    acceptInvites: InviteData[];
    rejectedInvites: InviteData[];
    rescheduledInvites: InviteData[];
    pendingInvites: InviteData[];
    feedbackInvites: InviteData[];
    awaitingFeedbackInvites: InviteData[];
}
