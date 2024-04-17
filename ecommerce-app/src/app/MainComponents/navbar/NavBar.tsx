"use client";

import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/16/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Explore from "./Explore";
import Account from "./Account";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";



export default function NavBar() {

    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

    const [showExplore, setShowExplore] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    return (
        <header className="flex w-full bg-slate-200 h-20 items-center text-black justify-between shadow-xl">
            <button onClick={() => console.log(user)}> trest</button>
            <Link href={process.env.NEXT_PUBLIC_URL + "/" } className="mr-auto text-2xl ml-2 text-slate-900 font-bold font-serif">ElectroBuy</Link>
            <button onClick={() => setShowExplore(!showExplore)} className="px-2  py-1 hover:bg-slate-400 rounded-full transition-colors" >Explore &#x2193;</button>
            {showExplore && <Explore />}
            <div className="flex gap-1 rounded-full border-2 h-14 px-2 w-1/3 border-slate-500 items-center mx-auto">
                <button className="w-1/12 ">All &#x2193;</button>
                <input
                    type="text"
                    placeholder="Search"
                    className="h-full w-10/12 bg-slate-200 border-x-2 border-slate-400 px-2 outline-none"
                />
                <button className="w-1/12"><MagnifyingGlassIcon className="mx-auto" width={35} /></button>
            </div>
            <div className="ml-auto flex items-center gap-6 mr-4">
                <div className="relative">
                    <button  onClick={() => setShowAccount(!showAccount)} className="flex items-center gap-2"><UserIcon width={25} /> Account &#x2193;</button>
                    {showAccount && <Account signOut={() => signOut()} />}
                </div>
                {user.data ?
                    <Link
                        href={process.env.NEXT_PUBLIC_URL + "/pages/shoppingcart"}
                        className="flex"><ShoppingCartIcon width={30} />
                        ({user.isSuccess && user.data.carts.length})
                    </Link>
                    :
                    <Link href={process.env.NEXT_PUBLIC_URL + "/pages/shoppingcart"} className="flex"><ShoppingCartIcon width={30} /></Link>
                }
            </div>
        </header>
    )
}