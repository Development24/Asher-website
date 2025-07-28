import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { animations, animationClasses } from '@/lib/animations'

interface ApplicationCardProps {
  activeApplications: number
  completedApplications: number
}

export function ApplicationCard({ activeApplications, completedApplications }: ApplicationCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
      whileHover={animations.card.hover}
      whileTap={animations.card.tap}
      transition={animations.card.transition}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">Active Applications</span>
          <span className="font-semibold text-lg">{activeApplications || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">Completed Applications</span>
          <span className="font-semibold text-lg">{completedApplications || 0}</span>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/applications" className="flex-1">
            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200">
              View all applications
            </Button>
          </Link>
          <Link href="/dashboard/applications/cancelled">
            <Button variant="outline" className="px-3">
              Cancelled
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

