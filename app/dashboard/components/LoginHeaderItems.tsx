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
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
interface LoginHeaderItemsProps {
  onMenuClick?: () => void;
}

const LoginHeaderItems = ({ onMenuClick }: LoginHeaderItemsProps) => {
  const [showDashboardButton, setShowDashboardButton] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentPath = pathname;
    setShowDashboardButton(currentPath !== "/dashboard");
  }, [pathname]);

  return (
    <div className="flex items-center gap-4">
      {showDashboardButton && (
        <Button
          variant="outline"
          className=" text-red-800 hover:bg-white hover:text-red-900"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <Button
        className="bg-red-600 text-white hover:bg-red-700"
        size="icon"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button> */}
    </div>
  );
};

export default LoginHeaderItems;
