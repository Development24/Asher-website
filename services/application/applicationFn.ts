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
    signAgreement,
    updateMoveInDate,
    UpdateMoveInDatePayload
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
        queryFn: async () => {
            const data = await allApplications();
            
            // Enrich application data with normalized property/listing information
            if (data?.applications) {
                const { ApplicationNormalizer } = await import('@/lib/utils/ApplicationNormalizer');
                
                // Collect all applications from all categories for normalization
                const allApplicationsList = [
                    ...(data.applications.pendingApplications || []),
                    ...(data.applications.completedApplications || []),
                    ...(data.applications.declinedApplications || []),
                    ...(data.applications.makePaymentApplications || []),
                    ...(data.applications.acceptedApplications || []),
                    ...(data.applications.submittedApplications || []),
                    ...(data.applications.activeApps || []),
                    ...(data.applications.invites || []),
                ];
                
                // Normalize all applications to include listing and property details
                const normalized = await ApplicationNormalizer.normalizeMany(allApplicationsList);
                
                // Create lookup map for quick access during merge
                // Use both id and applicationId as keys for flexible lookup
                const normalizedMap = new Map<string, any>();
                normalized.forEach(n => {
                    normalizedMap.set(n.id, n);
                    normalizedMap.set(n.applicationId, n);
                });
                
                /**
                 * Merge normalized data with original application data
                 * 
                 * Combines enriched normalized data (listing, property details) with original
                 * application fields. The merge ensures normalized property/listing data is available
                 * while maintaining original application IDs for navigation and API calls.
                 * 
                 * @param app - Original application object from API response
                 * @returns Application object with both normalized and original data
                 */
                const mapApplication = (app: any) => {
                    const normalized = normalizedMap.get(app.id) || normalizedMap.get(app.applicationId);
                    if (normalized) {
                        return { 
                            ...normalized, // Adds: listing, property, normalized property details
                            ...app, // Preserves: original IDs, status, timestamps, user data
                            // Explicitly set IDs from original to ensure consistency
                            id: app.id,
                            applicationInviteId: app.applicationInviteId,
                            propertiesId: app.propertiesId,
                        };
                    }
                    return app;
                };
                
                return {
                    ...data,
                    applications: {
                        ...data.applications,
                        pendingApplications: (data.applications.pendingApplications || []).map(mapApplication),
                        completedApplications: (data.applications.completedApps || []).map(mapApplication),
                        declinedApplications: (data.applications.declinedApplications || []).map(mapApplication),
                        makePaymentApplications: (data.applications.makePaymentApplications || []).map(mapApplication),
                        acceptedApplications: (data.applications.acceptedApplications || []).map(mapApplication),
                        submittedApplications: (data.applications.submittedApplications || []).map(mapApplication),
                        activeApps: (data.applications.activeApps || []).map(mapApplication),
                        invites: (data.applications.invites || []).map(mapApplication),
                    }
                };
            }
            return data;
        },
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
        queryFn: async () => {
            try {
                const data = await allInvites();
                
                // Backend now returns normalized data with `listing` object
                // Only normalize if backend didn't provide listing (for backward compatibility)
                if (data) {
                    const { ViewingInviteNormalizer } = await import('@/lib/utils/ViewingInviteNormalizer');
                    
                    // Collect all invites from all categories for normalization
                    const allInvitesList = [
                        ...(data.pendingInvites || []),
                        ...(data.acceptInvites || []),
                        ...(data.otherInvites || []),
                        ...(data.awaitingFeedbackInvites || []),
                        ...(data.rejectedInvites || []),
                        ...(data.rescheduledInvites || []),
                        ...(data.approvedinvites || []),
                    ];
                    
                    // Normalize all invites (will use backend listing if available, otherwise fetch)
                    const normalized = await ViewingInviteNormalizer.normalizeMany(allInvitesList);
                    
                    // Create lookup map using inviteId for quick access during merge
                    const normalizedMap = new Map(normalized.map(n => [n.inviteId, n]));
                    
                    return {
                        pendingInvites: (data.pendingInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        acceptInvites: (data.acceptInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        otherInvites: (data.otherInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        awaitingFeedbackInvites: (data.awaitingFeedbackInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        rejectedInvites: (data.rejectedInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        rescheduledInvites: (data.rescheduledInvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                        approvedinvites: (data.approvedinvites || []).map((invite: any) => normalizedMap.get(invite.id) || invite),
                    };
                }
                return data;
            } catch (error) {
                console.error('Error fetching invites:', error);
                throw error;
            }
        },
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
        queryFn: async () => {
            const response = await getPropertyByInviteId(id);
            
            // Normalize the invite if it exists
            if (response?.invite) {
                const { ViewingInviteNormalizer } = await import('@/lib/utils/ViewingInviteNormalizer');
                const normalizedInvite = await ViewingInviteNormalizer.normalize(response.invite);
                
                return {
                    ...response,
                    invite: normalizedInvite
                };
            }
            
            return response;
        },
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

export const useUpdateMoveInDate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: UpdateMoveInDatePayload }) => updateMoveInDate(payload.applicationId, payload.data),
        onSuccess: () => {
            keysToInvalidate.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    })
}