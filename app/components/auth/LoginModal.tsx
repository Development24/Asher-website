"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { useLoginUser } from "@/services/auth/authFn";
import { toast } from "sonner";
import { useAuthRedirectStore } from "@/store/authRedirect";
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

const LoginModal = ({
  isOpen,
  onClose,
  onSignUpClick
}: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = useAuthRedirectStore((state) => state.redirectUrl);
  const setRedirectUrl = useAuthRedirectStore((state) => state.setRedirectUrl);
  const router = useRouter();

  const { mutate: loginUser, isPending: isLoading } = useLoginUser();

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
    try {
      loginUser(
        { email, password },
        {
          onSuccess: () => {
            if (redirectUrl) {
              router.push(redirectUrl);
              setRedirectUrl(null);
            } else {
              router.push("/dashboard");
            }
          },
          onError: () => {
            toast.error("Login failed");
          }
        }
      );
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
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
            role="dialog"
            aria-modal="true"
            aria-label="Login dialog"
          >
            <div className="bg-background/50 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Welcome back</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <LoadingButton
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark"
                      disabled={!email || !password}
                      loading={isLoading}
                    >
                      Sign in
                    </LoadingButton>
                  </form>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background text-muted-foreground">
                          or
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleGoogleLogin}
                    >
                      <Image
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Continue with Google
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={onSignUpClick}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign up
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
export default LoginModal;
