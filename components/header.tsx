"use client"
// Header.js
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/app/dashboard/_components/mobile-sidebar";
import { Logo } from "@/app/dashboard/_components/logo";


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
               <div className="flex items-center gap-1">
            <Image
                height={25}
                width={25}
                alt='logo'
                src="/Logo-2.svg"
            />
            <span className="font-semibold">Tender-Download</span>
        </div>
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
