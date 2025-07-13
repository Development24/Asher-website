import { api } from "@/lib/config/api";

const URL ="api/emails"

const emailURL = {
    sendEmail: "",
    readEmail: "/:id",
    getEmails: "/user/:email/inbox",
    getSentEmails: "/user/sent",
    getUnreadEmails: "/user/unread",
    getEmailById: "/:id",
}

export interface SendEmailI {
    event: string;
    senderEmail: string;
    receiverEmail: string;
    subject: string;
    body: string;
}
// Response types
export interface Email {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface SendEmailResponse {
  message: string;
  email: Email;
}

export interface GetEmailsResponse {
  emails: Email[];
  message?: string;
}

export interface GetEmailByIdResponse {
  email: Email;
  message?: string;
}

export interface ReadEmailResponse {
  message: string;
  email: Email;
}

export interface ForwardEmailPayload {
  emailId: string;
  receiverEmail: string;
  subject?: string;
  body?: string;
  files?: File[];
}

export interface ForwardEmailResponse {
  message: string;
  email: Email;
}

export interface SendOrDraftEmailPayload {
  receiverEmail?: string;
  subject?: string;
  body?: string;
  files?: File[];
  isDraft?: boolean;
}

export interface SendOrDraftEmailResponse {
  message: string;
  email: Email;
}

export interface ReplyToEmailPayload {
  originalEmailId: string;
  additionalMessage: string;
  files?: File[];
}

export interface ReplyToEmailResponse {
  message: string;
  email: Email;
}

export interface UpdateEmailStatePayload {
  id: string;
  isDeleted?: boolean;
  isRead?: boolean;
}

export interface UpdateEmailStateResponse {
  message: string;
  email: Email;
}

export const sendEmail = async (data: Partial<SendEmailI>): Promise<SendEmailResponse> => {
    const response = await api.post(URL + emailURL.sendEmail, data)
    return response.data
}

export const getEmails = async (): Promise<GetEmailsResponse> => {
  const response = await api.get(`/api/emails`);
  // The backend returns { data: [...] }, but the UI expects { emails: [...] }
  return { emails: response.data.data };
};

export const getEmailById = async (id: string): Promise<GetEmailByIdResponse> => {
  const response = await api.get(`/api/emails/${id}`);
  // The backend returns the message directly, not wrapped in 'data'.
  return { email: response.data };
}

export const getSentEmails = async (): Promise<GetEmailsResponse> => {
  const response = await api.get(`/api/emails/user/sent/`);
  return { emails: response.data.data };
};

export const getUnreadEmails = async (): Promise<GetEmailsResponse> => {
  const response = await api.get(`/api/emails/user/unread/`);
  return response.data;
};

export const getDraftEmails = async (): Promise<GetEmailsResponse> => {
  const response = await api.get(`/api/emails/user-mails/categorize?isDraft=true`);
  return response.data;
};

export const readEmail = async (id: string): Promise<ReadEmailResponse> => {
    const response = await api.put(URL + emailURL.readEmail.replace(":id", id))
    return response.data
}

export const forwardEmail = async (
  payload: ForwardEmailPayload
): Promise<ForwardEmailResponse> => {
  const formData = new FormData();
  formData.append("receiverEmail", payload.receiverEmail);
  if (payload.subject) formData.append("subject", payload.subject);
  if (payload.body) formData.append("body", payload.body);
  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }
  const response = await api.post(
    `/api/emails/forward/${payload.emailId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const sendOrDraftEmail = async (
  payload: SendOrDraftEmailPayload
): Promise<SendOrDraftEmailResponse> => {
  const formData = new FormData();
  if (payload.receiverEmail) formData.append("receiverEmail", payload.receiverEmail);
  if (payload.subject) formData.append("subject", payload.subject);
  if (payload.body) formData.append("body", payload.body);
  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }
  if (payload.isDraft) formData.append("isDraft", "true");
  const response = await api.post(`/api/emails/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
};

export const replyToEmail = async (
  payload: ReplyToEmailPayload
): Promise<ReplyToEmailResponse> => {
  const formData = new FormData();
  formData.append("originalEmailId", payload.originalEmailId);
  formData.append("additionalMessage", payload.additionalMessage);
  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }
  const response = await api.post(`/api/emails/reply`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
};

export const updateEmailState = async (
  payload: UpdateEmailStatePayload
): Promise<UpdateEmailStateResponse> => {
  const response = await api.patch(`/api/emails/state/${payload.id}`, { isDeleted: payload.isDeleted });
  return response.data;
};


