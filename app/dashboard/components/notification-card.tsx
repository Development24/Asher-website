import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-white"
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
      </CardContent>
    </Card>
  )
}

