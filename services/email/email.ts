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

export const sendEmail = async (data: Partial<SendEmailI>): Promise<SendEmailResponse> => {
    const response = await api.post(URL + emailURL.sendEmail, data)
    return response.data
}

export const getEmails = async (email: string): Promise<GetEmailsResponse> => {
    const response = await api.get(URL + emailURL.getEmails.replace(":email", email))
    return response.data
}


export const getEmailById = async (id: string): Promise<GetEmailByIdResponse> => {
    const response = await api.get(URL + emailURL.getEmailById.replace(":id", id))
    return response.data
}

export const getSentEmails = async (): Promise<GetEmailsResponse> => {
    const response = await api.get(URL + emailURL.getSentEmails)
    return response.data
}

export const getUnreadEmails = async (): Promise<GetEmailsResponse> => {
    const response = await api.get(URL + emailURL.getUnreadEmails)
    return response.data
}

export const readEmail = async (id: string): Promise<ReadEmailResponse> => {
    const response = await api.put(URL + emailURL.readEmail.replace(":id", id))
    return response.data
}


