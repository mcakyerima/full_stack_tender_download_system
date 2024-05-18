"use client"
// Header.js
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/app/dashboard/_components/mobile-sidebar";


export default function Header({ dashboard }: { dashboard?: boolean}) {
  // console.log({dashboard})
  return (
    <div className="sticky w-full top-0 z-50 border-b py-2 shadow-sm backdrop-filter backdrop-blur-lg bg-opacity-80">
      <div className="container flex justify-between items-center mx-auto">
        <div className="flex cursor-pointer">
          {dashboard && (<MobileSidebar/>)}
            <a
              href="/"
              className="flex items-center cursor-pointer"
            >
                <Image
                  height={100}
                  width={100}
                  src="/Mercy-Corps.svg"
                  alt="MercyCorps Logo"
                />
            </a>
        </div>
          
        <nav className="flex gap-3">
          <div className="hidden md:block">
            <OrganizationSwitcher/>
          </div>
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
          <ModeToggle/>
        </nav>
      </div>
    </div>
  );
}
