"use client";

import { useEnquiryStore } from "@/store/enquiryStore";
import { useState } from "react";

interface UseEnquiryActionsProps {
  propertyId: string;
  onEnquirySuccess?: () => void;
  onChatSuccess?: () => void;
}

export function useEnquiryActions({ 
  propertyId, 
  onEnquirySuccess, 
  onChatSuccess 
}: UseEnquiryActionsProps) {
  const { hasEnquired, hasChatted, markAsEnquired, markAsChatted } = useEnquiryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEnquired = hasEnquired(propertyId);
  const isChatted = hasChatted(propertyId);

  const handleEnquirySubmit = async (enquiryData: any) => {
    if (isEnquired) return; // Prevent duplicate submissions
    
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to submit the enquiry
      // For now, we'll just mark it as enquired
      markAsEnquired(propertyId);
      onEnquirySuccess?.();
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatInitiate = async () => {
    if (isChatted) return; // Prevent duplicate chat initiation
    
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to initiate chat
      // For now, we'll just mark it as chatted
      markAsChatted(propertyId);
      onChatSuccess?.();
    } catch (error) {
      console.error('Failed to initiate chat:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnquiryButtonProps = () => {
    if (isEnquired) {
      return {
        disabled: true,
        children: "Enquiry Sent",
        className: "bg-gray-100 text-gray-500 cursor-not-allowed"
      };
    }

    return {
      disabled: isSubmitting,
      children: isSubmitting ? "Sending..." : "Send Enquiry",
      className: "bg-primary-600 hover:bg-primary-700 text-white"
    };
  };

  const getChatButtonProps = () => {
    if (isChatted) {
      return {
        disabled: true,
        children: "Chat in Progress",
        className: "bg-gray-100 text-gray-500 cursor-not-allowed"
      };
    }

    return {
      disabled: isSubmitting,
      children: isSubmitting ? "Connecting..." : "Chat with Landlord",
      className: "bg-green-600 hover:bg-green-700 text-white"
    };
  };

  return {
    isEnquired,
    isChatted,
    isSubmitting,
    handleEnquirySubmit,
    handleChatInitiate,
    getEnquiryButtonProps,
    getChatButtonProps
  };
} 