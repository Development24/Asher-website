'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId?: string
}

export function PaymentModal({ isOpen, onClose, propertyId }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsSuccess(true)
    
    // Navigate to success page after showing success state
    setTimeout(() => {
      onClose()
      router.push(`/dashboard/applications/${propertyId}/success`)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] text-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary" />
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold">Payment Successful</h2>
            <p className="text-gray-500">
              Your application payment has been processed successfully.
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
            <h2 className="text-xl font-semibold mb-1">Pay application fee</h2>
            <p className="text-sm text-gray-500">
              To submit your application, please pay the application fee of ₦50.
            </p>
          </div>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="w-5 h-5" />
                <span>Pay with Card</span>
              </Label>
            </div>
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                  alt="PayPal"
                  width={37}
                  height={23}
                />
                <span>Pay with PayPal</span>
              </Label>
            </div>
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="https://cdn.stripe.com/v1/stripe.svg"
                  alt="Stripe"
                  width={37}
                  height={23}
                />
                <span>Pay with Stripe</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Processing...' : 'Pay now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

