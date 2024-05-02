"use client"


import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ToggleTheme } from "./ToggleTheme";


export default function NavBar() {

    const { data:session } = useSession()


    return (
        <div className="md:w-full grid grid-flow-row md:grid-flow-col bg-gradient-to-b shadow-xl py-4 md:px-8 justify-center md:justify-between border-b-2 border-black items-center to-slate-400 from-slate-300 dark:from-slate-800 dark:to-slate-700">
            <div>
                <Button onClick={() => console.log(session)}>Friends</Button>
                <Button>Friends</Button>
            </div>
            <div className="">
                <p className="font-bold font-serif text-2xl text-center">Welcome to League Of Memory</p>
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