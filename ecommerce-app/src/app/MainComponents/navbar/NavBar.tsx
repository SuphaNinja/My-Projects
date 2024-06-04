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

export default function NavBar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

    const [showExplore, setShowExplore] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    return (
        <header className="flex w-full bg-slate-200 h-auto items-center text-black justify-between shadow-xl p-2 sm:flex-row flex-col">
            <div className="flex justify-between items-center w-full sm:w-auto">
                <Link href={process.env.NEXT_PUBLIC_URL + "/"} className="text-2xl text-slate-900 font-bold font-serif">ElectroBuy</Link>
                <button onClick={toggleSidebar} className="lg:hidden flex items-center px-2 py-1 hover:bg-slate-400 rounded-full transition-colors">
                    <Bars3Icon className="w-6 h-6" />
                </button>
            </div>
            <button onClick={() => setShowExplore(!showExplore)} className="px-2 py-1 hover:bg-slate-400 rounded-full transition-colors hidden sm:block">Explore &#x2193;</button>
            {showExplore && <Explore />}
            <div className="flex gap-1 rounded-full border-2 h-14 px-2 w-full sm:w-1/3 border-slate-500 items-center my-2 sm:my-0">
                <button className="w-1/12">All &#x2193;</button>
                <input
                    type="text"
                    placeholder="Search"
                    className="h-full w-10/12 bg-slate-200 border-x-2 border-slate-400 px-2 outline-none"
                />
                <button className="w-1/12"><MagnifyingGlassIcon className="mx-auto" width={25} /></button>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button onClick={() => setShowAccount(!showAccount)} className="flex items-center gap-2"><UserIcon width={25} /> Account &#x2193;</button>
                    {showAccount && <Account signOut={() => signOut()} />}
                </div>
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
