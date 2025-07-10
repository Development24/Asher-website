// Update the property invite card to be wider
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from 'framer-motion'

interface PropertyInviteCardProps {
  image: string
  title: string
  location: string
  price: string
  specs: string[]
  onAccept: () => void
  onReject: () => void
  onReschedule: () => void
}

export function PropertyInviteCard({
  image,
  title,
  location,
  price,
  specs,
  onAccept,
  onReject,
  onReschedule,
}: PropertyInviteCardProps) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-md p-4 max-w-3xl mx-auto transition-shadow"
      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{location}</p>
          <p className="text-sm font-medium mt-1">{price}</p>
          <div className="flex gap-2 mt-1">
            {specs.map((spec, index) => (
              <span key={index} className="text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                {spec}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="flex-1 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReschedule}
              className="flex-1 hover:bg-neutral-50 transition-colors"
            >
              Reschedule
            </Button>
            <Button
              size="sm"
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

