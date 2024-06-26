"use client";
// RootLayout.js
import { Inter } from "next/font/google";
import { Urbanist } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import ConvexClientProvider from "@/convex-client/ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

const font = Urbanist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  console.log("Current Pathname:", pathname);
  return (
    <ConvexClientProvider clerkPublishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <link rel="icon" href="/Logo-2.svg" />
        </head>
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {pathname === '/' && <Header/>}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
