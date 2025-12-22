"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bed, Bath, X } from "lucide-react";
import { EmailSuccessModal } from "./EmailSuccessModal";
import { useCreateEnquiry } from "@/services/property/propertyFn";
import { Property } from "@/services/property/types";
import { formatPrice } from "@/lib/utils";
import { userStore } from "@/store/userStore";
import { useEnquiryStore } from "@/store/enquiryStore";
import { EnquiryStatusIndicator } from "@/components/EnquiryStatusIndicator";
import { displayImages } from "@/app/property/[id]/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface EmailFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyDetails: any;
}

export function EmailFormModal({ isOpen, onClose, propertyDetails }: EmailFormModalProps) {
  const user = userStore((state) => state.user);
  const { hasEnquired, markAsEnquired } = useEnquiryStore();
  
  // Get the correct property ID with fallbacks
  const propertyId = propertyDetails?.id || 
                    propertyDetails?.property?.id || 
                    propertyDetails?.property?.propertyId || 
                    propertyDetails?.propertyId;
  
  const isAlreadyEnquired = hasEnquired(propertyId);

  const [formData, setFormData] = useState({
    fullName: user?.profile?.firstName + " " + user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phoneNumber || "",
    address: "",
    message: "",
    propertyListingId: propertyDetails?.id,
  });
  
  const { mutate: createEnquiry, isPending } = useCreateEnquiry();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAlreadyEnquired) {
      return; // Prevent duplicate submissions
    }

    // Debug logging to understand the property structure
    console.log('EmailFormModal propertyDetails:', propertyDetails);
    console.log('EmailFormModal propertyId:', propertyId);

    // The property data structure is: data?.property?.property
    // So propertyDetails should contain the property object
    const propertyListingId = propertyDetails?.listingId

    // Also try to get the propertyId field
    const propertyIdForAPI = propertyDetails?.property?.id || 
                            propertyDetails?.property?.propertyId || 
                            propertyDetails?.id || 
                            propertyDetails?.propertyId;

    console.log('EmailFormModal propertyListingId being sent:', propertyListingId);
    console.log('EmailFormModal propertyIdForAPI being sent:', propertyIdForAPI);

    // If we don't have a valid property ID, show an error
    if (!propertyListingId) {
      console.error('No valid property ID found in propertyDetails:', propertyDetails);
      // You might want to show an error message to the user here
      return;
    }

    createEnquiry({
      message: formData.message,
      propertyListingId: propertyListingId,
      propertyId: propertyIdForAPI, // Add this field as well
    }, {
      onSuccess: () => {
        markAsEnquired(propertyId); // Mark as enquired in store
        setShowSuccessModal(true);
        Object.entries(formData).forEach(([key, value]) => {
          setFormData({ ...formData, [key]: "" });
        });
      },
      onError: (error) => {
        console.error('Enquiry submission failed:', error);
        // You might want to show an error message to the user here
      }
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the modal after success
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  // If already enquired, show status instead of form
  if (isAlreadyEnquired) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-6 w-full max-w-md bg-white rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Enquiry Status</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="p-0 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="py-6 text-center">
                <EnquiryStatusIndicator 
                  propertyId={propertyId} 
                  variant="button" 
                  showDate={true}
                />
                <p className="mt-4 mb-6 text-gray-600">
                  You have already sent an enquiry for this property. The landlord will get back to you soon.
                </p>
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Send Enquiry to Landlord</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-0 w-8 h-8"
                disabled={isPending}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6">
              {/* Property Preview */}
              <div className="flex gap-4 items-start p-4 mb-6 bg-gray-50 rounded-lg">
                <div className="relative flex-shrink-0 w-20 h-20">
                  <Image
                    src={displayImages(propertyDetails?.property?.images || propertyDetails?.images)[0] || "/placeholder.svg"}
                    alt={propertyDetails?.property?.name || propertyDetails?.name || "Property"}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {propertyDetails?.property?.name || propertyDetails?.name || "Property"}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {propertyDetails?.property?.location || propertyDetails?.location || "Location"}
                  </p>
                  <div className="flex gap-4 items-center mt-2 text-sm text-gray-600">
                    <span className="flex gap-1 items-center">
                      <Bed className="w-4 h-4" />
                      {propertyDetails?.property?.noBedRoom || propertyDetails?.noBedRoom || 0} bed
                    </span>
                    <span className="flex gap-1 items-center">
                      <Bath className="w-4 h-4" />
                      {propertyDetails?.property?.noBathRoom || propertyDetails?.noBathRoom || 0} bath
                    </span>
                    <span className="font-semibold text-primary-600">
                      {formatPrice(propertyDetails?.property?.rentalFee || propertyDetails?.rentalFee || 0, propertyDetails?.property?.currency || propertyDetails?.currency || 'USD')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={formData?.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData?.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Current address</Label>
                    <Input
                      id="address"
                      value={formData?.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message to landlord</Label>
                  <Textarea
                    id="message"
                    value={formData?.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell the landlord about your interest in this property..."
                    rows={4}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? "Sending..." : "Send Enquiry"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <EmailSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
        />
      )}
    </AnimatePresence>
  );
} 