import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function ViewPost({ postId, setIsVeiwingComments, isViewingComments }) {
    

    const queryClient = useQueryClient();

    const post = useQuery({
        queryKey: ["post", postId],
        queryFn: () => axiosInstance.post("/get-post", { postId }),
        enabled: !!postId, // Only enable the query if postId is defined
    });

    const [commentData, setCommentData] = useState({
        comment: "",
        postId: postId
    });

    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => axiosInstance.get("/get-current-user")
    })

    const commentOnPost = useMutation({
        mutationFn: (data) => axios.post("http://localhost:5050/comment-post", commentData, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }),
        onSuccess: () =>{ 
            queryClient.invalidateQueries(["post"])
            toast("Comment added Successfully!")
            setCommentData({
                comment: "",
                postId: postId
            });
        }
       
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCommentData((prevCommentData) => ({
            ...prevCommentData,
            [name]: value
        }));
    };

    useEffect(() => {
        setCommentData({
            comment: "",
            postId: postId
        });
    },[postId])

    
  

    if (!postId) {
        return null
    } else {
        return (
            <div className={`flex z-50 flex-col md border-t-4 md:border-l-4 border-slate-700 bg-default w-full h-[40vh] md:h-[90vh]`}>
                <p className="font-semibold text-md md:text-xl text-center">{post?.data?.data?.post?.title}</p>
                <div className="h-full flex flex-col">
                    <div className="flex justify-between">
                        <p className="md:text-xl text-sm font-semibold text-center underline">
                            Comments
                            <span className=" ml-2">({post.data?.data?.post.comments.length})</span>
                        </p>
                        <button onClick={() => setIsVeiwingComments(!isViewingComments)}>Close</button>
                    </div>
                    <div className="overflow-y-auto no-scrollbar my-2 md:border-y-4 h-4/6">
                        <div className="flex flex-col ">
                            {post.data?.data?.post.comments.length > 0 && post.data?.data?.post.comments.map((comment, index) => (
                                <div key={index}>
                                    <Comment comment={comment}/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:mt-4 md:border-none border-2 px-4">
                        {user?.data?.data?.error ?
                            <div className="flex items-center justify-center gap-2">
                                <Link className="font-semibold hover:underline" to="/login">Login</Link>
                                <p>or</p>
                                <Link className="font-semibold hover:underline" to="/signup">Sign up</Link>
                                <p>to comment!</p>
                            </div>
                            : 
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold ml-2">Write a comment</p>
                                <input
                                    name="comment"
                                    value={commentData.comment}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-default border-2 border-slate-400 "
                                />
                                <button
                                    onClick={commentOnPost.mutate} className="text-center bg-important rounded-md md:rounded-xl py-1 md:py-2 md:mt-2 text-white w-full md:w-1/2 mx-auto hover:underline">
                                    Comment!
                                </button>
                            </div>
                        }
                    </div>
                </div>
                
            </div>
        )
    }
}