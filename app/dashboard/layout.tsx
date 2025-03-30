"use client";

import { AppSidebar } from "./components/app-sidebar";
import { ApplicationFormProvider } from "@/contexts/application-form-context";
import type React from "react";
import ProtectedRoute from "./protected-route";
import { Toaster } from "sonner";
import Footer from "./Footer";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import LoginHeaderItems from "./components/LoginHeaderItems";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink
} from "@/components/ui/breadcrumb";
import Image from "next/image";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Asher Logo"
                  width={40}
                  height={35}
                />
              </div>
              <LoginHeaderItems />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <ApplicationFormProvider>
              <main className="w-full">{children}</main>
            </ApplicationFormProvider>
          </div>
          <Footer />
        </SidebarInset>

        <Toaster />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
