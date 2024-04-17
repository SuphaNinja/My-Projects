"use client"
import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import { PhoneIcon } from "@heroicons/react/24/outline";


export default function BottomBar() {
    return (
        <div className="flex items-center border-t-2 dark:border-slate-900 bg-slate-400 w-full  h-12 dark:bg-slate-800 absolute bottom-0">
            <div className="flex flex-row gap-4 items-center w-full mx-4">
                <p className="font-semibold">&copy; 2024 Discord Inc</p>
                <div className="flex items-center mx-auto">
                    <p className="mr-2">Find us on: </p>
                    <div className="flex gap-2">
                        <SocialIcon className="cursor-pointer" as="div" style={{ height: 25, width: 25 }} url="www.x.com" />
                        <SocialIcon className="cursor-pointer" as="div" style={{ height: 25, width: 25 }} url="www.discord.com" />
                        <SocialIcon className="cursor-pointer" as="div" style={{ height: 25, width: 25 }} url="www.facebook.com" />
                        <SocialIcon className="cursor-pointer" as="div" style={{ height: 25, width: 25 }} url="www.snapchat.com" />
                        <SocialIcon className="cursor-pointer" as="div" style={{ height: 25, width: 25 }} url="www.tiktok.com" />
                    </div>
                </div>
                <div className="flex items-center hover:underline cursor-pointer">
                    <PhoneIcon width={20} />
                    <p> Contact us </p>
                </div>
            </div>
        </div>
    );
};