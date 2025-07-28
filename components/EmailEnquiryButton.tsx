"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEmailFormModal } from "@/hooks/useEmailFormModal";
import { EmailFormModal } from "@/app/components/email/EmailFormModal";
import { useEnquiryStore } from "@/store/enquiryStore";
import { EnquiryStatusIndicator } from "@/components/EnquiryStatusIndicator";

interface EmailEnquiryButtonProps {
  propertyDetails: any;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function EmailEnquiryButton({ 
  propertyDetails, 
  variant = "default",
  size = "default",
  className = "",
  children 
}: EmailEnquiryButtonProps) {
  const { isEmailModalOpen, selectedProperty, openEmailModal, closeEmailModal } = useEmailFormModal();
  const { hasEnquired } = useEnquiryStore();
  
  // Get the correct property ID with fallbacks
  const propertyId = propertyDetails?.id || 
                    propertyDetails?.property?.id || 
                    propertyDetails?.property?.propertyId || 
                    propertyDetails?.propertyId;
  
  const isAlreadyEnquired = hasEnquired(propertyId);

  const handleClick = () => {
    if (!isAlreadyEnquired) {
      openEmailModal(propertyDetails);
    }
  };

  // If already enquired, show status indicator instead of button
  if (isAlreadyEnquired) {
    return (
      <div className="flex items-center gap-2">
        <EnquiryStatusIndicator 
          propertyId={propertyId} 
          variant="badge" 
          showDate={true}
        />
      </div>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        <Mail className="w-4 h-4 mr-2" />
        {children || "Send Enquiry"}
      </Button>

      <EmailFormModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        propertyDetails={selectedProperty}
      />
    </>
  );
} 