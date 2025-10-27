"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { useGoogleAuth } from "@/services/auth/googleAuthFn";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface GoogleLoginButtonProps {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  className,
  children
}: GoogleLoginButtonProps) {
  const { mutate: mutateGoogle, isPending } = useGoogleAuth();
  const searchParams = useSearchParams();
  const processedCode = useRef<string | null>(null);

  // Handle redirect flow - check for code in URL params (fallback for when popup is blocked)
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && code !== processedCode.current) {
      processedCode.current = code; // Mark this code as processed
      
      // Add a small delay to ensure the modal is visible before processing
      setTimeout(() => {
        mutateGoogle(
          { code },
          {
            onSuccess: (data) => {
              onSuccess?.(data);
            },
            onError: (error) => {
              onError?.(error);
            }
          }
        );
      }, 1000); // 1 second delay
    }
  }, [searchParams, mutateGoogle, onSuccess, onError]);

  const handleGoogleLogin = useGoogleLogin({
    scope: "openid profile email",
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: (tokenResponse) => {
      if (tokenResponse.code) {
        mutateGoogle(
          { code: tokenResponse.code },
          {
            onSuccess: (data) => {
              onSuccess?.(data);
            },
            onError: (error) => {
              onError?.(error);
            }
          }
        );
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed");
      onError?.(new Error(error.error_description || error.error || "Google login failed"));
    }
  });

  return (
    <Button
      onClick={() => handleGoogleLogin()}
      disabled={isPending}
      className={className}
      variant="outline"
    >
      {isPending ? "Signing in..." : children || "Continue with Google"}
    </Button>
  );
}
