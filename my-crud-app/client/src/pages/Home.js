import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import BlogFeed from "../components/BlogFeed";
import { useState } from "react";
import ViewPost from "../components/ViewPost";


export default function Home () {

    const [ isViewingComments, setIsVeiwingComments ] = useState(false);

    const [clickedPostId, setClickedPostId] = useState();


    const posts = useQuery({
        queryKey: ["posts"],
        queryFn: () => axiosInstance.get("/get-posts")
    });






    return (
        <div className="md:grid md:mt-4 flex flex-col  md:grid-cols-6 h-[90vh] w-full">
            <div className={`${isViewingComments ? "md:col-span-4" : "md:col-span-6"} md:pb-2 overflow-y-auto md:max-h-screen flex flex-col md:gap-4 h-full md:h-[90vh] w-full scroll-snap-y scroll-smooth`}>
                {posts.isSuccess ?
                    posts.data?.data?.posts?.map((post, index) => (
                        <div key={index} className="scroll-snap-start  scroll-margin-top">
                            <BlogFeed 
                                setClickedPostId={setClickedPostId} 
                                clickedPostId={clickedPostId} 
                                post={post}
                                isViewingComments={isViewingComments}
                                setIsVeiwingComments={setIsVeiwingComments}
                            />
                        </div>
                    ))
                    : <p>No posts in the feed.</p>
                }
            </div>
            <div className={`${isViewingComments ? "": "hidden"} md:col-span-2  h-2/12 md:h-[90vh] w-full`}>
                {clickedPostId && 
                    <ViewPost 
                        postId={clickedPostId} 
                        isViewingComments={isViewingComments}
                        setIsVeiwingComments={setIsVeiwingComments}
                    />
                    }
            </div>  
        </div>
    )   
}