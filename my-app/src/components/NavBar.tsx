"use client"


import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button, ButtonProps } from "./ui/button";
import { ToggleTheme } from "./ToggleTheme";
import { link } from "fs";
import Link from "next/link";


export default function NavBar() {

    const { data:session } = useSession()


    return (
        <div className="md:w-full grid grid-flow-row md:grid-flow-col bg-gradient-to-b shadow-xl py-4 md:px-8 justify-center md:justify-between border-b-2 border-black items-center to-slate-400 from-slate-300 dark:from-slate-800 dark:to-slate-700">
            <div className="flex gap-4">
                <Link
                    href={process.env.NEXT_PUBLIC_URL + "pages/GamePage"}
                    className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300">
                    Play!
                </Link>
                <Link 
                    href={process.env.NEXT_PUBLIC_URL + "pages/MatchHistory"} 
                    className="bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300">
                        Match History
                </Link>
            </div>
            <div className="">
                <Link href={process.env.NEXT_PUBLIC_URL + "/"} className="font-bold font-serif text-2xl text-center">League Of Memory</Link>
            </div>
            <div className="flex gap-2">
                {!session?.user? 
                    <div className="flex gap-2">
                        <Button onClick={() => signIn("github")}>Sign in</Button> {/* add link to signin page later */}
                        <Button >Sign up</Button> {/* add link to signup page later */}
                    </div>
                : 
                    <div className="flex gap-4 items-center">
                        <p className="text-xl font-serif font-semibold">{session.user.name}</p> {/* change to link later when profilepage is done */}
                        <Button onClick={() => signOut()}>Sign Out</Button>
                    </div>
                }
                <ToggleTheme />
            </div>
            
        </div>
    )
}   