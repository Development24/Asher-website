"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/app/components/auth/LoginModal";
import { SignUpModal } from "@/app/components/auth/SignUpModal";
import { VerificationModal } from "@/app/components/auth/VerificationModal";
import { SuccessModal } from "@/app/components/auth/SuccessModal";
import { userStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

import { Sidebar } from "../dashboard/components/sidebar";
import { Header } from "../dashboard/components/header";
import LoginHeaderItems from "../dashboard/components/LoginHeaderItems";
export function SearchHeader() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const user = userStore((state) => state.user);
  const router = useRouter();

  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email);
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setShowSuccessModal(true);
  };

  return (
    <header className="bg-white border-b">
      <div className=" px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-red-600 font-semibold text-xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
              alt="Asher Home Solution"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <LoginHeaderItems onMenuClick={toggleSidebar} />
            <div className="flex flex-1">
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowLoginModal(true)}
            >
              Sign in
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setShowSignUpModal(true)}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        onVerificationNeeded={handleVerificationNeeded}
      />

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={verificationEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Your account has been successfully created and verified!"
      />
    </header>
  );
}
