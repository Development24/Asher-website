import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/services/auth/authFn";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
const LogoutModal = ({
  open,
  setOpen,
  className
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) => {
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      setOpen(false);
      router.push("/login"); // or wherever you want to redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={cn("w-full justify-start", className)}>
          <LogOut className="mr-2 h-6 w-6" />
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout? You will need to login again to
            access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No, Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            loading={logout.isPending}
          >
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
