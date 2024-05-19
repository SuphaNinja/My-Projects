import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import BlogFeed from "../components/BlogFeed";
import { useState } from "react";
import ViewPost from "../components/ViewPost";


export default function Home () {

    const [clickedPostId, setClickedPostId] = useState();


    const posts = useQuery({
        queryKey: ["posts"],
        queryFn: () => axiosInstance.get("/get-posts")
    });






    return (
        <div className="grid mt-4 grid-cols-6 w-full">
            
            <div className="col-span-4 overflow-y-scroll max-h-screen border-r-4 border-slate-700 flex flex-col gap-4 h-screen w-full">
                {posts.isSuccess ?
                    posts.data?.data?.posts?.map((post, index) => (
                        <div key={index}>
                            <BlogFeed setClickedPostId={setClickedPostId} post={post} />
                        </div>
                    ))
                    : null
                }
            </div>
            <div className="col-span-2 bg-green-500 h-screen w-full">
                <ViewPost postId={clickedPostId}/>
            </div>  
        </div>
    )   
}