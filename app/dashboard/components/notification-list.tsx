import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: number
  message: string
  timestamp: Date
}

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
        >
          <div className="flex-1">
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

