"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface EmailSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailSuccessModal({ isOpen, onClose }: EmailSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-0 bg-transparent shadow-none">
        <motion.div
          className="bg-white rounded-lg p-8 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                delay: 0.2,
                duration: 2,
                repeat: Number.POSITIVE_INFINITY
              }}
            >
              <div className="absolute inset-0 rounded-full bg-green-100/50" />
            </motion.div>
            <div className="relative z-10 w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Enquiry sent successfully
          </h2>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full" />
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full" />
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-400 rounded-full" />
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
