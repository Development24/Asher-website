import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Bed, Bath } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { animations, animationClasses } from '@/lib/animations'

interface ViewingCardProps {
  image: string
  title: string
  price: string
  location: string
  date: string
  time: string
  beds: number
  baths: number
  propertyId?: string
  inviteId?: string
}

export function ViewingCard({
  image,
  title,
  price,
  location,
  date,
  time,
  beds,
  baths,
  propertyId,
  inviteId
}: ViewingCardProps) {
  const viewLink = inviteId ? `/dashboard/property-viewings/${inviteId}` : `/property/${propertyId}`;

  return (
    <motion.div
      className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
      whileHover={animations.card.hover}
      whileTap={animations.card.tap}
      transition={animations.card.transition}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Upcoming Viewings</h2>
        <Link href="/dashboard/property-viewings">
          <Button variant="link" className="text-primary-600 hover:text-primary-700 p-0 h-auto">
            View all
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        <motion.div
          className="overflow-hidden rounded-lg border border-neutral-200 shadow-sm"
          whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="relative h-48">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
            <Link href={viewLink}>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-neutral-900 border border-neutral-200"
              >
                View property
              </Button>
            </Link>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <span className="text-primary-500 font-semibold">{price}</span>
            </div>
            <p className="text-sm text-neutral-600 mb-4">{location}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="h-4 w-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="h-4 w-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
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
        </motion.div>
      </div>
    </motion.div>
  )
}

