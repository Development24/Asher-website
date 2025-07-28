'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PasswordChangeModal } from './components/password-change-modal'
import { EmailPreferencesModal } from './components/email-preferences-modal'
import { SuccessModal } from './components/success-modal'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { userStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailPreferencesModal, setShowEmailPreferencesModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const user = userStore((state) => state.user);
  const router = useRouter();

  const handlePasswordChange = async (data: { 
    currentPassword: string; 
    newPassword: string; 
    confirmPassword: string 
  }) => {
    // Here you would typically make an API call to change the password
    setShowPasswordModal(false)
    setSuccessMessage('Password changed!')
    setShowSuccessModal(true)
  }

  const handleEmailPreferencesChange = async (preferences: {
    newListings: boolean
    viewingReminders: boolean
    securityUpdates: boolean
    marketing: boolean
  }) => {
    // Here you would typically make an API call to update email preferences
    setShowEmailPreferencesModal(false)
    setSuccessMessage('Email preferences updated!')
    setShowSuccessModal(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Settings</span>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src={user?.profile?.profileUrl || 'https://github.com/shadcn.png'}
                alt="Profile"
                fill
                className="rounded-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.profile?.firstName || "First Name"} {user?.profile?.lastName || "Last Name"}</h1>
              <p className="text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 13.17 9.42 18.92 11.24 21.11C11.64 21.59 12.37 21.59 12.77 21.11C14.58 18.92 19 13.17 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
                {user?.profile?.address || "Cleavland, OH, 44101"}
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => router.push('/dashboard/search')}>
              Browse properties
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p className="text-gray-500">
              Keep track of all your conversations in one place.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="bg-white rounded-lg shadow-sm divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Profile Information</h4>
                  <p className="text-sm text-gray-500">Update your account profile information</p>
                </div>
                <Link href="/dashboard/settings/edit">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-500">••••••••••••</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change
                </Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Preferences</h4>
                  <p className="text-sm text-gray-500">Manage your email notification settings</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowEmailPreferencesModal(true)}
                >
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordChange}
      />

      <EmailPreferencesModal
        isOpen={showEmailPreferencesModal}
        onClose={() => setShowEmailPreferencesModal(false)}
        onSubmit={handleEmailPreferencesChange}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  )
}

