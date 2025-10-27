import { IUser } from "@/types/types"

export interface IPropertyParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    order?: string
    state?: string
    city?: string
    isActive?: number
    specificationType?: string
    country?: string
    type?: string

}

export interface Landlord {
    id: string;
    name: string;
    emailDomains: string;
    landlordCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    userId: string;
    email: string;
    image?: string;
    user: IUser;
}

export  interface Property {
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
    images: any[];
    videourl: string[];
    amenities: string[];
    totalApartments: number;
    longitude: number | null;
    latitude: number | null;
    availability: string;
    type: string;
    specificationType: string;
    useTypeCategory: string | null;
    state: State;
    reviews: any[];
    UserLikedProperty: UserLikedProperty[];
    landlord?: Landlord;
    [key: string]: any;
  }
  
  export interface State {
    id: string;
    name: string;
    isDeleted: boolean;
  }
  
  export interface UserLikedProperty {
    id: string;
    userId: string;
    propertyId: string;
    likedAt: string;
  }
  
// Hierarchy types
export interface HierarchyBreadcrumb {
    id: string;
    name: string;
    type: 'property' | 'unit' | 'room';
    url: string;
}

export interface HierarchyInfo {
    level: 'property' | 'unit' | 'room';
    propertyId: string;
    unitId?: string;
    roomId?: string;
    breadcrumb: HierarchyBreadcrumb[];
    context: string;
}

export interface RelatedListing {
    id: string;
    name: string;
    price: number;
    currency: string;
    url: string;
}

export interface RelatedListings {
    units: RelatedListing[];
    rooms: RelatedListing[];
    totalCount: number;
}

export interface Listing {
    id: string;
    payApplicationFee: boolean;
    isActive: boolean;
    isShortlet: boolean;
    shortletDuration: string;
    onListing: boolean;
    type: string;
    propertyId: string;
    apartmentId: string | null;
    createdAt: string;
    property?: Property;
    properties?: Property;
    apartment: any | null;
    // New hierarchy fields
    hierarchy?: HierarchyInfo;
    relatedListings?: RelatedListings;
  }
  