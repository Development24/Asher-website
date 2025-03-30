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
  Settings,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutModal from "./modals/logout-modal";
import Link from "next/link";

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

export function AppSidebar() {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const user = userStore((state) => state.user);

  return (
    <Sidebar >
      <SidebarHeader className="p-4 mx-auto">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user?.profile?.profileUrl || "https://github.com/shadcn.png"}
              alt={user?.profile?.firstName || "User"}
            />
            <AvatarFallback>
              {user?.profile?.firstName?.[0]}
              {user?.profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium capitalize">
              {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            </span>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {sidebarNavItems.map((item) => (
                <SidebarMenuItem key={item.href} className="space-y-5">
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-6 w-6" />
                      <span className="text-[16px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/settings"}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-6 w-6" />
                <span className="text-[16px]">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
          
            <SidebarMenuButton onClick={() => setLogoutModalOpen(true)}>
              <LogOut className="h-6 w-6" />
              <span className="text-[16px]">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      <LogoutModal className="hidden sr-only" open={logoutModalOpen} setOpen={setLogoutModalOpen} />
    </Sidebar>
  );
}
