import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getEmails, getSentEmails, getUnreadEmails, getEmailById, sendEmail, SendEmailI, forwardEmail, ForwardEmailPayload, ForwardEmailResponse, sendOrDraftEmail, SendOrDraftEmailPayload, SendOrDraftEmailResponse, replyToEmail, ReplyToEmailPayload, ReplyToEmailResponse, updateEmailState, UpdateEmailStatePayload, UpdateEmailStateResponse, getDraftEmails } from "./email"
import { toast } from "sonner"

export const useGetEmails = () => {
    return useQuery({
        queryKey: ["emails"],
        queryFn: getEmails,
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
    queryFn: getUnreadEmails,
    retry: false,
  });
};

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

export const useForwardEmail = () => {
  const queryClient = useQueryClient();
  return useMutation<ForwardEmailResponse, unknown, ForwardEmailPayload>({
    mutationFn: forwardEmail,
    onSuccess: () => {
      toast.success("Email forwarded successfully");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: () => {
      toast.error("Failed to forward email");
    },
  });
};

export const useSendOrDraftEmail = () => {
  const queryClient = useQueryClient();
  return useMutation<SendOrDraftEmailResponse, unknown, SendOrDraftEmailPayload>({
    mutationFn: sendOrDraftEmail,
    onSuccess: () => {
      toast.success("Email sent successfully");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: () => {
      toast.error("Failed to send email");
    },
  });
};

export const useReplyToEmail = () => {
  const queryClient = useQueryClient();
  return useMutation<ReplyToEmailResponse, unknown, ReplyToEmailPayload>({
    mutationFn: replyToEmail,
    onSuccess: () => {
      toast.success("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: () => {
      toast.error("Failed to send reply");
    },
  });
};

export const useUpdateEmailState = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateEmailStateResponse, unknown, UpdateEmailStatePayload>({
    mutationFn: updateEmailState,
    onSuccess: (data) => {
      if (data && (data.message || data.email)) {
        toast.success("Email deleted successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: () => {
      toast.error("Failed to delete email");
    },
  });
};

export const useGetDraftEmails = () => {
  return useQuery({
    queryKey: ["draftEmails"],
    queryFn: getDraftEmails,
    retry: false,
  });
};

