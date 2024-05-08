import { OrganizationSwitcher,SignInButton, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
function Header() {
  return (
    <div className=' sticky top-0 z-40  border-b py-3 bg-gray-50'>
        <div className='container flex justify-between items-center mx-auto'>
            <h2>TenderHub</h2>
            <div className="flex gap-2">
                <OrganizationSwitcher/>
                <UserButton/>
                <SignedOut>
                    <SignInButton>
                        <Button>
                            Sign in
                        </Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>
  )
}

export default Header