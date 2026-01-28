import { useMutation, useQuery } from "@tanstack/react-query"
import { createEmployeeReference, createGuarantorReference, createLandlordReference, getReferences } from "./reference"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export const useCreateLandlordReference = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => createLandlordReference(payload.applicationId, payload.data),
        onSuccess: () => {
            toast.success("Landlord reference created successfully")
            router.replace(`/`)
        },
        onError: () => {
            toast.error("Failed to create landlord reference")
        }
    })
}

export const useCreateGuarantorReference = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => createGuarantorReference(payload.applicationId, payload.data),
        onSuccess: () => {
            toast.success("Guarantor reference created successfully")
            router.replace(`/`)
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.error || 
                                error?.response?.data?.details?.join(', ') ||
                                error?.response?.data?.message ||
                                "Failed to create guarantor reference";
            toast.error(errorMessage);
            console.error("Guarantor reference error:", error?.response?.data);
        }
    })
}

export const useCreateEmployeeReference = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (payload: { applicationId: string, data: any }) => createEmployeeReference(payload.applicationId, payload.data),
        onSuccess: () => {
            toast.success("Employee reference created successfully")
            router.replace(`/`)
        },
        onError: () => {
            toast.error("Failed to create employee reference")
        }
    })
}

export const useGetReferences = (applicationId: string) => {
    return useQuery({
        queryKey: ["references", applicationId],
        queryFn: () => getReferences(applicationId),
        enabled: !!applicationId,
    })
}
