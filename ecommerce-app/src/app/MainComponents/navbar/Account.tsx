"use client"
import { BriefcaseIcon, HeartIcon, MapPinIcon, UserIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";



export default function Account({ signOut }: any) {

    const { data: session } = useSession();

    return (
        <div className="flex flex-col absolute top-12 mt-1 w-48 -left-10 bg-slate-200 px-4 pt-2 rounded-b-lg z-10 border-b-2 border-x-2 border-slate-500 shadow-xl">
            <h1 className="font-semibold text-xl border-b-2 mb-2 border-slate-500">Welcome</h1>
            {session ?
                <div className="flex flex-col font-semibold gap-2 pb-2">
                    <Link href="#" className="flex border-b-1 hover:underline border-slate-500"><UserIcon width={20} />{session.user?.email}</Link>
                    <Link href="#" className="flex border-b-1 hover:underline border-slate-500"><BriefcaseIcon width={20} />Your orders</Link>
                    <Link href="#" className="flex border-b-1 hover:underline border-slate-500"><MapPinIcon width={20} />Track an order</Link>
                    <Link href={process.env.NEXT_PUBLIC_URL + "/pages/wishlist"} className="flex border-b-1 hover:underline border-slate-500"><HeartIcon width={20} />Wishlist</Link>
                    <button className="font-semibold hover:underline" onClick={signOut}>Sign out</button>
                </div>
                :
                <div className="flex flex-col pr-4 gap-2 pb-2">
                    <Link href="/auth/signin" className="border-b-1 hover:underline border-slate-500">Sign in</Link>
                    <Link href="/auth/signup" className="text-tiny font-semibold border-b-1 hover:underline border-slate-500">Create an account</Link>
                </div>
            }
        </div>
    )
}