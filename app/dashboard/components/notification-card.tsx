import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: number
  message: string
  timestamp: Date
}

interface NotificationCardProps {
  notifications: Notification[]
}

export function NotificationCard({ notifications }: NotificationCardProps) {
  return (
    <motion.div
      className="bg-gray-50 rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out"
      whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-white border border-neutral-100"
          >
            <div className="flex-1">
              <p className="text-sm text-neutral-900">{notification.message}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

