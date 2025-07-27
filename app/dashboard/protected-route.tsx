'use client'

import { userStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const user = userStore((state) => state.user);
  const router = useRouter();

  if (!user) {
    router.push("/");
    toast.error("You must be logged in to access this page");
    return null;
  }

  return <>{children}</>;
}
