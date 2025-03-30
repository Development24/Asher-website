import { api } from "@/lib/config/api"
import { IPropertyParams } from "./types"

const URL = "api/properties"
// /application/milestones/cm284qnxt0003tffzo49gvmfl
const propertyURL = {
    all: "/property",
    byId: "/property/:id",
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


export const getAllProperties = async (params?: PropertyRentalFilter) => {
    const response = await api.get(URL + propertyURL.all, { params })
    return response.data
}

export const getPropertyById = async (id: string) => {
    const response = await api.get(URL + propertyURL.byId.replace(":id", id))
    return response.data
}

export const likeProperty = async (id: string) => {
    const response = await api.post(URL + propertyURL.likeProperty.replace(":id", id))
    return response.data
}

export const unlikeProperty = async (id: string) => {
    const response = await api.post(URL + propertyURL.unlikeProperty.replace(":id", id))
    return response.data
}

export const getUserLikedProperties = async () => {
    const response = await api.get(URL + propertyURL.userLikedProperties)
    return response.data
}

export const getLandlordProperties = async (landlordId: string) => {
    const response = await api.get(URL + propertyURL.landlordProperties.replace(":landlordId", landlordId))
    return response.data
}

export const getAllFeedback = async () => {
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
export const createFeedback = async (data: Partial<FeedBackPayload>) => {
    const response = await api.post(feedbackURL.all, data)
    return response.data
}

export interface EnquiryPayload {
    isLiked?: boolean;
    review?: string;
    rating?: number;
    propertyId: string;
    message: string;
}
export const createEnquiry = async (data: Partial<EnquiryPayload>) => {
    const response = await api.post(URL + propertyURL.enquiry, data)
    return response.data
}