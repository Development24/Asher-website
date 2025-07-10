import { api, apiFormData } from "@/lib/config/api";

const URL = 'api/auth'
const profileURL = 'api/profile'
const authURL = {
    login: "/login",
    register: "/register",
    logout:"/logout",
    refreshToken: "/refresh-token",
    verifyEmail: "/verify",
    resendOTP: "/reset-code"
}

export type IRegisterPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userDetails: import("@/types/types").IUser;
}

export interface RegisterResponse {
  message: string;
  user: import("@/types/types").IUser;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  user: import("@/types/types").IUser;
}

export interface UpdateProfileResponse {
  message: string;
  user: import("@/types/types").IUser;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendOTPResponse {
  message: string;
}

export const registerUser = async (payload: IRegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post(URL + authURL.register, payload)
    return response.data
}

export type ILoginPayload = {
    email: string;
    password: string;
}

export const loginUser = async (payload: ILoginPayload): Promise<AuthResponse> => {
    const response = await api.post(URL + authURL.login, payload)
    return response.data
}

export const logoutUser = async (): Promise<LogoutResponse> => {
    const response = await api.post(URL + authURL.logout)
    return response.data
}

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post(URL + authURL.refreshToken, { refreshToken })
    return response.data
}

export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get(profileURL)
    return response.data
}

export const updateProfile = async (payload: any): Promise<UpdateProfileResponse> => {
    const response = await apiFormData.post(profileURL + "/update", payload)
    return response.data
}

export type IVerifyEmailPayload = {
    email: string;
    code: string;
}

export const verifyEmail = async (payload: IVerifyEmailPayload): Promise<VerifyEmailResponse> => {
    const response = await api.post(URL + authURL.verifyEmail, payload)
    return response.data
}

export type IResendOTPPayload = {
    email: string;
}

export const resendOTP = async (payload: IResendOTPPayload): Promise<ResendOTPResponse> => {
    const response = await api.post(URL + authURL.resendOTP, payload)
    return response.data
}