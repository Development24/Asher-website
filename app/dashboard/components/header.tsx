"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginHeaderItems from "./LoginHeaderItems"
import { useState } from "react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-105">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
              alt="Asher Home Solution"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <span className="font-semibold text-neutral-900 hidden sm:block">Asher Solutions</span>
          </Link>
        </div>

        {/* Desktop Login Items */}
        <div className="hidden md:block">
          <LoginHeaderItems />
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="px-4 py-4">
              <LoginHeaderItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

