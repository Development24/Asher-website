'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { Calendar, Clock, MapPin, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import RescheduleViewingModal from '../../../components/modals/reschedule-viewing-modal';
import CancelViewingModal from '../../../components/modals/cancel-viewing-modal';

interface Property {
  id: number
  images: string[]
  title: string
  price: string
  location: string
  description: string
  features: {
    bedrooms: number
    area: string
    garden: boolean
    security: boolean
    balcony: boolean
    parking: boolean
  }
  nearbyLocations: {
    stations: Array<{ name: string; distance: string }>
    malls: Array<{ name: string; distance: string }>
  }
  agent: {
    name: string
    image: string
    email: string
  }
}

export default function AcceptedPropertyViewingPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCancelSuccess, setShowCancelSuccess] = useState(false)
  const [viewingStatus, setViewingStatus] = useState<'scheduled' | 'rescheduled' | 'cancelled'>('scheduled')
  const [scheduledDate, setScheduledDate] = useState("29th September, 2024")
  const [scheduledTime, setScheduledTime] = useState("10:00 AM - 2:00 PM")
  const [rescheduledDate, setRescheduledDate] = useState("")
  const [rescheduledTime, setRescheduledTime] = useState("")

  useEffect(() => {
    // Simulating API call to fetch property details
    setProperty({
      id: Number(id),
      images: [
        "https://cdn.pixabay.com/photo/2017/06/18/02/33/house-2414374_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/06/18/02/33/house-2414374_1280.jpg"
      ],
      title: "Rosewood Apartments",
      price: "₦280,000",
      location: "12 Oak Lane, Lagos, Nigeria",
      description: "The modern 3-bedroom apartment blends style and comfort, offering an ideal urban retreat. With a spacious open-plan design, it boasts a sleek, fully equipped kitchen perfect for cooking enthusiasts, and a bright living area opens onto a private balcony with stunning city views. The property features ample storage, and the prime location ensures easy access to amenities.",
      features: {
        bedrooms: 3,
        area: "1500 sq. ft",
        garden: true,
        security: true,
        balcony: true,
        parking: true
      },
      nearbyLocations: {
        stations: [
          { name: "Vauxhall Station", distance: "0.7 miles" },
          { name: "Fulham Broadway", distance: "0.8 miles" },
          { name: "Clapham Junction", distance: "0.9 miles" }
        ],
        malls: [
          { name: "Westfield", distance: "1.2 miles" },
          { name: "The Mall", distance: "1.5 miles" }
        ]
      },
      agent: {
        name: "Adam Alekind",
        image: "/placeholder.svg",
        email: "adam.alekind@asher.com"
      }
    })
  }, [id])

  const handleReschedule = (data: { date: string; time: string; reason: string }) => {
    setRescheduledDate(data.date)
    setRescheduledTime(data.time)
    setViewingStatus('rescheduled')
    setShowRescheduleSuccess(true)
    setTimeout(() => {
      setShowRescheduleModal(false)
      setShowRescheduleSuccess(false)
    }, 3000)
  }

  const handleCancel = () => {
    setViewingStatus('cancelled')
    setShowCancelSuccess(true)
    setTimeout(() => {
      setShowCancelModal(false)
      setShowCancelSuccess(false)
    }, 3000)
  }

  if (!property) return <div>Loading...</div>

  return (
    <div className="layout">
      {/* Breadcrumb */}
      <div className="container px-4 py-4 mx-auto">
        <div className="flex gap-2 items-center text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Property information</span>
        </div>
      </div>

      {/* Full-width Gallery */}
      <div className="relative w-full h-[600px] mb-8">
        <Image
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="flex absolute bottom-6 left-1/2 gap-2 -translate-x-1/2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="mb-2 text-2xl font-bold">{property.title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-1 w-4 h-4" />
                  {property.location}
                </div>
              </div>
              <div className="text-2xl font-bold">
                {property.price}
                <span className="block text-sm font-normal text-right text-gray-600">per month</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="mb-4 text-lg font-semibold">Description</h2>
                <p className="text-gray-600">{property.description}</p>
              </section>

              <section>
                <h2 className="mb-4 text-lg font-semibold">About this property</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span>{property.features.bedrooms}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-600">Area:</span>
                      <span>{property.features.area}</span>
                    </div>
                    {property.features.garden && (
                      <div className="flex gap-2 items-center">
                        <span>Communal garden</span>
                      </div>
                    )}
                    {property.features.balcony && (
                      <div className="flex gap-2 items-center">
                        <span>Balcony</span>
                      </div>
                    )}
                </div>
              </section>

              {/* <section>
                <h2 className="mb-4 text-lg font-semibold">Location on map</h2>
                <div className="h-[300px] bg-gray-100 rounded-lg mb-6" />
                
                <div className="grid gap-8 md:grid-cols-3">
                  <div>
                    <h3 className="mb-4 font-semibold">Nearest stations</h3>
                    {property.nearbyLocations.stations.map((station, index) => (
                      <div key={index} className="flex justify-between py-1 text-sm">
                        <span>{station.name}</span>
                        <span className="text-gray-500">{station.distance}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="mb-4 font-semibold">Nearest malls</h3>
                    {property.nearbyLocations.malls.map((mall, index) => (
                      <div key={index} className="flex justify-between py-1 text-sm">
                        <span>{mall.name}</span>
                        <span className="text-gray-500">{mall.distance}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="mb-4 font-semibold">Nearest schools</h3>
                    <div className="flex justify-between py-1 text-sm">
                      <span>Local Primary School</span>
                      <span className="text-gray-500">0.3 miles</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm">
                      <span>Secondary School</span>
                      <span className="text-gray-500">0.5 miles</span>
                    </div>
                  </div>
                </div>
              </section> */}
            </div>
          </div>

          {/* Right Column - Schedule & Contact */}
          <div className="w-full lg:w-[380px] space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Property Viewing Schedule</h2>
              <div className="space-y-4">
                {viewingStatus === 'scheduled' && (
                  <>
                    <div className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{scheduledDate}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{scheduledTime}</span>
                    </div>
                  </>
                )}

                {viewingStatus === 'rescheduled' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h3 className="mb-2 text-sm font-medium text-gray-500">Original Schedule</h3>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{scheduledDate}</span>
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{scheduledTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <h3 className="mb-2 text-sm font-medium">New Schedule</h3>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{rescheduledDate}</span>
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{rescheduledTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewingStatus === 'cancelled' && (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="line-through">{scheduledDate}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="line-through">{scheduledTime}</span>
                    </div>
                    <div className="mt-2 font-medium text-red-600">Viewing Cancelled</div>
                  </div>
                )}

                {viewingStatus !== 'cancelled' && (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowRescheduleModal(true)}
                    >
                      Reschedule viewing
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel viewing
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Contact Agent</h2>
              <div className="flex gap-4 items-center mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={property.agent.image} alt={property.agent.name} />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{property.agent.name}</div>
                  <div className="text-sm text-gray-600">{property.agent.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full">Chat with agent</Button>
                <Button variant="outline" className="w-full">Email agent</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-12 mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Similar properties</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={property.images[index % property.images.length] || "/placeholder.svg"}
                    alt="Similar property"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-semibold">Similar Property {index + 1}</h3>
                  <p className="text-sm text-gray-600">₦280,000 per month</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <RescheduleViewingModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleReschedule}
        showSuccess={showRescheduleSuccess}
        currentDate={scheduledDate}
        currentTime={scheduledTime}
        newDate={rescheduledDate}
        newTime={rescheduledTime}
      />

      <CancelViewingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        showSuccess={showCancelSuccess}
      />
    </div>
  )
}

