import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    emergencyContactApplication,
    employerApplication,
    residentApplication,
    startApplication,
    additionalDetailsApplication,
    refereesApplication,
    guarantorApplication,
    documentsApplication,
    checklistApplication,
    declarationApplication,
    milestonesApplication,
    singleApplication,
    allApplications,
    allInvites,
    updateInvite,
    UpdateInvitePayload,
    getPropertyByInviteId,
    dashboardStats
} from "./application"

export const useStartApplication = () => {
    return useMutation({
        mutationFn: (payload: { propertyId: string, data: any }) => startApplication(payload.propertyId, payload.data),
    })
}

export const useResidentApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => residentApplication(payload.applicationId, payload.data),
    })
}

export const useEmployerApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => employerApplication(payload.applicationId, payload.data),
    })
}

export const useEmergencyContactApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => emergencyContactApplication(payload.applicationId, payload.data),
    })
}

export const useAdditionalDetailsApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => additionalDetailsApplication(payload.applicationId, payload.data),
    })
}

export const useRefereesApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => refereesApplication(payload.applicationId, payload.data),
    })
}

export const useGuarantorApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => guarantorApplication(payload.applicationId, payload.data),
    })
}


export const useDocumentsApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => documentsApplication(payload.applicationId, payload.data),
    })
}

export const useChecklistApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => checklistApplication(payload.applicationId, payload.data),
    })
}

export const useDeclarationApplication = () => {
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => declarationApplication(payload.applicationId, payload.data),
    })
}

export const useAllApplications = () => {
    return useQuery({
        queryKey: ["allApplications"],
        queryFn: () => allApplications(),
        retry: false,
    })
}

export const useMilestonesApplication = (propertyId: string, applicationId?: string) => {
    return useQuery({
        queryKey: ["milestonesApplication"],
        queryFn: () => milestonesApplication(propertyId, applicationId),
        retry: false,
    })
}

export const useGetSingleApplication = (applicationId: string) => {
    return useQuery({
        queryKey: ["singleApplication"],
        queryFn: () => singleApplication(applicationId),
        retry: false,
    })
}

export const useGetAllInvites = () => {
    return useQuery({
        queryKey: ["allInvites"],
        queryFn: () => allInvites(),
        retry: false,
    })
}

export const useUpdateInvite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { id: string, data: UpdateInvitePayload }) => updateInvite(payload.id, payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allInvites", "feedback", "getPropertyByInviteId", "allApplications", "properties"] });
        }
    })
}

export const useGetPropertyByInviteId = (id: string) => {
    return useQuery({
        queryKey: ["getPropertyByInviteId"],
        queryFn: () => getPropertyByInviteId(id),
        retry: false,
    })
}

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: () => dashboardStats(),
    })
}