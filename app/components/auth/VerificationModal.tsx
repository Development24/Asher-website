"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResendOTP, useVerifyEmail } from "@/services/auth/authFn";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export function VerificationModal({
  isOpen,
  onClose,
  email,
  onVerificationSuccess
}: VerificationModalProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail();
  const { mutate: resendOTP, isPending: isResendingOTP } = useResendOTP();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char;
      }
    });
    setCode(newCode);
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    try {
      // Implement your verification logic here
      console.log("Verifying code:", verificationCode);
      verifyEmail(
        { email, code: verificationCode },
        {
          onSuccess: () => {
            setCode(["", "", "", "", "", ""])
            toast.success("Email verified successfully")
            if (onVerificationSuccess) {
              onVerificationSuccess();
              return;
            }
            router.push("/dashboard");
          },
          onError: (error:any) => {
            setCode(["", "", "", "", "", ""])
            toast.error(error.response.data.message)
          }
        }
      );
    } catch (error) {
      setCode(["", "", "", "", "", ""])
      console.error("Verification failed:", error);
    }
  };

  const handleResend = () => {
    console.log("Resending code to:", email);
    resendOTP(
      { email },
      {
        onSuccess: () => {
          setCode(["", "", "", "", "", ""]);
          toast.success("Code resent successfully");
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-background/50 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Verify your email</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4 flex-grow max-h-[90vh] overflow-y-auto">
                  <p className="text-muted-foreground">
                    We've sent a 6-digit verification code to {email}. Enter the
                    code below to confirm your email address.
                  </p>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-12 h-12 text-center text-2xl"
                      />
                    ))}
                  </div>
                  <Button
                    onClick={handleVerify}
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isResendingOTP}
                    loading={isVerifyingEmail}
                  >
                    Verify
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-primary hover:underline font-semibold"
                      disabled={isResendingOTP}
                    >
                      {isResendingOTP ? "Loading..." : "Resend code"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
