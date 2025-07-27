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
  X,
  Home,
  Calendar
} from "lucide-react";
import { userStore } from "@/store/userStore";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "Browse Properties",
    href: "/dashboard/search",
    icon: Search
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: FileText
  },
  {
    title: "Property Viewings",
    href: "/dashboard/property-viewings",
    icon: Calendar
  },
  {
    title: "Saved Properties",
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



interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const user = userStore((state) => state.user);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-neutral-200 shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "w-80" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <Avatar className="h-12 w-12 ring-2 ring-primary-100">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary-50 text-primary-600 font-semibold">
                  {user?.profile?.firstName?.[0]}
                  {user?.profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="h-8 w-8 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-neutral-900 capitalize">
                {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
              </span>
              <span className="text-sm text-neutral-500">{user?.email}</span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-2">
                Navigation
              </div>
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium",
                    "hover:bg-neutral-50 hover:text-neutral-900",
                    pathname === item.href && "bg-primary-50 text-primary-600 border-r-2 border-primary-500"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-primary-100">
                <AvatarImage
                  src={user?.profile?.profileUrl || "https://github.com/shadcn.png"}
                  alt={user?.profile?.firstName || "User"}
                />
                <AvatarFallback className="bg-primary-50 text-primary-600 font-semibold text-sm">
                  {user?.profile?.firstName?.[0]}
                  {user?.profile?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-neutral-900 capitalize truncate text-sm">
                  {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                </span>
                <span className="text-xs text-neutral-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
