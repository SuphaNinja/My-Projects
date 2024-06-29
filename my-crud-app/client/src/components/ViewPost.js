import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import Comment from "./Comment";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

export default function ViewPost({ postId, setIsVeiwingComments, isViewingComments }) {


    const queryClient = useQueryClient();

    const post = useQuery({
        queryKey: ["post", postId],
        queryFn: () => axiosInstance.post("/get-post", { postId }),
        enabled: !!postId, 
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
        onSuccess: (data) => {
            if(data?.data?.success) {
                queryClient.invalidateQueries(["post"])
                toast.success("Comment added Successfully!")
                 setCommentData({
                    comment: "",
                    postId: postId
                });
            }
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
    }, [postId])

    if (post.isLoading) {
        return (
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        )
    }


    if (!postId) {
        return null
    } else {
        return (
            <div className={`flex z-50 flex-col md border-t-4 md:border-l-4 border-slate-700 bg-default w-full h-[40vh] md:h-[90vh]`}>
                <p className="font-semibold text-md md:text-xl text-center">{post?.data?.data?.post?.title}</p>
                <div className="h-full flex flex-col">
                    <div className="flex justify-between mx-6">
                        <p className="md:text-xl text-sm font-semibold text-center underline">
                            Comments
                            <span className="ml-2">({post.data?.data?.post?.comments.length})</span>
                        </p>
                        <button className="hover:underline" onClick={() => setIsVeiwingComments(!isViewingComments)}>Close</button>
                    </div>
                    <div className="overflow-y-auto no-scrollbar mt-2 h-4/6">
                        <div className="flex flex-col gap-2">
                            {post.data?.data?.post.comments.length > 0 && post.data?.data?.post.comments.map((comment, index) => (
                                <div key={index} className="border-y-2 py-2">
                                    <Comment comment={comment} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col my-auto  px-4">
                        {!user.data?.data ?
                            <div className="flex items-center justify-center gap-2">
                                <Button asChild >
                                    <Link to="/login">Login</Link>
                                </Button>
                                <p>or</p>
                                <Button asChild>
                                    <Link to="/signup">Sign up</Link>
                                </Button>
                                <p>to comment!</p>
                            </div>
                            :
                            <div className="flex flex-col">
                                <Label htmlFor="comment" className="mb-2">Write a comment</Label>
                                <Input
                                    name="comment"
                                    value={commentData.comment}
                                    onChange={handleChange}
                                />
                                <Button
                                    onClick={commentOnPost.mutate} 
                                    className=" mt-2"   
                                    size="sm"
                                >
                                    Comment!
                                </Button>
                            </div>
                           
                        }
                        {commentOnPost.data?.data?.error && <p className="text-center bg-red-500 font-semibold mt-1">{commentOnPost.data.data.error}</p>}
                    </div> 
                </div>

            </div>
        )
    }
}