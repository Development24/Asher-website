'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

interface AcceptInviteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  showSuccess: boolean
  propertyId: number
  isLoading: boolean
}

export function AcceptInviteModal({ isOpen, onClose, onConfirm, showSuccess, propertyId, isLoading }: AcceptInviteModalProps) {
  const router = useRouter()

  const handleConfirm = () => {
    onConfirm()
    // Redirect to property viewings page after a short delay
    setTimeout(() => {
      router.push('/dashboard/property-viewings')
    }, 4000)
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Invite Accepted</h2>
            <p className="text-gray-500">
              You've successfully accepted the viewing invite. The landlord/agent will be notified.
            </p>
            <p className="text-gray-500">
              Redirecting you to the property viewings page...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Accept invite?</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to accept this viewing invite? We'll notify the landlord/agent of your confirmation.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            No, cancel
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleConfirm}
            loading={isLoading}
          >
            Yes, accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

