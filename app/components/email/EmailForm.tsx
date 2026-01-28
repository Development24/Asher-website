"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bed, Bath } from "lucide-react";
import { EmailSuccessModal } from "./EmailSuccessModal";
import { useSendEmail } from "@/services/email/emailFn";
import { Property } from "@/services/property/types";
import { FormattedPrice } from "@/components/FormattedPrice";
import { inferCurrencyFromProperty } from "@/lib/utils";
import { userStore } from "@/store/userStore";
import { useCreateEnquiry } from "@/services/property/propertyFn";
import { useEnquiryStore } from "@/store/enquiryStore";
import { EnquiryStatusIndicator } from "@/components/EnquiryStatusIndicator";

interface EmailFormProps {
  propertyDetails: any;
}
// propertyDetails?.property = Property

export function EmailForm({ propertyDetails }: EmailFormProps) {
  const router = useRouter();
  const user = userStore((state) => state.user);
  const { hasEnquired, markAsEnquired } = useEnquiryStore();
  
  // Get the correct property ID with fallbacks
  const propertyId = propertyDetails?.id || 
                    propertyDetails?.property?.id || 
                    propertyDetails?.property?.propertyId || 
                    propertyDetails?.propertyId;
  
  const isAlreadyEnquired = hasEnquired(propertyId);

  // Extract listing information based on hierarchy
  const isNormalized = !!propertyDetails?.hierarchy || !!propertyDetails?.listingEntity;
  const listingEntity = propertyDetails?.listingEntity;
  const hierarchy = propertyDetails?.hierarchy;
  const property = propertyDetails?.property;
  
  // Get the correct name: listingEntity name for rooms/units, property name for properties
  const listingName = isNormalized 
    ? (listingEntity?.name || hierarchy?.context?.split(' in ')[0] || property?.name)
    : (propertyDetails?.name || property?.name);
  
  // Get property name for context (show "in {property.name}" for rooms/units)
  const propertyName = property?.name;
  const isRoomOrUnit = hierarchy?.level === 'room' || hierarchy?.level === 'unit';
  
  // Get images: listingEntity images for rooms/units, property images for properties
  const listingImages = isNormalized && listingEntity?.images 
    ? listingEntity.images 
    : (property?.images || propertyDetails?.images || []);
  
  // Get price: listingEntity price for rooms/units, property/listing price for properties
  const listingPrice = isNormalized && listingEntity?.entityPrice
    ? Number(listingEntity.entityPrice)
    : (propertyDetails?.price ? Number(propertyDetails.price) : (property?.price ? Number(property.price) : (property?.rentalFee ? Number(property.rentalFee) : 0)));
  
  // Get currency
  const listingCurrency = inferCurrencyFromProperty(propertyDetails || property);
  
  // Get bedrooms/bathrooms: from listingEntity for rooms, from property/specification for properties
  const bedrooms = isNormalized && isRoomOrUnit
    ? (listingEntity?.bedrooms ?? 0)
    : (property?.bedrooms ?? propertyDetails?.specification?.residential?.bedrooms ?? propertyDetails?.noBedRoom ?? 0);
  
  const bathrooms = isNormalized && isRoomOrUnit
    ? (listingEntity?.bathrooms ?? (listingEntity?.ensuite ? 1 : 0))
    : (property?.bathrooms ?? propertyDetails?.specification?.residential?.bathrooms ?? propertyDetails?.noBathRoom ?? 0);
  
  // Get location
  const location = property?.city && property?.state?.name && property?.country
    ? `${property.city}, ${property.state.name}, ${property.country}`
    : (propertyDetails?.location || property?.address || 'Location');


  if (!propertyId) {
    return (
      <div className="layout">
        <div className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Error</h1>
          <p className="mb-6 text-gray-600">
            Property information is missing. Please go back and try again.
          </p>
          <Button asChild>
            <Link href="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get listingId for form initialization
  const initialListingId = propertyDetails?.listingId || 
                           (isNormalized ? propertyDetails?.id : null) ||
                           propertyDetails?.id;

  const [formData, setFormData] = useState({
    fullName: user?.profile?.firstName + " " + user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phoneNumber || "",
    address: "",
    message: "",
    propertyListingId: initialListingId,
    // unitId: propertyDetails?.unit?.id,
    // roomId: propertyDetails?.room?.id,
  });
  const { mutate: createEnquiry, isPending } = useCreateEnquiry();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const { mutate: sendEmail, isPending } = useSendEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAlreadyEnquired) {
      return; // Prevent duplicate submissions
    }

    // Get listingId: for normalized data, it's at the top level (listingId or id)
    const propertyListingId = propertyDetails?.listingId || 
                              (isNormalized ? propertyDetails?.id : null) ||
                              propertyDetails?.id ||
                              formData.propertyListingId;

    // Get propertyId: the actual property ID (not the listing ID)
    const propertyIdForAPI = property?.id || 
                            propertyDetails?.property?.id || 
                            (hierarchy?.propertyId) ||
                            propertyDetails?.propertyId;

    // Here you would typically send the email
    createEnquiry({
      // event: "sendEmail",
      // senderEmail: formData.email,
      // receiverEmail: propertyDetails?.landlord?.user?.email,
      // subject: "Email from " + formData.fullName,
      message: formData.message,
      propertyListingId: propertyListingId,
      propertyId: propertyIdForAPI,

    }, {
      onSuccess: () => {
        markAsEnquired(propertyId); // Mark as enquired in store
        setShowSuccessModal(true)
        Object.entries(formData).forEach(([key, value]) => {
          setFormData({ ...formData, [key]: "" });
        });
      }
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/property/${propertyId}`);
  };

  // If already enquired, show status instead of form
  if (isAlreadyEnquired) {
    return (
      <div className="layout">
        <div className="flex gap-2 items-center mb-6 text-sm">
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`/property/${propertyId}`}
            className="text-gray-600 hover:text-gray-900"
          >
            Property information
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Email agent</span>
        </div>

        <div className="py-12 mx-auto max-w-2xl text-center">
          <EnquiryStatusIndicator 
            propertyId={propertyId} 
            variant="button" 
            showDate={true}
          />
          <p className="mt-4 mb-6 text-gray-600">
            You have already sent an enquiry for this property. The landlord will get back to you soon.
          </p>
          <Button asChild>
            <Link href={`/property/${propertyId}`}>
              Back to Property
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="flex gap-2 items-center mb-6 text-sm">
        <Link href="/search" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href={`/property/${propertyId}`}
          className="text-gray-600 hover:text-gray-900"
        >
          Property information
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Email agent</span>
      </div>

      <div className="flex flex-col gap-8 justify-between items-center md:flex-row">
        <div className="w-full md:w-1/2">
          <h1 className="mb-6 text-2xl font-bold">Send Enquiry to Landlord</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={formData?.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData?.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message to the landlord here"
                className="min-h-[150px]"
                value={formData?.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                disabled={isPending}
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <LoadingButton loading={isPending} type="submit" className="bg-red-600 hover:bg-red-700" disabled={isPending}>
                {isPending ? (
                  <span className="flex justify-center items-center">
                    <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Enquiry'
                )}
              </LoadingButton>
            </div>
          </form>
        </div>

        <div className="overflow-hidden w-full bg-white rounded-lg border md:w-1/3">
          <div className="relative h-48">
            <Image
              src={listingImages[0]?.url || listingImages[0] || "/placeholder.svg"}
              alt={listingName || "Property"}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold">
              {listingName || "Property"}
            </h2>
            {/* Show property context for rooms/units */}
            {isNormalized && isRoomOrUnit && propertyName && (
              <p className="mb-1 text-sm text-gray-500">
                in {propertyName}
              </p>
            )}
            <p className="mb-2 text-gray-600">{location}</p>
            <div className="flex gap-4 items-center text-sm text-gray-600">
              <span className="flex gap-1 items-center">
                <Bed className="w-4 h-4" />
                {bedrooms} bedroom{bedrooms !== 1 ? 's' : ''}
              </span>
              <span className="flex gap-1 items-center">
                <Bath className="w-4 h-4" />
                {bathrooms} bathroom{bathrooms !== 1 ? 's' : ''}
              </span>
            </div>
            <FormattedPrice
              amount={listingPrice}
              currency={listingCurrency}
              className="mt-4 text-xl font-bold text-red-600"
            />
          </div>
        </div>
      </div>

      <EmailSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}
