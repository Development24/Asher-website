"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bed, Bath } from "lucide-react";
import { EmailSuccessModal } from "./EmailSuccessModal";
import { useSendEmail } from "@/services/email/emailFn";
import { Property } from "@/services/property/types";
import { formatPrice } from "@/lib/utils";
import { userStore } from "@/store/userStore";
import { useCreateEnquiry } from "@/services/property/propertyFn";
interface EmailFormProps {
  propertyDetails: Property;
}

export function EmailForm({ propertyDetails }: EmailFormProps) {
  const router = useRouter();
  const user = userStore((state) => state.user);
  const [formData, setFormData] = useState({
    fullName: user?.profile?.firstName + " " + user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phoneNumber || "",
    address: "",
    message: "",
    propertyId: propertyDetails?.propertyId
  });
  const { mutate: createEnquiry, isPending } = useCreateEnquiry();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const { mutate: sendEmail, isPending } = useSendEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email
    console.log("Sending email:", formData);
    createEnquiry({
      // event: "sendEmail",
      // senderEmail: formData.email,
      // receiverEmail: propertyDetails?.landlord?.user?.email,
      // subject: "Email from " + formData.fullName,
      message: formData.message,
      propertyListingId: propertyDetails?.listingId
    }, {
      onSuccess: () => {
        setShowSuccessModal(true)
        Object.entries(formData).forEach(([key, value]) => {
          setFormData({ ...formData, [key]: "" });
        });
      }
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/property/${propertyDetails?.propertyId}`);
  };

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/search" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href={`/property/${propertyDetails?.propertyId}`}
          className="text-gray-600 hover:text-gray-900"
        >
          Property information
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Email agent</span>
      </div>

      <div className="flex items-center justify-between gap-8 flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-6">Send Enquiry to Landlord</h1>
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
              <Button loading={isPending} type="submit" className="bg-red-600 hover:bg-red-700">
                Send Enquiry
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden w-full md:w-1/3">
          <div className="relative h-48">
            <Image
              src={propertyDetails?.images[0]?.url || "/placeholder.svg"}
              alt={propertyDetails?.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              {propertyDetails?.name}
            </h2>
            <p className="text-gray-600 mb-2">{`${propertyDetails?.city} ${propertyDetails?.state?.name} ${propertyDetails?.country}`}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {propertyDetails?.bedrooms} bedrooms
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {propertyDetails?.bathrooms} bathrooms
              </span>
            </div>
            <div className="mt-4 text-xl font-bold text-red-600">{`${formatPrice(
              Number(propertyDetails?.price)
            )}`}</div>
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
