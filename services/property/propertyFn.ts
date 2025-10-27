import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EnquiryPayload, FeedBackPayload, createEnquiry, createFeedback, getAllFeedback, getAllProperties, getLandlordProperties, getPropertyById, getPropertyByIdForListingId, getRelatedListings, getUserLikedProperties, likeProperty, unlikeProperty } from "./property"
import { IPropertyParams } from "./types"

export const useGetProperties = (params?: IPropertyParams) => {
    return useQuery({
        queryKey: ["properties", params],
        queryFn: () => getAllProperties(params),
        retry: false,
        staleTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })
}

export const useGetPropertyById = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["property", id],
        queryFn: () => getPropertyById(id),
        retry: false,
        enabled: enabled,
    })
}

export const useGetPropertyByIdForListingId = (id: string, enabled: boolean = true) => {

    return useQuery({
        queryKey: ["property", id],
        queryFn: () => getPropertyByIdForListingId(id),
        retry: false,
        enabled: enabled,
    })
}

export const useLikeProperty = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => likeProperty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property", "properties", "userLikedProperties"] })
        }
    })
}

export const useUnlikeProperty = (id: string) => {
    return useMutation({
        mutationFn: () => unlikeProperty(id),
    })
}

export const useGetUserLikedProperties = () => {
    return useQuery({
        queryKey: ["userLikedProperties"],
        queryFn: () => getUserLikedProperties(),
        retry: false,
    })
}

export const useGetLandlordProperties = (landlordId: string) => {
    return useQuery({
        queryKey: ["landlordProperties", landlordId],
        queryFn: () => getLandlordProperties(landlordId),
        retry: false,
        enabled: !!landlordId,
    })
}

export const useCreateFeedback = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<FeedBackPayload>) => createFeedback(data),
        onSuccess: () => {
            // Invalidate all related queries
            const keysToInvalidate = ["feedback", "allInvites", "getPropertyByInviteId", "allApplications", "properties", "dashboardStats"];
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useGetAllFeedback = () => {
    return useQuery({
        queryKey: ["feedback"],
        queryFn: () => getAllFeedback(),
        retry: false,
    })
}

export const useCreateEnquiry = () => {
    return useMutation({
        mutationFn: (data: Partial<EnquiryPayload>) => createEnquiry(data),
    })
}

export const useGetRelatedListings = (propertyId: string, excludeListingId?: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["relatedListings", propertyId, excludeListingId],
        queryFn: () => getRelatedListings(propertyId, excludeListingId),
        enabled: enabled && !!propertyId,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}