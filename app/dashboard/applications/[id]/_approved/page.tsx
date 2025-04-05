"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LeaseAgreementModal } from "../_success/lease-agreement-modal"
import { PaymentModal } from "../_success/payment-modal"
import { SaveModal } from "@/app/components/modals/save-modal"
import { ShareModal } from "@/app/components/modals/share-modal"

export default function ApprovedPage() {
  const { id } = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLeaseAgreementModal, setShowLeaseAgreementModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failure">("idle")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const property = {
    id: Number(id),
    title: "Rosewood Apartments",
    price: "₦280,000",
    location: "12 Oak Lane, Lagos, Nigeria",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-16%20at%2023.14.35-E94cHuEqu7jWzxyCyJYySIeVHp8EfR.png",
      "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg",
    ],
    description:
      "This modern 2-bedroom apartment blends style and comfort, offering an ideal urban retreat. With a spacious open-plan design, it boasts a sleek, fully equipped kitchen, perfect for cooking enthusiasts, and a bright living area leading to a private balcony with stunning city views. Each bedroom features ample storage, while the master suite includes an en-suite bathroom. Situated near top restaurants, shopping, and transport, this property provides a balanced mix of convenience and sophistication.",
    specs: {
      beds: 3,
      baths: 2,
      area: "120 sq. ft",
      features: [
        "Communal garden",
        "Porter/security",
        "Open-concept living and dining area",
        "Pets Allowed",
        "Balcony",
        "Parking space/Garage",
      ],
    },
    nearbyLocations: {
      stations: [
        { name: "Vauxhall Station", distance: "0.7 miles" },
        { name: "Fulham Broadway", distance: "0.8 miles" },
      ],
      schools: [
        { name: "Clapham Junction", distance: "0.9 miles" },
        { name: "Clapham Junction", distance: "0.8 miles" },
      ],
      malls: [
        { name: "Clapham Junction", distance: "0.9 miles" },
        { name: "Clapham Junction", distance: "0.8 miles" },
      ],
    },
    agent: {
      name: "Adam Alekind",
      image: "/placeholder.svg",
      email: "adam.alekind@asher.com",
    },
  }

  const similarProperties = [
    {
      id: 1,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
      title: "Rosewood Apartments",
      price: "₦280,000",
      location: "15 Oak Lane, Lagos",
    },
    {
      id: 2,
      image: "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg",
      title: "Rosewood Apartments",
      price: "₦285,000",
      location: "18 Oak Lane, Lagos",
    },
    {
      id: 3,
      image: "https://cdn.pixabay.com/photo/2017/06/18/02/33/house-2414374_1280.jpg",
      title: "Rosewood Apartments",
      price: "₦290,000",
      location: "20 Oak Lane, Lagos",
    },
  ]

  const handleLeaseAgreementSubmit = () => {
    setShowLeaseAgreementModal(false)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setPaymentStatus("success")
  }

  const handlePaymentFailure = () => {
    setShowPaymentModal(false)
    setPaymentStatus("failure")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/dashboard/applications" className="text-gray-600 hover:text-gray-900">
            Applications
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property Information</span>
        </div>

        {/* Main Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative rounded-lg overflow-hidden">
            <Image
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              width={800}
              height={600}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % property.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            {property.images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
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
                <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setShowSaveModal(true)}>
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-2xl font-bold mb-6">
              {property.price} <span className="text-base font-normal text-gray-600">per month</span>
            </div>

            <Card className="p-6 shadow-sm w-full mb-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span>Bedrooms</span>
                  <span className="font-medium ml-auto">{property.specs.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span>Bathrooms</span>
                  <span className="font-medium ml-auto">{property.specs.baths}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>Floor Area</span>
                  <span className="font-medium ml-auto">{property.specs.area}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.specs.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
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
                  <h3 className="font-semibold text-lg">Application Approved</h3>
                  <p className="text-gray-600">Congratulations! Your application has been approved</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-medium">APP-{id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approval Date</span>
                  <span className="font-medium">January 16, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
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
                    <h3 className="font-medium">Review Lease Agreement</h3>
                    <p className="text-sm text-gray-600">Please review and sign your lease agreement</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => setShowLeaseAgreementModal(true)}
                  >
                    View lease agreement
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Decline lease offer
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Contact Landlord</h2>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.agent.image} alt={property.agent.name} />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{property.agent.name}</div>
                  <div className="text-sm text-gray-600">{property.agent.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat with landlord
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email landlord
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Similar Properties</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="hover:bg-red-600 hover:text-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-red-600 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden shadow-sm w-full max-w-sm mx-auto">
                <div className="relative h-48">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  <p className="text-red-600 font-semibold">{property.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <LeaseAgreementModal
        isOpen={showLeaseAgreementModal}
        onClose={() => setShowLeaseAgreementModal(false)}
        onSubmit={handleLeaseAgreementSubmit}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
      <SaveModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} propertyTitle={property.title} />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        propertyTitle={property.title}
        propertyUrl={`${window.location.origin}/property/${id}`}
      />
      {paymentStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg"
        >
          Payment successful! Your lease agreement has been submitted.
        </motion.div>
      )}

      {paymentStatus === "failure" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg"
        >
          Payment failed. Please try again or contact support.
        </motion.div>
      )}
    </div>
  )
}

