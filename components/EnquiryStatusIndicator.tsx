"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageSquare, Clock } from "lucide-react";
import { useEnquiryStore } from "@/store/enquiryStore";
import { format } from "date-fns";

interface EnquiryStatusIndicatorProps {
  propertyId: string;
  variant?: "badge" | "button" | "text";
  showDate?: boolean;
}

export function EnquiryStatusIndicator({ 
  propertyId, 
  variant = "badge",
  showDate = false 
}: EnquiryStatusIndicatorProps) {
  const { hasEnquired, hasChatted, getEnquiryState } = useEnquiryStore();
  const enquiryState = getEnquiryState(propertyId);

  if (!enquiryState) return null;

  const isEnquired = hasEnquired(propertyId);
  const isChatted = hasChatted(propertyId);

  if (variant === "badge") {
    if (isChatted) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <MessageSquare className="w-3 h-3 mr-1" />
          Chat Initiated
          {showDate && enquiryState.lastChatDate && (
            <span className="ml-1 text-xs">
              {format(new Date(enquiryState.lastChatDate), "MMM dd")}
            </span>
          )}
        </Badge>
      );
    }

    if (isEnquired) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Enquiry Sent
          {showDate && enquiryState.enquiryDate && (
            <span className="ml-1 text-xs">
              {format(new Date(enquiryState.enquiryDate), "MMM dd")}
            </span>
          )}
        </Badge>
      );
    }
  }

  if (variant === "button") {
    if (isChatted) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
          <MessageSquare className="w-4 h-4" />
          <span>Chat in progress</span>
          {showDate && enquiryState.lastChatDate && (
            <span className="text-xs text-green-600">
              {format(new Date(enquiryState.lastChatDate), "MMM dd")}
            </span>
          )}
        </div>
      );
    }

    if (isEnquired) {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
          <CheckCircle className="w-4 h-4" />
          <span>Enquiry sent</span>
          {showDate && enquiryState.enquiryDate && (
            <span className="text-xs text-blue-600">
              {format(new Date(enquiryState.enquiryDate), "MMM dd")}
            </span>
          )}
        </div>
      );
    }
  }

  if (variant === "text") {
    if (isChatted) {
      return (
        <div className="flex items-center gap-1 text-sm text-green-700">
          <MessageSquare className="w-3 h-3" />
          <span>Chat initiated</span>
          {showDate && enquiryState.lastChatDate && (
            <span className="text-xs text-green-600">
              {format(new Date(enquiryState.lastChatDate), "MMM dd")}
            </span>
          )}
        </div>
      );
    }

    if (isEnquired) {
      return (
        <div className="flex items-center gap-1 text-sm text-blue-700">
          <CheckCircle className="w-3 h-3" />
          <span>Enquiry sent</span>
          {showDate && enquiryState.enquiryDate && (
            <span className="text-xs text-blue-600">
              {format(new Date(enquiryState.enquiryDate), "MMM dd")}
            </span>
          )}
        </div>
      );
    }
  }

  return null;
} 