'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeedbackSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  propertyName: string
}

export function FeedbackSuccessModal({ isOpen, onClose, propertyName }: FeedbackSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-white/20 bg-gray-950/70 backdrop-blur-xl text-white">
        <motion.div 
          className="flex flex-col items-center gap-4 py-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-green-600" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 0.3, duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 w-16 h-16 rounded-full bg-green-100/50"
            />
          </div>
          <h2 className="text-2xl font-semibold">Feedback Submitted</h2>
          <p className="text-gray-400 text-center">
            Your feedback for {propertyName} has been successfully submitted.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

