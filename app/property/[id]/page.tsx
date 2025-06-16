"use client";

import { AuthPromptModal } from "@/app/components/auth/AuthPromptModal";
import { LoginModal } from "@/app/components/auth/LoginModal";
import { SignUpModal } from "@/app/components/auth/SignUpModal";
import { VerificationModal } from "@/app/components/auth/VerificationModal";
import { ChatModal } from "@/app/components/chat/ChatModal";
import { PreChatModal } from "@/app/components/chat/PreChatModal";
import { LandlordProfileModal } from "@/app/components/modals/landlord-profile-modal";
import { SaveModal } from "@/app/components/modals/save-modal";
import { ShareModal } from "@/app/components/modals/share-modal";
import SimilarPropertyCard from "@/app/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  useGetProperties,
  useGetPropertyById
} from "@/services/property/propertyFn";
import { Listing, Property } from "@/services/property/types";
import { userStore } from "@/store/userStore";
import cn from "classnames";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MapPin,
  Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthRedirectStore } from "@/store/authRedirect";
import { displayImages, filteredImageUrls, ImageObject } from "./utils";

const propertyImages = [
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_01_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_02_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_03_0000.jpeg",
  "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_05_0000.jpeg"
];

const properties = [
  {
    id: 1,
    image:
      "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_01_0000.jpeg",
    title: "Rosewood Apartments",
    price: "250,000",
    location: "12 Oak Lane, Lagos, Nigeria",
    specs: {
      size: "6x8 m²",
      bedrooms: 3,
      bathrooms: 2
    },
    description:
      "This modern 3-bedroom apartment blends style and comfort, offering an ideal urban retreat. With a spacious open-plan design, it boasts a sleek, fully equipped kitchen perfect for cooking enthusiasts, and a bright living area that opens onto a private balcony. The master suite includes an en-suite bathroom. Situated near top restaurants, schools, and transport, the property provides a balanced mix of convenience and sophistication.",
    agent: {
      name: "Adam Alekind",
      image: "/placeholder.svg",
      isOnline: false
    }
  },
  {
    id: 2,
    image:
      "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_02_0000.jpeg",
    title: "Maple Ridge Homes",
    price: "280,000",
    location: "15 Elm Street, Lagos, Nigeria",
    specs: {
      size: "7x9 m²",
      bedrooms: 4,
      bathrooms: 3
    },
    description:
      "Maple Ridge Homes offers a luxurious 4-bedroom residence perfect for families. This spacious home features a gourmet kitchen, formal dining room, and a cozy family room with a fireplace. The master suite boasts a walk-in closet and a spa-like bathroom. With a large backyard and a two-car garage, this property provides ample space for both relaxation and entertainment.",
    agent: {
      name: "Adam Alekind",
      image: "/placeholder.svg",
      isOnline: true
    }
  },
  {
    id: 3,
    image:
      "https://media.rightmove.co.uk/17k/16023/156966407/16023_1310013_IMG_03_0000.jpeg",
    title: "Sunflower Residences",
    price: "220,000",
    location: "8 Sunflower Avenue, Lagos, Nigeria",
    specs: {
      size: "5x7 m²",
      bedrooms: 2,
      bathrooms: 2
    },
    description:
      "Sunflower Residences presents a charming 2-bedroom apartment ideal for young professionals or small families. This modern unit features an open-concept living and dining area, a well-appointed kitchen, and a private balcony offering city views. The complex includes amenities such as a fitness center and a communal garden, providing a perfect balance of comfort and community living.",
    agent: {
      name: "Adam Alekind",
      image: "/placeholder.svg",
      isOnline: false
    }
  }
];

