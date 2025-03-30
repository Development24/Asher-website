import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ApplicationCardProps {
  activeApplications: number
  completedApplications: number
}

export function ApplicationCard({ activeApplications, completedApplications }: ApplicationCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Your Applications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Applications</span>
            <span className="font-semibold">{activeApplications}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Completed Applications</span>
            <span className="font-semibold">{completedApplications}</span>
          </div>
          <Link href="/dashboard/applications">
            <Button className="w-full bg-red-600 hover:bg-red-700 mt-4">
              View all applications
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

