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
    dashboardStats,
    completeApplication,
    getReferenceDetails,
    signAgreement
} from "./application"

const keysToInvalidate = ["allApplications", "properties", "application", "milestonesApplication", "singleApplication", "allInvites", "getPropertyByInviteId", "dashboardStats", "feedback"]

// Utility function to invalidate all related queries
const invalidateAllRelatedQueries = (queryClient: any) => {
    keysToInvalidate.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
    });
}

export const useStartApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { propertyId: string, data: any }) => startApplication(payload.propertyId, payload.data),
        onSuccess: () => {
            invalidateAllRelatedQueries(queryClient);
        }
    })
}

export const useResidentApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => residentApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allApplications", "properties", "application", "milestonesApplication", "singleApplication", "allInvites", "getPropertyByInviteId", "dashboardStats"] });
        }
    })
}

export const useEmployerApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => employerApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allApplications", "properties", "application", "milestonesApplication", "singleApplication", "allInvites", "getPropertyByInviteId", "dashboardStats"] });
        }
    })
}

export const useEmergencyContactApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => emergencyContactApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useAdditionalDetailsApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => additionalDetailsApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useRefereesApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => refereesApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useGuarantorApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => guarantorApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}


export const useDocumentsApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => documentsApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useChecklistApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => checklistApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useDeclarationApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => declarationApplication(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
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
        enabled: !!applicationId,
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
        onSuccess: (data, variables) => {
            // Invalidate all related queries
            invalidateAllRelatedQueries(queryClient);
            // Also specifically invalidate the property by invite ID
            queryClient.invalidateQueries({ queryKey: ["getPropertyByInviteId", variables.id] });
        }
    })
}

export const useGetPropertyByInviteId = (id: string) => {
    return useQuery({
        queryKey: ["getPropertyByInviteId", id],
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

export const useCompleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (applicationId: string) => completeApplication(applicationId),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}

export const useGetReferenceDetails = (applicationId: string) => {
    return useQuery({
        queryKey: ["getReferenceDetails"],
        queryFn: () => getReferenceDetails(applicationId),
    })
}

export const useSignAgreement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => signAgreement(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}