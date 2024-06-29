import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance";
import { useState, useRef, useEffect } from "react";
import { BeakerIcon, HeartIcon } from '@heroicons/react/24/outline'
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { debounce } from "lodash";





export default function BlogFeed({ post, setClickedPostId, clickedPostId, setIsVeiwingComments, isViewingComments }) {

   
    const queryClient = useQueryClient();

    const handleViewPost = () => {
        setClickedPostId(post.id === clickedPostId ? null : post.id);
    };

    const likePost = useMutation({
        mutationFn: () => axiosInstance.post("/like-post", { post }),
        onSuccess: () => {
            queryClient.invalidateQueries(["post"])

            if (currentUser.data.data.error) {
                toast(`${currentUser.data.data.error}`)
            } else {
                toast(`${isLiked(post, currentUser?.data?.data?.success) ? "Unliked" : "Liked"} post!`)
            };
        }
    });

    const deletePost = useMutation({
        mutationFn: (postId) => axiosInstance.post("/delete-post", { postId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"])

        }
    });

    const handleDeletePost = (postId) => {
        deletePost.mutate(postId)
        setTimeout(() => {
            queryClient.invalidateQueries(["posts"]);
        }, 50);
        console.log(postId)
    };

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });

    const isLiked = (post, currentUser) => {
        return post.likes.some(like => like.userId === currentUser?.id);
    };

    const blogRef = useRef(null);
    const [threshold, setThreshold] = useState(getThreshold());
    useEffect(() => {
        const handleResize = () => {
            setThreshold(getThreshold());
        };

        window.addEventListener('resize', handleResize);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio > threshold) {
                    setClickedPostId(post.id);
                }
            },
            { threshold }
        );

        if (blogRef.current) {
            observer.observe(blogRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (blogRef.current) {
                observer.unobserve(blogRef.current);
            }
        };
    }, [post.id, threshold, setClickedPostId]);

    function getThreshold() {
        return window.innerWidth < 768 ? 0.5 : 0.8;
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const options = {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    };

    const [imageSrcList, setImageSrcList] = useState([]);

    useEffect(() => {
        if (post) {
            const newImageSrcList = [];

            if (post.imageUrl) {
                newImageSrcList.push(post.imageUrl);
            }
            if (post.image.length > 0) {
                post.image.forEach(image => {
                    newImageSrcList.push("http://localhost:5050" + image.filePath);
                });
            }

            setImageSrcList(newImageSrcList);
        }
    }, [post]);

    const [transitioning, setTransitioning] = useState(false);

    const [imageIndex, setImageIndex] = useState(0);

    const prevImageIndex = () => {
        if (imageSrcList.length === 1) {
            return;
        }
        setTransitioning(true);
        setTimeout(() => {
            if (imageIndex === 0) {
                setImageIndex(imageSrcList.length - 1);
            } else {
                setImageIndex(imageIndex - 1);
            }
            setTransitioning(false); // Deactivate transition after image change
        }, 500);
    };

    const nextImageIndex = () => {
        if (imageSrcList.length === 1) {
            return;
        }
        setTransitioning(true);
        setTimeout(() => {
            if (imageIndex === imageSrcList.length - 1) {
                setImageIndex(0);
            } else {
                setImageIndex(imageIndex + 1);
            }
            setTransitioning(false); // Deactivate transition after image change
        }, 500);
    };


    return (
        <div ref={blogRef} className="h-full max-h-screen md:max-h-[88vh]  flex flex-col items-center">
            <div className={`md:w-5/6 w-full hover:brightness-90  md:rounded-xl border-b-2 h-full md:h-[88vh]  md:overflow-hidden md:flex-col`}>
                <div className="relative md:h-3/6 w-full h-7/12">
                    {imageSrcList.length > 1 &&
                        <button
                            onClick={prevImageIndex}
                            className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 left-0">
                        </button>
                    }
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex overflow-x-auto ">
                        {imageSrcList.length > 1 && imageSrcList.map((image, index) => (
                            <div key={index} className={`flex p-2 border-2  rounded-md ${index === imageIndex ? "border-yellow-500" : "border-slate-400"}`}>
                                <button onClick={() => setImageIndex(index)}>
                                    <img src={image} className="w-[35px] h-[35px] object-cover" alt="product image" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <img
                        src={imageSrcList[imageIndex]}
                        className={`w-full md:h-full h-[35vh]  object-cover ${transitioning ? 'transition-opacity duration-500 opacity-0' : ''}`}
                    />
                    {imageSrcList.length > 1 &&
                        <button
                            onClick={nextImageIndex}
                            className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 right-0">
                        </button>
                    }

                </div>
                <div className="md:flex-col md:flex w-full md:h-3/6 ">
                    <h2 className="text-center font-semibold md:text-xl underline">{post.title}</h2> 
                    <p className="px-1 md:px-4 overflow-y-auto max-h-[40vh] text-sm  md:mt-4 ">{post.description}</p>
                    <div className="flex  items-center  p-2 justify-between">
                        <div className="flex  text-center flex-col gap-2">
                            <p>Posted by: {post.user.userName}</p>
                            <p>Posted at: {formatDateTime(post.created_at)}</p>
                        </div>
                        <button
                            className=" font-semibold text-sm md:text-md hover:underline text-center"
                            onClick={() => setIsVeiwingComments(!isViewingComments)}>
                            {isViewingComments ? "Close comments" : "View comments"}
                        </button>
                        {currentUser.isSuccess &&
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex md:items-center md:justify-center "
                                    onClick={() => likePost.mutate()}>
                                    {!isLiked(post, currentUser.data.data.success) ?
                                        <div className="flex"> <HeartIcon width={35} />{post.likes.length > 0 ? (post.likes.length) : null}</div>
                                        :
                                        <div className="flex"><HeartIcon color="red" fill="red" width={35} />{post.likes.length > 0 ? (post.likes.length) : null}</div>
                                    }
                                </button>
                                {currentUser?.data?.data?.success?.role === "ADMIN" &&
                                    <div className="md:ml-auto flex flex-col gap-2">
                                        <Button asChild
                                            variant="default"
                                        >
                                            <Link to={`/editpost/${post.id}`}>
                                                Edit post
                                            </Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleDeletePost(post.id)}
                                            variant="destructive"
                                            className="" >
                                            Delete Post
                                        </Button>
                                    </div>
                                }
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}