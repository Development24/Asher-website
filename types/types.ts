export type KeyValuePair = {
    [key: string]: any;
  };
  
  export interface IUser {
    id: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    role: string[];
    profileId: string;
    stripeCustomerId: string | null;
    profile: {
      id: string;
      gender: string | null;
      phoneNumber: string | null;
      address: string | null;
      maritalStatus: string | null;
      dateOfBirth: string | null;
      fullname: string | null;
      firstName: string | null;
      lastName: string | null;
      profileUrl: string | null;
      zip: string | null;
      unit: string | null;
      state: string | null;
      timeZone: string | null;
      city: string | null;
      country: string | null;
      taxPayerId: string | null;
      taxType: string | null;
      title: string | null;
    };
    landlords:{
      emailDomains: string;
      id: string;
      isDeleted: boolean;
      landlordCode: string;
      stripeCustomerId: string | null;
      createdAt: string;
      updatedAt: string;
      userId: string;
    }
  }
  
  export interface InfoField {
    label: string;
    value: string;
  }
  
  export interface AddressData {
    street: string;
    city: string;
    state: string;
  }
  
  export interface PersonalInfo {
    firstName: InfoField;
    middleName: InfoField;
    lastName: InfoField;
    companyName: InfoField;
    dateOfBirth: InfoField;
    age: InfoField;
    email: InfoField;
    additionalEmail: InfoField;
    phone: InfoField;
    additionalPhone: InfoField;
  }
  
  export interface NextOfKin {
    firstName: InfoField;
    middleName: InfoField;
    lastName: InfoField;
    relationship: InfoField;
    phone: InfoField;
    email: InfoField;
  }
  
  export interface ResidentialInfo {
    currentAddress: AddressData;
    previousAddress: AddressData;
    lengthOfResidence: string;
  }
  
  export interface EmploymentInfo {
    employmentStatus: InfoField;
    positionTitle: InfoField;
    employer: InfoField;
    companyEmail: InfoField;
    companyPhone: InfoField;
  }
  
  export interface LeaseInfo {
    leaseStartDate: InfoField;
    leaseEndDate: InfoField;
    moveInDate: InfoField;
    rentAmount: InfoField;
    securityDeposit: InfoField;
    leaseTerm: InfoField;
  }
  
  export interface GuarantorInfo {
    firstName: InfoField;
    middleName: InfoField;
    lastName: InfoField;
    email: InfoField;
    phone: InfoField;
  }
  