const landlordProperties = [
  {
    id: 1,
    title: "Rosewood Apartments",
    image:
      "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
    price: "280,000",
    location: "12 Oak Lane, Lagos, Nigeria",
    specs: {
      size: "120 sq. ft",
      bedrooms: 3,
      bathrooms: 2
    }
  },
  {
    id: 2,
    title: "Maple Ridge Homes",
    image:
      "https://cdn.pixabay.com/photo/2017/07/08/02/16/house-2483336_1280.jpg",
    price: "320,000",
    location: "15 Elm Street, Lagos, Nigeria",
    specs: {
      size: "150 sq. ft",
      bedrooms: 4,
      bathrooms: 3
    }
  }
  // Add more properties as needed...
];

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarIndex, setSimilarIndex] = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPreChatModal, setShowPreChatModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLandlordProfile, setShowLandlordProfile] = useState(false);

  const user = userStore((state) => state.user);
  const setRedirectUrl = useAuthRedirectStore((state) => state.setRedirectUrl);
  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties;

  const { data, isFetching } = useGetPropertyById(id as string);
  console.log(data);
  const propertyData: Property = data?.property;

  // useEffect(() => {
  //   // const selectedProperty = properties.find((p) => p.id.toString() === id);
  //   // setProperty(selectedProperty || null);

  //   // Simulating an authentication check
  //   const checkAuth = () => {
  //     const isAuth = localStorage.getItem("isAuthenticated") === "true";
  //     setIsAuthenticated(isAuth);
  //   };
  //   checkAuth();
  // }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + propertyImages.length) % propertyImages.length
    );
  };

  const nextSimilar = () => {
    setSimilarIndex((prev) => (prev + 1) % similarProperties?.length);
  };

  const prevSimilar = () => {
    setSimilarIndex(
      (prev) =>
        (prev - 1 + similarProperties?.length) % similarProperties?.length
    );
  };

  const handleContactClick = (type: "chat" | "email") => {
    if (!user) {
      if (type === "email") {
        setRedirectUrl(`/property/${propertyData?.propertyId}/email`);
      } else {
        setRedirectUrl(`/property/${propertyData?.propertyId}/chat`);
      }
      setShowAuthPrompt(true);
      return;
    }

    if (type === "email") {
      router.push(`/property/${propertyData?.propertyId}/email`);
    } else {
      setShowPreChatModal(true);
    }
  };

  const handlePreChatSubmit = (data: {
    fullName: string;
    email: string;
    phone?: string;
  }) => {
    console.log("Pre-chat data:", data);
    setShowPreChatModal(false);
    setShowChatModal(true);
  };

  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email);
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setShowLoginModal(true);
    // router.push(`/property/${propertyData?.id}/email`);
  };

  const isLoading = isFetching || isFetchingProperties;

  if (isLoading || !propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-[1400px] mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <Skeleton className="w-24 h-10 mb-4" /> {/* Back button */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-20 h-4" /> {/* Breadcrumb */}
          </div>
          {/* Image Gallery Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Skeleton className="w-full h-[500px] rounded-lg" />{" "}
              {/* Main image */}
            </div>
            <div className="grid grid-rows-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="w-full h-[158px] rounded-lg"
                /> /* Thumbnail images */
              ))}
            </div>
          </div>
          {/* Property Info Skeleton */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Skeleton className="w-64 h-8 mb-2" /> {/* Title */}
                  <Skeleton className="w-48 h-4" /> {/* Location */}
                </div>
              </div>
              <Skeleton className="w-40 h-8 mb-6" /> {/* Price */}
              {/* Description Skeleton */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="w-32 h-6 mb-4" />
                  <Skeleton className="w-full h-24" />
                </div>

                {/* Features Skeleton */}
                <div>
                  <Skeleton className="w-48 h-6 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="w-full h-6" />
                    ))}
                  </div>
                </div>

                {/* Location Skeleton */}
                <div>
                  <Skeleton className="w-36 h-6 mb-4" />
                  <Skeleton className="w-full h-[200px] mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Card Skeleton */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-32 h-5 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="w-full h-10 mb-4" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          </div>
          {/* Similar Properties Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-48 h-8" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-[400px] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/dashboard/search")}
      >
        ← Back to search
      </Button>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/search"
          className="text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 dark:text-white">
          Property Information
        </span>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative rounded-lg overflow-hidden">
          <Image
            src={
              displayImages(propertyData?.images)[currentImageIndex] ||
              "/placeholder.svg"
            }
            alt="Property main image"
            width={800}
            height={600}
            className="w-full h-[500px] object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-rows-3 gap-4">
          {displayImages(propertyData?.images)
            .slice(1, 4)
            .map((image: string, index: number) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Property image ${index + 2}`}
                  width={400}
                  height={300}
                  className="w-full h-[158px] object-cover"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Property Info */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{propertyData?.name}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                {`${propertyData?.city}, ${propertyData?.state?.name} ${propertyData?.country}, ${propertyData?.zipcode}`}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSaveModal(true)}
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-3xl font-bold mb-6">
            {formatPrice(Number(propertyData?.price))}{" "}
            <span className="text-base font-normal text-gray-600 dark:text-gray-400">
              {propertyData?.priceFrequency === "MONTHLY"
                ? "per month"
                : "per year"}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {propertyData?.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                About this property
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Bedrooms: {propertyData?.bedrooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Bathrooms: {propertyData?.bathrooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Area: {propertyData?.totalArea}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>
                    Pets Allowed: {propertyData?.petsAllowed ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>
                    Communal garden:{" "}
                    {propertyData?.communalGarden ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Balcony: {propertyData?.balcony ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>
                    Parking space/Garage:{" "}
                    {propertyData?.parkingSpace ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>
                    Open-concept living and dining area:{" "}
                    {propertyData?.openConcept ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Location on map</h2>
              <div className="h-[300px] rounded-lg mb-4 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {propertyData?.location || "Property location"}
                  </div>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() =>
                      window.open(
                        `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                          propertyData?.location || ""
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    View on OpenStreetMap
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Nearest stations</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Vauxhall Station - 0.7 miles</div>
                    <div>Fulham Broadway - 0.8 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nearest schools</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nearest malls</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Clapham Junction - 0.9 miles</div>
                    <div>Clapham Junction - 0.9 miles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full relative",
                    "ring-2",
                    propertyData?.landlord?.isActive
                      ? "ring-red-500"
                      : "ring-gray-300"
                  )}
                >
                  <Image
                    src={propertyData?.landlord?.image || "/placeholder.svg"}
                    alt={propertyData?.landlord?.name || ""}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {true && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div className="font-semibold max-w-[150px] line-clamp-1">
                  {`${propertyData?.landlord?.user?.profile?.firstName} ${propertyData?.landlord?.user?.profile?.lastName}`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Landlord
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="ml-auto"
                onClick={() => setShowLandlordProfile(true)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white mb-4"
              onClick={() => handleContactClick("chat")}
            >
              Chat with landlord
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleContactClick("email")}
            >
              Enquire about this property
            </Button>

            <LandlordProfileModal
              isOpen={showLandlordProfile}
              onClose={() => setShowLandlordProfile(false)}
              landlord={{
                name: `${propertyData?.landlord?.user?.profile?.firstName} ${propertyData?.landlord?.user?.profile?.lastName}`,
                email: propertyData?.landlord?.user?.email,
                image: propertyData?.landlord?.image,
                id: propertyData?.landlord?.id,
                isActive: propertyData?.landlord?.isActive
              }}
              onChatClick={() => handleContactClick("chat")}
              onEmailClick={() => handleContactClick("email")}
            />
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Similar properties</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSimilar}
              className="hover:bg-red-600 hover:text-white"
              disabled={similarIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSimilar}
              className="hover:bg-red-600 hover:text-white"
              disabled={similarIndex >= (similarProperties?.length || 0) - 3}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-5 w-full"
            initial={false}
            animate={{ x: `${-similarIndex * (100 / 4)}%` }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.5
            }}
          >
            {similarProperties
              ?.filter((p) => p.id !== propertyData?.id)
              ?.map((similarProperty) => (
                <div key={similarProperty.id}>
                  <SimilarPropertyCard property={similarProperty} />
                </div>
              ))}
          </motion.div>
        </div>
      </div>

      <PreChatModal
        isOpen={showPreChatModal}
        onClose={() => setShowPreChatModal(false)}
        onSubmit={handlePreChatSubmit}
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        landlord={{
          name: `${propertyData?.landlord?.user?.profile?.firstName} ${propertyData?.landlord?.user?.profile?.lastName}`,
          image: propertyData?.landlord?.image || "",
          role: "Landlord",
          id: propertyData?.landlord?.userId
        }}
        propertyId={Number(id)}
      />

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onSignIn={() => {
          setShowAuthPrompt(false);
          setShowLoginModal(true);
        }}
        onSignUp={() => {
          setShowAuthPrompt(false);
          setShowSignUpModal(true);
        }}
      />

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
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        propertyTitle={propertyData?.name}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        propertyTitle={propertyData?.name}
        propertyUrl={`${window.location.origin}/property/${id}`}
      />
    </div>
  );
}
