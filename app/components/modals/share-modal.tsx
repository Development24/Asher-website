"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Twitter, PhoneIcon as WhatsApp, LinkIcon, Check } from "lucide-react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle: string
  propertyUrl: string
}

export function ShareModal({ isOpen, onClose, propertyTitle, propertyUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(propertyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(`Check out ${propertyTitle}`)}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsApp,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${propertyTitle}: ${propertyUrl}`)}`,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Property</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Share via social media</Label>
            <div className="flex gap-4 sm:flex-col sm:gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  className={`flex-1 ${social.color} text-white`}
                  onClick={() => window.open(social.url, "_blank")}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Or copy link</Label>
            <div className="flex gap-2 sm:flex-col sm:gap-2">
              <Input value={propertyUrl} readOnly />
              <Button variant="outline" className={copied ? "bg-green-50 text-green-600" : ""} onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

