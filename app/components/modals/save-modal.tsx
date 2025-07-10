"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Check } from "lucide-react"
import { motion } from "framer-motion"

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
}

const SaveModal = ({ isOpen, onClose, propertyTitle }: SaveModalProps) => {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      onClose()
      setSaved(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Property</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {!saved ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-center">Save {propertyTitle}</h2>
              <p className="text-center text-gray-500">Save this property to your favorites to easily find it later.</p>
              <div className="flex gap-4 mt-4 sm:flex-col sm:gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave}>
                  Save Property
                </Button>
              </div>
            </>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Property Saved!</h2>
              <p className="text-gray-500">You can find this property in your saved properties.</p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
};
export default SaveModal;

