"use client";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ApplicationFormProvider } from "@/contexts/application-form-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppSidebar } from "./components/app-sidebar";
import LoginHeaderItems from "./components/LoginHeaderItems";
import Footer from "./Footer";
import ProtectedRoute from "./protected-route";
import { Suspense } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-4 shadow-sm">
          <SidebarTrigger className="-ml-1 hover:bg-neutral-100 transition-colors duration-200" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-neutral-200" />
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-105">
              <Image
                src="/logo.svg"
                alt="Asher Logo"
                width={40}
                height={35}
              />
              <span className="font-semibold text-neutral-900 hidden sm:block">
                Asher Solutions
              </span>
            </Link>
            <LoginHeaderItems />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-neutral-50/50">
          <ApplicationFormProvider>
            <main className="w-full">
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </main>
          </ApplicationFormProvider>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardContent>{children}</DashboardContent>
    </ProtectedRoute>
  );
}
