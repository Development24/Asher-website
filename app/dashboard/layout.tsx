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
import type React from "react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "./components/app-sidebar";
import LoginHeaderItems from "./components/LoginHeaderItems";
import Footer from "./Footer";
import ProtectedRoute from "./protected-route";
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ProtectedRoute>
      {isMounted && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {children}
                      </motion.div>
                    </main>
                  </ApplicationFormProvider>
                </div>
                <Footer />
              </SidebarInset>

              <Toaster />
            </SidebarProvider>
          </motion.div>
        </AnimatePresence>
      )}
    </ProtectedRoute>
  );
}
