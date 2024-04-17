"use client"
import LeftSection from "@/app/main-components/LeftSection";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import Link from "next/link";
import Post from "@/app/components/Post";






interface Post {
    id: number;
    title: string;
    description: string;
    postImage: string;
    tags: any;
    created_at: string;
    user: any;
}

export default function Middle() {

    const { data: session } = useSession();

    const posts = useQuery({
        queryKey: ["posts"],
        queryFn: () => api.getPosts(),
    });

    return (
        <LeftSection>
            <div className="w-full flex flex-col">
                {posts.isSuccess ? (
                    <>
                        <h1 className="w-full py-4 underline bg-slate-200 dark:bg-slate-800 text-center text-2xl">My feed</h1>
                        {posts.data.map((post: Post, index: number) => (
                            <Post key={index} imageClass="h-52 w-full object-cover " post={post} />
                        ))}
                    </>
                ) : null}
            </div>
        </LeftSection>
    );
}