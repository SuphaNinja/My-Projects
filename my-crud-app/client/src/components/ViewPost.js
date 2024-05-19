import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import { useEffect } from "react";
import Comment from "./Comment";

export default function ViewPost ({ postId }) {
    

    const post = useQuery({
        queryKey: ["post", postId],
        queryFn: () => axiosInstance.post("/get-post", {postId}),
        enabled: !!postId, // Only enable the query if postId is defined
    });
  

    useEffect(() => {
        if (postId) {
            post.refetch();
        }
    }, [postId]);

    return (
        <div className="flex flex-col bg-secondary  w-full h-screen">
            <button onClick={() => console.log(post)}>postId</button>
            <div className="h-full flex flex-col">
                <p className="text-xl font-semibold text-center underline">Comments</p>
                <div className="overflow-y-scroll my-2 border-y-4 h-4/5">
                    <div>
                        <Comment/>
                    </div>
                </div>
                <div className="flex flex-col mt-4 px-4">
                    <p className="text-lg font-semibold ml-2">Write a comment</p>
                    <input className="w-full rounded-xl bg-default border-2 border-slate-400 "/>
                    <button className="text-center bg-important rounded-xl py-2 mt-2 text-white w-1/2 mx-auto hover:underline">Comment!</button>
                </div>
            </div>
            
        </div>
    )
}