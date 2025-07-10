import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ApplicationCardProps {
  activeApplications: number
  completedApplications: number
}

export function ApplicationCard({ activeApplications, completedApplications }: ApplicationCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 transition-all duration-300 ease-in-out"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
        <Link href="/dashboard/applications" className="block">
          <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200">
            View all applications
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

