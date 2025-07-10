"use client";

import { userStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";
import {
  Search,
  FileText,
  Eye,
  Heart,
  Mail,
  MessageSquare,
  Home,
  Calendar,
  User
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export function AppSidebar() {
  const pathname = usePathname();
  const user: any = userStore((state) => state.user);

  return (
    <Sidebar className="border-r border-neutral-200 bg-white">
      <SidebarHeader className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary-100">
            <AvatarImage
              src={user?.profile?.profileUrl || "https://github.com/shadcn.png"}
              alt={user?.profile?.firstName || "User"}
            />
            <AvatarFallback className="bg-primary-50 text-primary-600 font-semibold">
              {user?.profile?.firstName?.[0]}
              {user?.profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-neutral-900 capitalize truncate">
              {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            </span>
            <span className="text-sm text-neutral-500 truncate">
              {user?.email ?? user?.users?.email}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-neutral-50 hover:text-neutral-900",
                      "data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:font-medium",
                      "data-[state=active]:border-r-2 data-[state=active]:border-primary-500"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-neutral-100">
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
              {user?.email ?? user?.users?.email}
            </span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
