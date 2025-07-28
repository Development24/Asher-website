import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { loginUser, logoutUser, refreshToken, getProfile, updateProfile, registerUser, IRegisterPayload, IVerifyEmailPayload, verifyEmail, IResendOTPPayload, resendOTP } from "./auth"
import { useRouter } from "next/navigation"
import { useLoggedOut } from "@/store/userStore"
import { userStore } from "@/store/userStore"
import { toast } from "sonner"


export const useLoginUser = () => {
    const router = useRouter()
    const setUser = userStore((state) => state.setUser)
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem('access_token', data?.token);
            localStorage.setItem('refresh_token', data?.refreshToken);
            setUser(data?.userDetails)
        }
    })
}

export const useLogout = () => {
    const logout = useLoggedOut()
    return useMutation({
        mutationFn: logoutUser,
        onSettled: () => {
            logout()
            toast.success('Logout Success')
        }
    })
}

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    })
}

export const useUpdateProfile = () => {
    const setUser = userStore((state) => state.setUser)
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: any) => updateProfile(payload),
        onSuccess: (data) => {
            setUser(data?.user)
            toast.success('Profile updated')
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn:(payload: IRegisterPayload) => registerUser(payload),
        onSuccess: (data) => {
            toast.success('User registered')
        }
    })
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmail(payload),
    })
}

export const useResendOTP = () => {
    return useMutation({
        mutationFn: (payload: IResendOTPPayload) => resendOTP(payload),
    })
}