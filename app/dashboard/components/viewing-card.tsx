import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Bed, Bath } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ViewingCardProps {
  image: string
  title: string
  price: string
  location: string
  date: string
  time: string
  beds: number
  baths: number
}

export function ViewingCard({
  image,
  title,
  price,
  location,
  date,
  time,
  beds,
  baths
}: ViewingCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Upcoming Viewings</CardTitle>
          <Link href="/dashboard/property-viewings">
            <Button variant="link" className="text-red-600 hover:text-red-700">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Card className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
            >
              View property
            </Button>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{title}</h3>
              <span className="text-red-600 font-semibold">{price}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{location}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {beds}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {baths}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  )
}

