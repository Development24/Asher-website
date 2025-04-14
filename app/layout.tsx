"use client";

import "./globals.css";
import { Inter, Jost } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
import { SavedPropertiesProvider } from "./contexts/saved-properties-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <SavedPropertiesProvider>{children}</SavedPropertiesProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
