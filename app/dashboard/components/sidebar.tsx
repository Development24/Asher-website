"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  FileText,
  Eye,
  Bookmark,
  Heart,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  X
} from "lucide-react";
import LogoutModal from "./modals/logout-modal";
import { userStore } from "@/store/userStore";

const sidebarNavItems = [
  {
    title: "Browse",
    href: "/dashboard/search",
    icon: Search
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: FileText
  },
  {
    title: "Property viewings",
    href: "/dashboard/property-viewings",
    icon: Eye
  },
  // {
  //   title: "Tracked properties",
  //   href: "/dashboard/tracked",
  //   icon: Bookmark
  // },
  {
    title: "Saved properties",
    href: "/dashboard/saved-properties",
    icon: Heart
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: Mail
  },
  {
    title: "Chats",
    href: "/dashboard/chats",
    icon: MessageSquare
  }
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
  // {
  //   title: "Sign out",
  //   href: "/sign-out",
  //   icon: LogOut
  // }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const user = userStore((state) => state.user);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex flex-col h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "w-3/4" : "w-64"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col mb-4">
            <span className="font-medium capitalize">
              {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            </span>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
          <ScrollArea className="flex-1 -mx-6">
            <nav className="space-y-2 px-6">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 font-normal",
                    pathname === item.href && "bg-gray-100 font-medium"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </div>
        <div className="mt-auto p-6 border-t">
          <nav className="space-y-2">
            {bottomNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-3 font-normal"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            ))}

            <LogoutModal open={logoutModalOpen} setOpen={setLogoutModalOpen} />
          </nav>
        </div>
      </div>
    </>
  );
}
