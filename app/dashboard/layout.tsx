// DashboardLayout.js
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { SideNav } from "@/components/side-nav";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.png" />
        </head>
        <body className={inter.className}>
            <Toaster />
            <div className="">
              <SideNav />
              <div className="flex-grow sm:ml-[180px]">
                {children}
              </div>
            </div>
        </body>
      </html>
  );
}
