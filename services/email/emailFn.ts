import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getEmails, getSentEmails, getUnreadEmails, getEmailById, sendEmail, SendEmailI } from "./email"
import { toast } from "sonner"

export const useGetEmails = (email: string) => {
    return useQuery({
        queryKey: ["emails", email],
        queryFn: () => getEmails(email),
        retry: false,
    })
}

export const useGetSentEmails = () => {
    return useQuery({
        queryKey: ["sentEmails"],
        queryFn: () => getSentEmails(),
        retry: false,
    })
}

export const useGetUnreadEmails = () => {
    return useQuery({
        queryKey: ["unreadEmails"],
        queryFn: () => getUnreadEmails(),
        retry: false,
    })
}

export const useGetEmailById = (id: string) => {
    return useQuery({
        queryKey: ["emailById", id],
        queryFn: () => getEmailById(id),
        retry: false,
        enabled: !!id,
    })
}
export const useSendEmail = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<SendEmailI>) => sendEmail(data),
        onSuccess: () => {
            toast.success("Email sent successfully")
            queryClient.invalidateQueries({ queryKey: ["emails"] })
        },
        onError: () => {
            toast.error("Failed to send email")
        }
    })
}

