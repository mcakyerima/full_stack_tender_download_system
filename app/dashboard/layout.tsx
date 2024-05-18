"use client"
// DashboardLayout.js
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { Sidebar } from "./_components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.includes("/dashboard/"); // Check if the pathname is either exactly '/dashboard' or includes '/dashboard/'
  
  return (
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" />
        </head>
        <body className={inter.className}>
            <Toaster />
            {isDashboard && <Header dashboard={true} />}
            <div className="flex">
              <div className="hidden md:flex h-full w-52 flex-col fixed inset-y-0 z-40">
                  <Sidebar/>
              </div>
              <div className={isDashboard ? "flex-grow sm:ml-[200px]" : "flex-grow"}> {/* Apply conditional class based on whether in dashboard route */}
                {children}
              </div>
            </div>
        </body>
      </html>
  );
}
