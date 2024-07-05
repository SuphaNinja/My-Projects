"use client"
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ToggleTheme } from "./ui/ToggleTheme";
import Link from "next/link";

export default function NavBar() {
    const { data:session } = useSession()

    return (
        <header className="flex max-w-screen bg-background items-center justify-between border-b shadow-xl py-4 md:pr-6 md:px-12 sm:flex-row flex-col">
            <div className="flex md:mb-0 mb-2 justify-evenly items-center w-full sm:w-auto">
                <div className="md:block hidden">
                    <ToggleTheme />
                </div>
                <Button asChild variant="link" className="md:text-2xl text-xl font-bold font-serif">
                    <Link href={process.env.NEXT_PUBLIC_URL + "/"} >League of Memory</Link>
                </Button>
            </div>
            {session?.user ? (
                <div className="flex items-center gap-6">
                    <Button asChild>
                        <Link href={process.env.NEXT_PUBLIC_URL + "pages/GamePage"}>Play!</Link>
                    </Button>
                    <Button asChild>
                        <Link href={process.env.NEXT_PUBLIC_URL + "pages/MatchHistory"}>Match History</Link>
                    </Button>
                    <Button onClick={() => signOut()}>Sign out</Button>
                    <div className="md:hidden">
                        <ToggleTheme />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <Button onClick={() => signIn("github")}>Login</Button>
                    <Button onClick={() => signIn("github")}>Sign up!</Button>
                    <div className="md:hidden">
                        <ToggleTheme />
                    </div>
                </div>
            )}
        </header>
    )
}   