'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [isWithdrawn, setIsWithdrawn] = useState(false)
  const router = useRouter()

  const handleWithdraw = async () => {
    setIsWithdrawn(true)
    // Redirect after showing success state
    setTimeout(() => {
      router.push('/dashboard/applications')
    }, 2000)
  }

  if (isWithdrawn) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] text-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">Application Withdrawn</h2>
            <p className="text-gray-500">
              Your application has been successfully withdrawn.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Withdraw Application?</h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to withdraw your application? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              variant="destructive"
            >
              Yes, withdraw
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

