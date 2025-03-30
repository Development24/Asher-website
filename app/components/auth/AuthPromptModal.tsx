'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
  onSignUp: () => void
}

export function AuthPromptModal({ isOpen, onClose, onSignIn, onSignUp }: AuthPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-background/50 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Sign in or Sign up to continue</h2>
                <p className="text-muted-foreground">
                  You need an account to connect with landlords or agents. Create one or sign in to proceed.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={onSignIn}
                  >
                    Sign in
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={onSignUp}
                  >
                    Sign up
                  </Button>
                </div>
                <button
                  onClick={onClose}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

