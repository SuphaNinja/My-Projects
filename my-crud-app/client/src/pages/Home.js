import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import BlogFeed from "../components/BlogFeed";
import { useState } from "react";
import ViewPost from "../components/ViewPost";
import { Skeleton } from "src/components/ui/skeleton";


export default function Home() {
    const [isViewingComments, setIsVeiwingComments] = useState(false);
    const [clickedPostId, setClickedPostId] = useState();

    const posts = useQuery({
        queryKey: ["posts"],
        queryFn: () => axiosInstance.get("/get-posts")
    });

    return (
        <div className="md:mt-4 md:grid md:grid-cols-6 flex flex-col md:flex-row h-[90vh] w-full">
            <div
                className={`transition-all duration-500 ${isViewingComments ? 'col-span-4' : 'col-span-6'} 
                md:pb-2 overflow-y-auto flex flex-col md:gap-4 h-full md:h-[90vh] w-full scroll-snap-y scroll-smooth`}
            >
                {posts.isSuccess ? (
                    posts.data?.data?.posts?.map((post, index) => (
                        <div key={index} className="scroll-snap-start scroll-margin-top">
                            <BlogFeed
                                setClickedPostId={setClickedPostId}
                                clickedPostId={clickedPostId}
                                post={post}
                                isViewingComments={isViewingComments}
                                setIsVeiwingComments={setIsVeiwingComments}
                            />
                        </div>
                    ))
                ) : (
                posts.isLoading && (
                    <div className="flex flex-col  mx-auto space-y-3">
                        <Skeleton className="md:h-[400px] md:w-[750px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[700px]" />
                            <Skeleton className="h-4 w-[700px]" />
                        </div>
                    </div>
                )
                )}
            </div>
            <div
                className={`transition-all duration-500 ${isViewingComments ? 'block ' : 'hidden '}
                md:col-span-2 h-2/12  w-full`}
            >
                {clickedPostId && (
                    <ViewPost
                        postId={clickedPostId}
                        isViewingComments={isViewingComments}
                        setIsVeiwingComments={setIsVeiwingComments}
                    />
                )}
            </div>
        </div>
    )
}