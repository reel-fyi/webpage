import { DarkThemeToggle, Navbar } from "flowbite-react";
import Image from 'next/image'
import { UserButton } from "@clerk/nextjs";

const Header = ({ showUserButton = false }: { showUserButton?: boolean }) => {
    return (
        <header className="top-0 stick z-20">
            <Navbar fluid>
                <Navbar.Brand href="https://reel.fyi">
                    <Image
                        alt="Reel.fyi Logo"
                        height="48"
                        src="/logo.png"
                        width="48"
                    />
                    <span className="self-center whitespace-nowrap px-3 text-2xl font-semibold dark:text-white">Reel.fyi</span>
                </Navbar.Brand>
                <div className="flex md:order-2 items-center gap-2">
                    {showUserButton ? <UserButton afterSignOutUrl="/auth/signup" /> : null}
                    <DarkThemeToggle />
                </div>
            </Navbar>
        </header>
    )
}

export default Header;