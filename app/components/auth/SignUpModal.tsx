"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, X } from "lucide-react";
import { useRegisterUser } from "@/services/auth/authFn";
import { toast } from "sonner";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useAuthRedirectStore } from "@/store/authRedirect";
import { useRouter } from "next/navigation";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onVerificationNeeded: (email: string) => void;
}

const SignUpModal = ({
  isOpen,
  onClose,
  onLoginClick,
  onVerificationNeeded
}: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { mutate: registerUser, isPending } = useRegisterUser();
  const redirectUrl = useAuthRedirectStore((state) => state.redirectUrl);
  const setRedirectUrl = useAuthRedirectStore((state) => state.setRedirectUrl);
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    try {
      // Implement your signup logic here
      registerUser(formData as any, {
        onSuccess: () => {
          onVerificationNeeded(formData.email);
          toast.success("Verification code sent to your email");
          Object.entries(formData).forEach(([key, value]) => {
            setFormData({ ...formData, [key]: "" });
          });
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          Object.entries(formData).forEach(([key, value]) => {
            setFormData({ ...formData, [key]: "" });
          });
        }
      });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleGoogleSuccess = (data: any) => {
    console.log("Google login success:", data);
    onClose();
    if (redirectUrl) {
      router.push(redirectUrl);
      setRedirectUrl(null);
    } else {
      router.push("/dashboard");
    }
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
            className="fixed inset-0 z-50 backdrop-blur-sm bg-background/80"
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="flex fixed inset-0 z-50 justify-center items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Sign up dialog"
          >
            <div className="p-6 w-full max-w-md rounded-lg shadow-lg backdrop-blur-md bg-background/50">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Create an account</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="flex-grow space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="firstName"
                        >
                          First name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="lastName"
                        >
                          Last name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="phone">
                        Phone number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create your password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 text-gray-500 -translate-y-1/2 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) =>
                          setAcceptedTerms(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to terms & conditions
                      </label>
                    </div>
                    <LoadingButton
                      type="submit"
                      disabled={!acceptedTerms}
                      className="w-full !bg-primary hover:bg-primary-dark"
                      loading={isPending}
                    >
                      Sign up
                    </LoadingButton>
                  </form>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="flex absolute inset-0 items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="flex relative justify-center text-sm">
                        <span className="px-2 bg-background text-muted-foreground">
                          or
                        </span>
                      </div>
                    </div>
                    <GoogleLoginButton
                      onSuccess={handleGoogleSuccess}
                      className="mt-4 w-full"
                    >
                      <Image
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Continue with Google
                    </GoogleLoginButton>
                  </div>
                  <p className="mt-6 text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in
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
};
export default SignUpModal;
