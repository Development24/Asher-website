'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface EmailPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (preferences: {
    newListings: boolean
    viewingReminders: boolean
    securityUpdates: boolean
    marketing: boolean
  }) => void
}

export function EmailPreferencesModal({ isOpen, onClose, onSubmit }: EmailPreferencesModalProps) {
  const [preferences, setPreferences] = useState({
    newListings: false,
    viewingReminders: false,
    securityUpdates: true,
    marketing: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(preferences)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage email preferences</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-500">
            Set your email preferences to stay updated on what matters most—applications, listings,
            reminders, and more. Stay informed, your way.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-listings"
                checked={preferences.newListings}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, newListings: checked as boolean })
                }
              />
              <Label htmlFor="new-listings">
                Notify me about new property listings that match my preferences.
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="viewing-reminders"
                checked={preferences.viewingReminders}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, viewingReminders: checked as boolean })
                }
              />
              <Label htmlFor="viewing-reminders">
                Send me reminders for property viewings.
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="security-updates"
                checked={preferences.securityUpdates}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, securityUpdates: checked as boolean })
                }
              />
              <Label htmlFor="security-updates">
                Receive essential information about your account and security changes.
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, marketing: checked as boolean })
                }
              />
              <Label htmlFor="marketing">
                Receive newsletters, special offers, and promotions.
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
            >
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

