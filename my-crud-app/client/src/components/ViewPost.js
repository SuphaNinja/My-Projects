import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import axios from "axios";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function ViewPost ({ postId }) {
    

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
  

    return (
        <div className="flex flex-col bg-secondary w-full h-[90vh]">
            <button onClick={() => console.log(post)}>post</button>
            <button onClick={() => console.log(postId)}>{post?.data?.data?.post?.title}</button>
            <div className="h-full flex flex-col">
                <p className="text-xl font-semibold text-center underline">
                    Comments 
                    <span className=" ml-2">({post.data?.data?.post.comments.length})</span>
                </p>
                <div className="overflow-y-scroll no-scrollbar my-2 border-y-4 h-4/6">
                    <div className="flex flex-col gap-2 ">
                        {post.data?.data?.post.comments.length > 0 && post.data?.data?.post.comments.map((comment, index) => (
                            <div key={index}>
                                <Comment comment={comment}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col mt-4 px-4">
                    <p className="text-lg font-semibold ml-2">Write a comment</p>
                    <input 
                        name="comment"
                        value={commentData.comment}
                        onChange={handleChange}
                        className="w-full rounded-xl bg-default border-2 border-slate-400 "
                    />
                    <button onClick={commentOnPost.mutate} className="text-center bg-important rounded-xl py-2 mt-2 text-white w-1/2 mx-auto hover:underline">Comment!</button>
                </div>
            </div>
            
        </div>
    )
}