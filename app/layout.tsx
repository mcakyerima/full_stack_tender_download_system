import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConvexClientProvider from "./convex-client/ConvexClientProvider";
import Header from "@/components/header";

import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tender Download System",
  description: "A React application for browsing and downloading tender documents.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider clerkPublishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} >
      <html lang="en">
      <link rel="icon" href="/favicon.png" />
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <Toaster />
              <Header/>
              {children}
            </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
