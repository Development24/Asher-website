'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const LoginModal = dynamic(() => import("./auth/LoginModal").then(mod => mod.default), { ssr: false, loading: () => null });
const SignUpModal = dynamic(() => import("./auth/SignUpModal").then(mod => mod.default), { ssr: false, loading: () => null });
const VerificationModal = dynamic(() => import("./auth/VerificationModal").then(mod => mod.default), { ssr: false, loading: () => null });

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
                alt="Asher Home Solution"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/to-rent" 
                className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium relative group"
              >
                To Rent
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/shortlet" 
                className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium relative group"
              >
                Shortlet
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex space-x-3">
              <Button 
                variant="outline" 
                className="border-primary-500 text-primary-500 hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
                onClick={() => setShowLoginModal(true)}
              >
                Log In
              </Button>
              <Button 
                className="bg-primary-500 text-white hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setShowSignUpModal(true)}
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-neutral-100 transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-neutral-200 mt-4 pt-4"
              >
                <nav className="flex flex-col space-y-3">
                  <Link 
                    href="/" 
                    className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/to-rent" 
                    className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    To Rent
                  </Link>
                  <Link 
                    href="/shortlet" 
                    className="text-neutral-600 hover:text-primary-500 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shortlet
                  </Link>
                </nav>
                <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-neutral-200">
                  <Button 
                    variant="outline" 
                    className="border-primary-500 text-primary-500 hover:bg-primary-50 transition-all duration-200"
                    onClick={() => {
                      setShowLoginModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="bg-primary-500 text-white hover:bg-primary-600 transition-all duration-200"
                    onClick={() => {
                      setShowSignUpModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

