"use client";

import { MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Explore from "./Explore";
import Account from "./Account";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ToggleTheme } from "@/components/ui/ToggleTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NavBar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

    const [showExplore, setShowExplore] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    return (
        <header className="flex max-w-screen bg-background items-center justify-between border-b shadow-xl py-4 md:pr-6 md:px-12 sm:flex-row flex-col">
            <div className="flex md:mb-0 mb-2 justify-evenly items-center w-full sm:w-auto">
                <ToggleTheme />
                <Button asChild variant="link" className="text-2xl font-bold font-serif">
                    <Link href={process.env.NEXT_PUBLIC_URL + "/"} >ElectroBuy</Link>
                </Button>
                <Button variant="link" onClick={toggleSidebar} className="lg:hidden">
                    <Bars3Icon className="w-6 h-6" />
                </Button>
            </div>
            <Button 
                variant="link"
                onClick={() => setShowExplore(!showExplore)} 
                className="hidden md:block">
                Explore &#x2193;
            </Button>
            {showExplore && <Explore />}
            <div className="flex rounded-full border mx-auto px-2 w-full sm:w-1/3 items-center ">
                <Button variant="link" className="w-1/12">All &#x2193;</Button>
                <Input type="text" placeholder="Search"/>
                <Button variant="link" className="">
                    <MagnifyingGlassIcon className="" width={25}/>
                </Button>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Button 
                        variant="link"
                        onClick={() => setShowAccount(!showAccount)} 
                        className="flex items-center gap-2"><UserIcon width={25} />
                        Account &#x2193;
                    </Button>
                    {showAccount && <Account signOut={() => signOut()} />}
                </div>
                <Button
                    variant="link"
                    onClick={() => setShowExplore(!showExplore)}
                    className="md:hidden block">
                    Explore &#x2193;
                </Button>
                {user.data ?
                    <Link href={process.env.NEXT_PUBLIC_URL + "/pages/shoppingcart"} className="flex items-center">
                        <ShoppingCartIcon width={25} />
                        <span>({user.isSuccess && user.data.carts.length})</span>
                    </Link>
                    :
                    <Link href={process.env.NEXT_PUBLIC_URL + "/pages/shoppingcart"} className="flex items-center">
                        <ShoppingCartIcon width={25} />
                    </Link>
                }
            </div>
        </header>
    );
}
