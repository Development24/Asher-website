'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginModal } from './auth/LoginModal'
import { SignUpModal } from './auth/SignUpModal'
import { VerificationModal } from './auth/VerificationModal'
import Image from 'next/image';

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  const handleVerificationNeeded = (email: string) => {
    setVerificationEmail(email)
    setShowSignUpModal(false)
    setShowVerificationModal(true)
  }

  const switchToLogin = () => {
    setShowSignUpModal(false)
    setShowLoginModal(true)
  }

  const switchToSignUp = () => {
    setShowLoginModal(false)
    setShowSignUpModal(true)
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
              alt="Asher Home Solution"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">Home</Link>
            <Link href="/to-rent" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">To rent</Link>
            <Link href="/shortlet" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">Shortlet</Link>
          </nav>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => setShowLoginModal(true)}
            >
              Log In
            </Button>
            <Button 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => setShowSignUpModal(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={switchToSignUp}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={switchToLogin}
        onVerificationNeeded={handleVerificationNeeded}
      />

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={verificationEmail}
        onVerificationSuccess={() => setShowVerificationModal(false)}
      />
    </>
  )
}

