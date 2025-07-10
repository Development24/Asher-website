import { api } from "@/lib/config/api"
import { IPropertyParams } from "./types"
import type { Property, Listing } from "./types";

// Response types
export interface GetAllPropertiesResponse {
  properties: Listing[];
  pagination?: any;
  message?: string;
}

export interface GetPropertyByIdResponse {
  property: Property;
  message?: string;
}

export interface LikePropertyResponse {
  message: string;
  liked: boolean;
}

export interface UnlikePropertyResponse {
  message: string;
  liked: boolean;
}

export interface GetUserLikedPropertiesResponse {
  properties: Property[];
  message?: string;
}

export interface GetLandlordPropertiesResponse {
  properties: Property[];
  message?: string;
}

export interface GetAllFeedbackResponse {
  feedback: any[];
  message?: string;
}

export interface CreateFeedbackResponse {
  message: string;
  feedback: any;
}

export interface CreateEnquiryResponse {
  message: string;
  enquiry: any;
}

const URL = "api/properties"
// /application/milestones/cm284qnxt0003tffzo49gvmfl
// /properties/property/listing/cmbaqqrh7000114cg600w33uw
const propertyURL = {
    all: "/property",
    byId: "/property/:id",
    forListingId: "/property/listing/:id",
    likeProperty: "/property/likes/:id",
    unlikeProperty: "/property/unlike/:id",
    userLikedProperties: "/property/user/likes",
    landlordProperties: "/property/landlord/:landlordId",
    enquiry: "/property/enquire",
}

const feedbackURL = {
    all: "api/logs",
}

export type PropertyRentalFilter = IPropertyParams & {
    propertyType?: any;
    type?: string;
    country?: string;
    price?: string;
    features?: string[] | any;
    minBedRoom?: number;
    maxBedRoom?: number;
    minRentalFee?: number;
    maxRentalFee?: number;
    mustHaves?: string[];
    minBathRoom?: number;
    maxBathRoom?: number;
    state?: string;
    minGarage?: number;
    maxGarage?: number;
    [key: string]: any;
}


export const getAllProperties = async (params?: PropertyRentalFilter): Promise<GetAllPropertiesResponse> => {
    const response = await api.get(URL + propertyURL.all, { params })
    return response.data
}

export const getPropertyById = async (id: string): Promise<GetPropertyByIdResponse> => {
    const response = await api.get(URL + propertyURL.byId.replace(":id", id))
    return response.data
}

export const getPropertyByIdForListingId = async (id: string): Promise<GetPropertyByIdResponse> => {
    const response = await api.get(URL + propertyURL.forListingId.replace(":id", id))
    return response.data
}

export const likeProperty = async (id: string): Promise<LikePropertyResponse> => {
    const response = await api.post(URL + propertyURL.likeProperty.replace(":id", id))
    return response.data
}

export const unlikeProperty = async (id: string): Promise<UnlikePropertyResponse> => {
    const response = await api.post(URL + propertyURL.unlikeProperty.replace(":id", id))
    return response.data
}

export const getUserLikedProperties = async (): Promise<GetUserLikedPropertiesResponse> => {
    const response = await api.get(URL + propertyURL.userLikedProperties)
    return response.data
}

export const getLandlordProperties = async (landlordId: string): Promise<GetLandlordPropertiesResponse> => {
    const response = await api.get(URL + propertyURL.landlordProperties.replace(":landlordId", landlordId))
    return response.data
}

export const getAllFeedback = async (): Promise<GetAllFeedbackResponse> => {
    const response = await api.get(feedbackURL.all)
    return response.data
}
export interface FeedBackPayload{
    propertyId?: string;
    applicationInvitedId?: string | null;
    events?: string;
    viewAgain?: string;
    considerRenting?: string;
    type?: string;
    response?: string;
}
export const createFeedback = async (data: Partial<FeedBackPayload>): Promise<CreateFeedbackResponse> => {
    const response = await api.post(feedbackURL.all, data)
    return response.data
}

export interface EnquiryPayload {
    isLiked?: boolean;
    review?: string;
    rating?: number;
    propertyId?: string;
    message: string;
    propertyListingId?: string;
}
export const createEnquiry = async (data: Partial<EnquiryPayload>): Promise<CreateEnquiryResponse> => {
    const response = await api.post(URL + propertyURL.enquiry, data)
    return response.data
}