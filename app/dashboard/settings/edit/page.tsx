"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProfileSuccessModal } from "../components/profile-success-modal";
import { useGetProfile, useUpdateProfile } from "@/services/auth/authFn";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { IUser } from "@/types/types";
import { userStore } from "@/store/userStore";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" }
];

const MARITAL_STATUS_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" }
];

const TITLE_OPTIONS = [
  { value: "MR", label: "Mr." },
  { value: "MRS", label: "Mrs." },
  { value: "MS", label: "Ms." },
  { value: "DR", label: "Dr." }
];

export default function EditProfilePage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: profile, refetch, isFetching } = useGetProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { user, setUser } = userStore();
  const imageRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    taxType: "",
    taxPayerId: "",
    timeZone: "",
    unit: "",
    profileUrl: null as File | null
  });

  useEffect(() => {
    const profileResponse = profile as any;
    const profileData = profileResponse?.data?.data || profileResponse?.data || profileResponse?.profile || profileResponse?.user?.profile;
    
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        ...profileData,
        dateOfBirth: profileData.dateOfBirth?.split("T")[0] || ""
      }));
      if (profileData.profileUrl) {
        setImagePreview(profileData.profileUrl);
      }
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileUrl: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "profileUrl" && value instanceof File) {
          formDataToSend.append("files", value);
        } else if (key !== "profileUrl") {
          formDataToSend.append(key, value.toString());
        }
      }
    });

    updateProfile(formDataToSend, {
      onSuccess: (data: any) => {
        toast.success("Profile updated");
        setShowSuccessModal(true);
        refetch();
        // Handle different response structures
        const updatedProfile = data?.data?.data || data?.data || data?.user || data?.profile;
        if (updatedProfile) {
          setUser({
            ...user,
            profile: updatedProfile
          } as IUser);
        }
      }
    });
  };

  if (isFetching) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto space-y-6 max-w-4xl">
          <div className="flex gap-6 items-center mb-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-48 h-8" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Breadcrumb navigation */}
      <div className="flex gap-2 items-center mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/dashboard/settings"
          className="text-gray-600 hover:text-gray-900"
        >
          Settings
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Edit Profile</span>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="flex gap-6 items-center mb-8">
          <div className="relative w-24 h-24">
            <Image
              src={imagePreview || "https://github.com/shadcn.png"}
              alt="Profile"
              fill
              className="object-cover rounded-full"
              sizes="96px"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
            />
            <input
              id="profile-image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              ref={imageRef}
            />
            <label htmlFor="profile-image">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => imageRef.current?.click()}
                className="absolute right-0 bottom-0 rounded-full cursor-pointer"
              >
                Edit
              </Button>
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Edit your profile</h1>
            <p className="text-gray-500">Update your personal information</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                value={formData.title || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  {TITLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value
                  }))
                }
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    middleName: e.target.value
                  }))
                }
                placeholder="Enter your middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                value={formData.maritalStatus || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, maritalStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value
                  }))
                }
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value
                  }))
                }
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your address"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                placeholder="Enter your state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zip: e.target.value }))
                }
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              placeholder="Enter your country"
            />
          </div>

          {/* Tax Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxType">Tax Type</Label>
              <Input
                id="taxType"
                value={formData.taxType || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, taxType: e.target.value }))
                }
                placeholder="Enter tax type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxPayerId">Tax Payer ID</Label>
              <Input
                id="taxPayerId"
                value={formData.taxPayerId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    taxPayerId: e.target.value
                  }))
                }
                placeholder="Enter tax payer ID"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/settings")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={isPending}
              loading={isPending}
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>

      <ProfileSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
