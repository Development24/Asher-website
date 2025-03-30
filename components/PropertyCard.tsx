import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Heart } from "lucide-react"

interface PropertyCardProps {
  id: number
  image: string
  title: string
  price: string
  location: string
  specs: {
    bedrooms: number
    bathrooms: number
  }
  saved?: boolean
  showFeedback?: boolean
  showViewProperty?: boolean
  isInvite?: boolean
  onAcceptInvite?: () => void
  isScheduled?: boolean
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  title,
  price,
  location,
  specs,
  saved,
  showFeedback,
  showViewProperty,
  isInvite,
  onAcceptInvite,
  isScheduled,
}) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
        {saved && (
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md">
            <Heart className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-red-600 font-semibold mb-2">{price}</p>
        <p className="text-gray-600 text-sm mb-2">{location}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {specs.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {specs.bathrooms}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        {showViewProperty && (
          <Link
            href={
              isScheduled
                ? `/dashboard/property-viewings/${id}/accepted`
                : isInvite
                  ? `/dashboard/property-viewings/${id}`
                  : `/property/${id}`
            }
          >
            <Button variant="outline" className="w-full">
              {isScheduled ? "View Scheduled" : isInvite ? "View invite" : "View property"}
            </Button>
          </Link>
        )}
        {showFeedback && (
          <Button variant="outline" className="w-full">
            Leave feedback
          </Button>
        )}
        {onAcceptInvite && (
          <Button className="w-full" onClick={onAcceptInvite}>
            Accept invite
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

