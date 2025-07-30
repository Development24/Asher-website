import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Menu, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
import LogoutModal from "./modals/logout-modal";

interface LoginHeaderItemsProps {
  onMenuClick?: () => void;
}

const LoginHeaderItems = ({ onMenuClick }: LoginHeaderItemsProps) => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = userStore((state) => state.user);

  const showDashboardButton = pathname !== "/dashboard";

  return (
    <div className="flex items-center gap-3">
      {showDashboardButton && (
        <Button
          variant="outline"
          className="border-primary-500 text-primary-500 hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-neutral-100 transition-all duration-200 ring-2 ring-transparent hover:ring-primary-100"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user?.profile?.profileUrl || "https://github.com/shadcn.png"} 
                alt={user?.profile?.firstName || "User"}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder-user.jpg"; }}
              />
              <AvatarFallback className="bg-primary-50 text-primary-600 font-semibold text-sm">
                {user?.profile?.firstName?.[0]}
                {user?.profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 border-neutral-200 shadow-lg"
        >
          <DropdownMenuLabel className="text-neutral-900 font-semibold">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-200" />
          <DropdownMenuItem 
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors duration-150"
          >
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors duration-150"
          >
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-neutral-200" />
          <DropdownMenuItem 
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <LogoutModal open={logoutModalOpen} setOpen={setLogoutModalOpen} />
    </div>
  );
};

export default LoginHeaderItems;
