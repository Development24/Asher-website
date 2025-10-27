import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/config/api";
import { userStore } from "@/store/userStore";
import { toast } from "sonner";

// Service function to exchange Google auth code with your backend
async function exchangeGoogleCode(code: string) {
  const res = await api.post("/api/auth/google-auth", {
    code
  });

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(res.data.message || res.data.error || "Google auth failed");
  }

  return res.data;
}

export const useGoogleAuth = () => {
  const setUser = userStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: { code: string }) => exchangeGoogleCode(payload.code),
    onSuccess: (data) => {
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data?.data?.data?.token);
        localStorage.setItem('refresh_token', data?.data?.data?.refreshToken);
      }
      
      // Store user data in the store
      setUser(data?.data?.data?.userDetails);
      
      toast.success("Signed in with Google");
    },
    onError: (error: Error) => {
      console.error("Google auth exchange error:", error);
      toast.error(error.message || "Google authentication failed");
    }
  });
};
