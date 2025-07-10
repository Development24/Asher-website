'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

interface CancelViewingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  showSuccess?: boolean
}

const CancelViewingModal = ({
  isOpen,
  onClose,
  onConfirm,
  showSuccess
}: CancelViewingModalProps) => {
  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary" />
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">Viewing Cancelled</h2>
            <p className="text-gray-500">
              You've successfully cancelled your scheduled viewing. The landlord/agent will be notified.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Cancel Viewing?</h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to cancel this viewing? We'll notify the landlord/agent of your cancellation.
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
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
};
export default CancelViewingModal;

