'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { userStore } from "@/store/userStore"
import { useGetProfile } from "@/services/auth/authFn"
import LogoutModal from "./modals/logout-modal"

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  
  // Get real user data
  const user = userStore((state) => state.user)
  const { data: profileData } = useGetProfile()
  
  const userProfile = profileData?.user || user
  const userName = userProfile?.profile?.firstName || userProfile?.profile?.fullname
  const userEmail = userProfile?.email
  const userAvatar = userProfile?.profile?.profileUrl

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-bold text-red-600">
                Asher
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Global">
              <Link href="/dashboard" className="inline-flex items-center border-b-2 border-red-500 px-1 pt-1 text-sm font-medium text-gray-900">
                Dashboard
              </Link>
              <Link href="/dashboard/properties" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Properties
              </Link>
              <Link href="/dashboard/applications" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Applications
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-3 flex items-center">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={userAvatar || "/placeholder-user.jpg"}
                    alt={userName || "User"}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLogoutModalOpen(true)}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <Link href="/dashboard" className="block border-l-4 border-red-500 bg-red-50 py-2 pl-3 pr-4 text-base font-medium text-red-700">
              Dashboard
            </Link>
            <Link href="/dashboard/properties" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
              Properties
            </Link>
            <Link href="/dashboard/applications" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
              Applications
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={userAvatar || "/placeholder-user.jpg"}
                  alt={userName || "User"}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
                />
              </div>
              <div className="ml-3">
                {userName && <div className="text-base font-medium text-gray-800">{userName}</div>}
                {userEmail && <div className="text-sm font-medium text-gray-500">{userEmail}</div>}
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Bell className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/dashboard/settings" className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                Settings
              </Link>
              <button 
                onClick={() => setLogoutModalOpen(true)}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <LogoutModal open={logoutModalOpen} setOpen={setLogoutModalOpen} />
    </header>
  )
}

