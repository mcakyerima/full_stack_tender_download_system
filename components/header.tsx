"use client"
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <div className="sticky top-0 z-40 border-b py-2 shadow-sm backdrop-filter backdrop-blur-lg bg-opacity-80">
      <div className="container flex justify-between items-center mx-auto">
        <a
          href="/"
          className="flex items-center"
        >
            <Image
              height={100}
              width={100}
              src="/Mercy-Corps.svg"
              alt="MercyCorps Logo"
            />
        </a>
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
