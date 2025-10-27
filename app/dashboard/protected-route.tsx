'use client'

import { userStore, useIsAuthenticated } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const hasHydrated = userStore((state) => state.hasHydrated);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/");
    toast.error("You must be logged in to access this page");
    return null;
  }

  return <>{children}</>;
}
