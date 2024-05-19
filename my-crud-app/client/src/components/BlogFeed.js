import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import { useState } from "react";
import { BeakerIcon, HeartIcon } from '@heroicons/react/24/outline' 
import { toast } from "react-toastify";




export default function BlogFeed({ post, setClickedPostId }) {

    const [postIsLiked, setPostIsLiked ] = useState(false);

    const queryClient = useQueryClient();
    
    const handleClick = () => {
        setClickedPostId(post.id)   
    }

    const likePost = useMutation({
        mutationFn: () => axiosInstance.post("/like-post", { post }),
        onSuccess: () => {
            queryClient.invalidateQueries(["post"])
            
            if (currentUser.data.data.error) {
                toast(`${currentUser.data.data.error}`)
            } else {
                toast(`${checkLikeStatus(post, currentUser?.data?.data?.success) ? "Unliked" : "Liked"} post!`)
            }
        }
    });

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });

    const checkLikeStatus = (post, currentUser) => {
        return post.likes.some(like => like.userId === currentUser?.id);
    };


    
    return (
        <div className="col-span-4 flex flex-col  items-center">
            <div className="w-5/6 border-2 rounded-xl border-black max-h-[350px] overflow-hidden md:flex  bg-primary">
                <div className="md:w-4/6 w-full h-full border-r-2 border-slate-700">
                    <img 
                        src={"http://localhost:5050" + post.image[0].filePath} 
                        className="object-cover max-h-[350px] w-full"
                    />
                </div>
                <div className="flex sm:justify-between md:flex-col bg-secondary w-full md:w-2/6 p-2">
                    <h2 className="text-center font-semibold text-xl mt-4 underline">{post.title}</h2> {/* replace with link to postPage */}
                    <hr className="mt-2"/>
                    <p className="text-pretty font-medium mt-4 ">{post.description}</p>
                    <div className="flex mt-auto  md:border-t-2 pt-1 justify-between">
                        {currentUser.isSuccess ?
                            <button
                                className="flex items-center justify-center ml-6 -mb-2"
                                onClick={() => likePost.mutate()}>
                                {!checkLikeStatus(post, currentUser.data.data.success) ? 
                                    <div className="flex"> <HeartIcon width={35} />{post.likes.length > 0 ? (post.likes.length) : null}</div>
                                    : 
                                    <div className="flex"><HeartIcon color="red" fill="red" width={35} />{post.likes.length > 0 ? (post.likes.length) : null}</div>
                                }
                            </button>
                            : null
                        }   
                        <button className="text-center hover:underline text-white mr-2 bg-important rounded-xl py-2 px-4" onClick={handleClick}>View Post</button>
                       
                    </div>
                </div>
            </div>
        </div>
    )
}