"use client"
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";



export default function SearchUsers() {

    const [searchData, setSearchData] = useState("");

    const searchUsers = useMutation({
        mutationFn: () => api.searchUsers({ content: searchData }),
    })


    const handleChange = (e: any) => {
        setSearchData(e.target.value);
        searchUsers.mutate();
    }


    return (
        <div className="flex flex-col">
            <div className="w-full mb-4">
                <input value={searchData} onChange={handleChange} className="px-4 w-full py-2 bg-slate-100 dark:bg-slate-600 outline-none" type="text" placeholder="Start typing to search.." />
            </div>
            <div className="overflow-y-scroll no-scrollbar ">
                {!searchUsers.isSuccess ? null :
                    <div className="flex flex-col gap-6">
                        {searchUsers.data.map((user: any, index: number) => (
                            <div key={index} className="flex bg-slate-200 dark:bg-slate-800 px-2 h-20 items-center w-full">
                                <div className="border-r-4 pr-2">
                                    {user.image ? <img src={user.image} className="rounded-full w-16" alt="could not render image" /> : <UserCircleIcon width={65} />}
                                </div>
                                <div className="flex flex-col ml-2">
                                    <p className="font-bold">{user.name ? user.name : user.userName}</p>
                                    <p className="text-sm">{user.email}</p>
                                </div>
                                <div className="flex ml-auto mr-2">
                                    <Link
                                        className="px-4 py-2 bg-gradient-to-b from-slate-100 to-slate-400 hover:from-slate-300 hover:to-slate-500  dark:from-slate-950 dark:to-slate-600 rounded-full hover:underline transition-colors dark:hover:from-slate-800 dark:hover:to-slate-200"
                                        href={process.env.NEXT_PUBLIC_BASE_URL + "/profilepage/" + user.id}>
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};