"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Mail,
  MessageSquare,
  Bed,
  Bath,
  Home,
  FileText,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listing } from "@/services/property/types";
import { useGetProperties } from "@/services/property/propertyFn";
import { useGetPropertyById } from "@/services/property/propertyFn";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import { LandlordProfileModal } from "@/app/components/modals/landlord-profile-modal";
import { userStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ChatModal } from "@/app/components/chat/ChatModal";
import { PreChatModal } from "@/app/components/chat/PreChatModal";

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

export default function SuccessPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLandlordProfile, setShowLandlordProfile] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPreChatModal, setShowPreChatModal] = useState(false);

  const router = useRouter();
  const user = userStore((state) => state.user);
  // const property = {
  //   id: Number(id),
  //   title: "Rosewood Apartments",
  //   price: "₦280,000",
  //   location: "12 Oak Lane, Lagos, Nigeria",
  //   images: [
  //     "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-16%20at%2023.09.13-6qqknfRnn7Sv3KjLQQ1deuN8Qmfdec.png",
  //     "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
  //     "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg",
  //   ],
  //   description: "This modern 3-bedroom apartment blends style and comfort, offering an ideal urban retreat. With a spacious open-plan design, it boasts a sleek, fully equipped kitchen perfect for cooking enthusiasts, and a bright living area leads to a private balcony with stunning city views. Each bedroom features ample storage, while the master suite includes an en-suite bathroom. Situated near top restaurants, shopping, and transport, this property provides a balanced mix of convenience and sophistication.",
  //   specs: {
  //     beds: 3,
  //     baths: 2,
  //     area: "120 sq. ft",
  //     features: [
  //       "Communal garden",
  //       "Porter/security",
  //       "Open-concept living and dining area",
  //       "Pets Allowed",
  //       "Balcony",
  //       "Parking space/Garage"
  //     ]
  //   },
  //   nearbyLocations: {
  //     stations: [
  //       { name: "Vauxhall Station", distance: "0.7 miles" },
  //       { name: "Fulham Broadway", distance: "0.8 miles" },
  //     ],
  //     schools: [
  //       { name: "Clapham Junction", distance: "0.9 miles" },
  //       { name: "Clapham Junction", distance: "0.8 miles" },
  //     ],
  //     malls: [
  //       { name: "Clapham Junction", distance: "0.9 miles" },
  //       { name: "Clapham Junction", distance: "0.8 miles" },
  //     ]
  //   },
  //   agent: {
  //     name: "Adam Alekind",
  //     image: "/placeholder.svg",
  //     email: "adam.alekind@asher.com"
  //   }
  // }

  const { data: propertiesData, isFetching: isFetchingProperties } =
    useGetProperties();
  const similarProperties: Listing[] = propertiesData?.properties;

  const { data, isFetching } = useGetPropertyById(id as string);
  console.log(data);
  const propertyData = data?.property;
  const isLoading = isFetching || isFetchingProperties;

  const nextSlide = () => {
    if (scrollIndex < similarProperties.length - 3) {
      setScrollIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (scrollIndex > 0) {
      setScrollIndex((prev) => prev - 1);
    }
  };
  const handleContactClick = (type: "chat" | "email") => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (type === "email") {
      router.push(`/property/${propertyData?.id}/email`);
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
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <Skeleton className="w-32 h-6 mb-2" />
                        <Skeleton className="w-full h-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Status Card Skeleton */}
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={`/dashboard/applications`}
            className="text-gray-600 hover:text-gray-900"
          >
            Applications
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property Information</span>
        </div>

        {/* Main Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative rounded-lg overflow-hidden">
            <Image
              src={
                propertyData?.images[currentImageIndex] || "/placeholder.svg"
              }
              alt={propertyData?.title}
              width={800}
              height={600}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) =>
                    (prev - 1 + propertyData?.images.length) %
                    propertyData?.images.length
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev + 1) % propertyData?.images.length
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            {propertyData?.images
              .slice(1, 3)
              .map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Property image ${index + 2}`}
                    width={400}
                    height={300}
                    className="w-full h-[242px] object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {propertyData?.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {`${propertyData?.city}, ${propertyData?.state} ${propertyData?.country}, `}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-2xl font-bold mb-6">
              {`${formatPrice(propertyData?.rentalFee)}`}{" "}
              <span className="text-base font-normal text-gray-600">
                per month
              </span>
            </div>

            <div className="space-y-8">
              <section className="">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <p className="text-gray-600 leading-relaxed">
                  {propertyData?.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <Card className="p-6 shadow-sm w-full mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bedrooms: {propertyData?.noBedRoom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Bathrooms: {propertyData?.noBathRoom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Area: {propertyData?.size}</span>
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
                      <span>
                        Balcony: {propertyData?.balcony ? "Yes" : "No"}
                      </span>
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
                </Card>
              </section>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            <Card className="p-6 shadow-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Application Status</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Application Submitted
                  </h3>
                  <p className="text-gray-600">
                    Your application has been successfully submitted
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-medium">APP-{id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Submission Date</span>
                  <span className="font-medium">January 16, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Application Review</h3>
                    <p className="text-sm text-gray-600">
                      Your application will be reviewed by our team
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Property Inspection</h3>
                    <p className="text-sm text-gray-600">
                      Schedule a final property inspection if approved
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full relative",
                        "ring-2",
                        propertyData?.landlord?.isOnline
                          ? "ring-red-500"
                          : "ring-gray-300"
                      )}
                    >
                      <Image
                        src={
                          propertyData?.landlord?.image || "/placeholder.svg"
                        }
                        alt={propertyData?.landlord?.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    {true && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {propertyData?.landlord?.name}
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
                  Email landlord
                </Button>

                <LandlordProfileModal
                  isOpen={showLandlordProfile}
                  onClose={() => setShowLandlordProfile(false)}
                  landlord={{
                    name: propertyData?.landlord?.name,
                    image: propertyData?.landlord?.image,
                    address: propertyData?.landlord?.address,
                    isOnline: true
                  }}
                  properties={landlordProperties}
                  onChatClick={() => handleContactClick("chat")}
                  onEmailClick={() => handleContactClick("email")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Similar Properties</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={prevSlide}
                disabled={scrollIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-600 hover:text-white"
                onClick={nextSlide}
                disabled={scrollIndex >= similarProperties.length - 3}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              initial={false}
              animate={{ x: `-${scrollIndex * 33.33}%` }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.5
              }}
            >
              {similarProperties
                ?.filter((p) => p.id !== propertyData?.id)
                ?.map((similarProperty) => (
                  <div
                    key={similarProperty.id}
                    className="flex-none w-[calc(33.33%-16px)]"
                  >
                    <Card className="overflow-hidden shadow-sm">
                      <div className="relative h-48">
                        <Image
                          src={
                            similarProperty?.property?.images[0] ||
                            "/placeholder.svg"
                          }
                          alt={String(similarProperty?.property?.name)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">
                          {similarProperty?.property?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {similarProperty?.property?.location}
                        </p>
                        <p className="text-red-600 font-semibold">
                          {formatPrice(
                            Number(similarProperty?.property?.rentalFee) || 0
                          )}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
            </motion.div>
          </div>
        </section>
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
          name: "Adam Aleknd",
          image: "/placeholder.svg",
          role: "Landlord"
        }}
        propertyId={Number(id)}
      />
    </div>
  );
}
