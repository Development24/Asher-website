"use client";

import dynamic from "next/dynamic";
const LoginModal = dynamic(() => import("@/app/components/auth/LoginModal").then(mod => mod.default), { ssr: false, loading: () => null });
const SignUpModal = dynamic(() => import("@/app/components/auth/SignUpModal").then(mod => mod.default), { ssr: false, loading: () => null });
const VerificationModal = dynamic(() => import("@/app/components/auth/VerificationModal").then(mod => mod.default), { ssr: false, loading: () => null });
import { EmailForm } from "@/app/components/email/EmailForm";
import { useGetPropertyByIdForListingId } from "@/services/property/propertyFn";
import { userStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmailFormSkeleton } from "@/app/components/email/EmailFormSkeleton";

export default function EmailPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [propertyDetails, setPropertyDetails] = useState<any>(null)
  const user = userStore((state) => state.user);
  const { data: propertyDetails, isFetching } = useGetPropertyByIdForListingId(id as string, !!user);
  // console.log(propertyDetails);
  useEffect(() => {
    const checkAuth = () => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setShowLoginModal(true);
      }
    };
    checkAuth();
  }, [id]);

  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email);
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  if (!propertyDetails || isFetching) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <EmailFormSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
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
      </>
    );
  }

  return <EmailForm propertyDetails={propertyDetails?.property} />;
}
