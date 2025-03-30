"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginHeaderItems from "./LoginHeaderItems"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className=" flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logoasher-fnyHiIbLgKYO0w8dKX1bfxuip3Ucba.png"
                alt="Asher Home Solution"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <span className="font-semibold">Asher Solutions</span>
          </Link>
        </div>
        <LoginHeaderItems />

      </div>
    </header>
  )
}

