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

// Normalized Listing Entity
export interface ListingEntity {
    type: 'property' | 'unit' | 'room';
    id: string;
    name: string;
    roomName?: string;
    roomSize?: string;
    unitType?: string;
    unitNumber?: string;
    images: Array<{ id: string; url: string; caption: string; isPrimary?: boolean }>;
    entityPrice?: string;
    entityPriceFrequency?: string;
    ensuite?: boolean;
    furnished?: boolean;
    description?: string | null;
    availability?: string;
}

// Normalized Property Context
export interface PropertyContext {
    id: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    state: { id: string; name: string };
    country: string;
    zipcode: string;
    longitude: string | null;
    latitude: string | null;
    images: Array<{ id: string; url: string; caption: string; isPrimary?: boolean }>;
    videos: Array<{ id: string; url: string; caption: string }>;
    bedrooms?: number;
    bathrooms?: number;
    propertySubType?: string | null;
    specificationType: 'RESIDENTIAL' | 'COMMERCIAL' | 'SHORTLET';
    keyFeatures: string[];
    customKeyFeatures: string[];
    landlord: {
        id: string;
        landlordCode: string;
        user: {
            email: string;
            profile: {
                fullname: string;
                firstName: string;
                lastName: string;
                profileUrl: string | null;
            };
        };
    };
}

// Normalized Listing (matches backend response)
export interface Listing {
    listingId: string;
    listingType: 'ENTIRE_PROPERTY' | 'SINGLE_UNIT' | 'ROOM';
    isActive: boolean;
    onListing: boolean;
    createdAt: string | Date;
    price: string;
    priceFrequency: string | null;
    securityDeposit: string;
    applicationFeeAmount: string | null;
    payApplicationFee: boolean;
    availableFrom: string | Date | null;
    availableTo: string | Date | null;
    listingEntity: ListingEntity;
    property: PropertyContext;
    specification: {
        type: 'RESIDENTIAL' | 'COMMERCIAL' | 'SHORTLET';
        residential?: {
            bedrooms: number;
            bathrooms: number;
            status: string;
            furnished: boolean | null;
            tenure: string | null;
            totalArea: string | null;
            areaUnit: string | null;
            buildingAmenityFeatures: string[];
            safetyFeatures: string[];
            epcRating: string | null;
            heatingTypes: string[];
            coolingTypes: string[];
            glazingTypes: string | null;
            sharedFacilities?: {
                kitchen: boolean;
                bathroom: boolean;
                livingRoom: boolean;
                garden: boolean;
                garage: boolean;
                laundry: boolean;
                parking: boolean;
            };
        };
        commercial?: any;
    };
    hierarchy: HierarchyInfo;
    relatedListings: RelatedListings;
    
    // Legacy fields for backward compatibility (deprecated)
    id?: string;
    type?: string;
    propertyId?: string;
    property?: Property;
    properties?: Property;
}
  