import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import Image from 'next/image';

function Header() {
  return (
    <div className="sticky top-0 z-40 border-b py-3 backdrop-filter backdrop-blur-lg bg-opacity-80">
      <div className="container flex justify-between items-center mx-auto">
        <div className="flex items-center">
          <Image
            height={32}
            width={32}
            src="/Mlogo.png"
            alt="MercyCorps Logo"
          />
          <span className="text-xl font-bold text-rose-600">MercyCorps</span>
        </div>
        <nav className="flex gap-3">
          <OrganizationSwitcher />
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

export default Header;
