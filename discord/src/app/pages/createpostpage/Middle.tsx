"use client"

import LeftSection from "@/app/main-components/LeftSection";
import MiddleSection from "@/app/main-components/MiddleSection";
import api from "@/lib/axios";
import { UserWithAccount } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";



export default function Middle({ currentUser, }: { currentUser: UserWithAccount }) {

    const [tags, setTags] = useState<string>("");

    const [postData, setPostData] = useState({
        title: "",
        description: "",
        postImage: "",
    });
    const [createdPost, setCreatedPost] = useState<any>();

    const createPost = useMutation({
        mutationFn: (postWithTags) => api.createPost(postWithTags as any),
        onSuccess: () => { toast.success("Post created successfully!") },
    })

    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        setPostData((prevPostData) => ({
            ...prevPostData,
            [name]: value
        }));
    };

    const handleCreatePost = () => {
        const postWithTags = { ...postData, tags };
        createPost.mutate(postWithTags as any);
        setCreatedPost(postWithTags as any);
        setPostData({
            title: "",
            description: "",
            postImage: "",
        });
        setTags("");
    }

    return (
        <MiddleSection>
            <div className="w-full flex flex-col pt-2">
                <h2 className="text-center text-xl underline mb-4">Create a new post!</h2>
                <div>
                    <div className="flex flex-col md:flex-row gap-8 pt-6 border-slate-900 border-y-2 pb-7 pl-12">
                        <div className="flex flex-col gap-7">
                            <p>Post Image:</p>
                            <p>Title:</p>
                            <p>Description:</p>
                            <p className="flex gap-1">Tags:</p>
                        </div>
                        <div className="flex flex-col gap-4 border-slate-900 border-r-2 pr-4 text-black text-lg">
                            <input
                                name="postImage"
                                value={postData.postImage}
                                onChange={handleFormChange}
                                placeholder="Image url"
                                className="py-1 px-2 bg-slate-400 rounded-md placeholder:text-slate-900"
                            />
                            <input
                                name="title"
                                value={postData.title}
                                onChange={handleFormChange}
                                placeholder="Post title"
                                className="py-1 px-2 bg-slate-400 rounded-md placeholder:text-slate-900"
                            />
                            <input
                                name="description"
                                value={postData.description}
                                onChange={handleFormChange}
                                placeholder="Post description"
                                className="py-1 px-2 bg-slate-400 rounded-md placeholder:text-slate-900"
                            />
                            <input
                                name="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Tags (comma-separated)"
                                className="py-1 px-2 bg-slate-400 rounded-md placeholder:text-slate-900"
                            />
                        </div>
                        <button onClick={() => handleCreatePost()} className="bg-gradient-to-b text-white from-slate-950 to-slate-800 hover:underline py-2 px-4 rounded-full text-xl my-auto">Post!</button>
                    </div>
                    <div>
                        {createdPost !== undefined || null ?
                            <div className="flex h-52 gap-2 w-full">
                                <div className="w-1/2">
                                    <img className="size-full object-cover" src={createdPost.postImage} />
                                </div>
                                <div className="w-1/2 flex flex-col gap-2">
                                    <p className="text-2xl text-center underline">{createdPost.title}</p>
                                    <p className="text-xl text-center">{createdPost.description}</p>
                                    <p className="mt-auto mb-2">{createdPost.tags.split(",").map((tag: any, index: any) => (
                                        <span key={index} className="text-slate-400 mx-1">#{tag}</span>
                                    ))}</p>
                                </div>
                            </div>
                            : <div className="text-center"> Created post will show here.</div>
                        }
                    </div>
                </div>
            </div>
        </MiddleSection>
    );
};