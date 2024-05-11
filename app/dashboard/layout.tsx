"use client"
// DashboardLayout.js
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { SideNav } from "@/components/side-nav";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" />
        </head>
        <body className={inter.className}>
            <Toaster />
            {pathname.includes("/dashboard/") && <Header/>}
              <SideNav />
              <div className="flex-grow sm:ml-[180px]">
                {children}
            </div>
        </body>
      </html>
  );
}
