import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";


import { HeartIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";


export default function Comment(comment) {

    const [isEditing, setIsEditing] = useState(false);
    const [editCommentData, setEditCommentData] = useState({
        content: "",
        commentId: ""
    });

    const queryClient = useQueryClient();

    function formatTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return `${interval} years ago`;
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return `${interval} months ago`;
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return `${interval} days ago`;
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return `${interval} hours ago`;
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return `${interval} minutes ago`;
        }

        return `${Math.floor(seconds)} seconds ago`;
    };

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });

    const deleteComment = useMutation({
        mutationFn: (commentId) => axiosInstance.post("/delete-comment", { commentId })
    });

    const handleDeleteComment = (commentId) => {
        deleteComment.mutate(commentId)
        setTimeout(() => {
            queryClient.invalidateQueries(["post"]);
        }, 50);
        toast("Comment has been deleted!")
    };

    const editComment = useMutation({
        mutationFn: (commentData) => axiosInstance.post("/edit-comment", { commentData }),
        onSuccess: (data) => {
            if(data.data.error) {
                toast.error(`${data.data.error}`)
            } else {
                toast.success("Comment has been edited!")
            }
            
        }
    });

    const handleEditAndSubmit = (commentData) => {
        if (isEditing) {
            editComment.mutate(commentData);
            setTimeout(() => {
                queryClient.invalidateQueries(["post"]);
                setIsEditing(!isEditing);
            }, 50);
        } else if (!isEditing) {
            setIsEditing(!isEditing);
        } else {
            toast("Something went wrong try again later!");
            return;
        }
    };

    const likeComment = useMutation({
        mutationFn: () => axiosInstance.post("/like-comment", { comment }),
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries(["post"]);
            }, 126);
        }
    });

    useEffect(() => {
        if (comment && comment.comment) {
            setEditCommentData({
                content: comment.comment.content,
                commentId: comment.comment.id
            })
        };
    }, [comment]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditCommentData((prevCommentData) => ({
            ...prevCommentData,
            [name]: value
        }));
    };

    const isLiked = (comment, currentUser) => {
        return comment.comment.likes.some(like => like.userId === currentUser?.id);
    };

    if (comment.comment.length < 1) { return ( <p className="text-xl ">No comments yet!</p> )};

    return (
        <div className="grid  grid-cols-6">
            <div className="col-span-1 flex flex-col">
                <div className="flex justify-center my-auto">
                    {comment.comment.user.Profilemage !== null ?
                        <img src={comment.comment.user.Profilemage} />
                        :
                        <UserCircleIcon width={60} />
                    }
                </div>
            </div>
            <div className="col-span-4 border-x-2 px-2">
                <Link to={`/profile/${comment.comment.user.id}`} className=" hover:underline">{comment.comment.user.userName} -
                    <span className={`${comment.comment.user.role === "ADMIN" ? "text-red-500" : "text-emerald-400"} ml-1 text-sm`}>{comment.comment.user.role}</span>
                </Link>
                <p className="text-xs text-gray-400 ">{formatTimeAgo(comment.comment.created_at)}</p>
                <div className="overflow-y-auto max-h-[70px]">
                    {isEditing ?
                        <input
                            name="content"
                            className="rounded-md text-sm px-1 py-1 w-full"
                            value={editCommentData.content}
                            onChange={handleChange}
                            type="text"
                        />
                        :
                        <p className="text-pretty">{comment.comment.content}</p>
                    }
                </div>
            </div>
            <div className="col-span-1 w-full flex flex-col ">
                <button
                    className="flex mx-auto my-auto"
                    onClick={() => likeComment.mutate()}>
                    {!isLiked(comment, currentUser.data.data.success) ?
                        <div
                            className="flex justify-center items-center">
                            <HeartIcon width={25} />{comment.comment.likes.length > 0 ? (comment.comment.likes.length) : null}
                        </div>
                        :
                        <div
                            className="flex relative">
                            <HeartIcon color="red" fill="red" width={25} />
                            <span className="font-semibold">
                                {comment.comment.likes?.length > 0 ? (comment.comment.likes.length) : null}
                            </span>
                        </div>
                    }
                </button>
                {currentUser?.data?.data?.success?.id === comment.comment.userId &&
                    <Button
                        onClick={() => handleEditAndSubmit(editCommentData)}
                        size="xs"
                    >
                        {isEditing ? "Submit" : "Edit"}
                    </Button>
                }
                {currentUser?.data?.data?.success?.role === "ADMIN" ?
                    <Button
                        onClick={() => handleDeleteComment(comment.comment.id)}
                        className="mt-2"
                        variant="destructive"
                        size="xs"
                        >
                        Delete!
                    </Button>
                    : null
                }
            </div>
        </div>
    )
    
}