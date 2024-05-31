import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import axiosInstance from "../lib/axiosInstance"
import { useState, useEffect } from "react";
import axios from "axios";


export default function EditPost () {

    const { postId } = useParams();
    
    const post = useQuery({
        queryKey: ["post"],
        queryFn: () => axiosInstance.post("/get-post", { postId })
    });

    const [formData, setFormData] = useState({
        title: post?.data?.data?.post?.title || "",
        description: post?.data?.data?.post?.description || "",
        imageUrl: post?.data?.data?.post?.imageUrl || "",
        file: null,
        postId: postId
    });

    const queryClient = useQueryClient();


    

    const updatePost = useMutation({
        mutationFn: (data) => axios.post("http://localhost:5050/edit-post", data, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }),
    })

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        setFormData({
            ...formData,
            file: file // Update the imageFile property with the selected file
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const update = (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("imageUrl", formData.imageUrl);
        data.append("postId", formData.postId);
        if (formData.file) {
            data.append("file", formData.file);
        }
        updatePost.mutate(data);
        queryClient.invalidateQueries(["post"]);
    };

    const [imageSrcList, setImageSrcList] = useState([]);

    useEffect(() => {
        if (post.isSuccess && post.data) {
            const newImageSrcList = [];

            if (post.data.data.post.imageUrl) {
                newImageSrcList.push(post.data.data.post.imageUrl);
            }
            if (post.data.data.post.image.length > 0) {
                post.data.data.post.image.forEach(image => {
                    newImageSrcList.push("http://localhost:5050" + image.filePath);
                });
            }

            setImageSrcList(newImageSrcList);
        }
    }, [post.isSuccess, post.data]);

    const [transitioning, setTransitioning] = useState(false);

    const [imageIndex, setImageIndex] = useState(0);

    const prevImageIndex = () => {
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


    

    if (post.isLoading) { return ( <div>Loading...</div> ) };
    if (post.isSuccess) {
        return (
            <div className="md:mx-48 flex flex-col items center">
                <div className="h-[88vh] border-b-2 shadow-red-600 shadow-md border-slate-500 pb-2 mt-4 overflow-hidden rounded-md">
                    <div className="relative h-1/2 w-full">
                        <button onClick={prevImageIndex} className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 left-0"></button>
                            <img
                                src={imageSrcList[imageIndex]}
                                alt={`Image ${imageIndex}`}
                                className={`w-full rounded-t-xl h-full  ${transitioning ? 'transition-opacity duration-500 opacity-0' : ''}`}
                            /> 
                        <button onClick={nextImageIndex} className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 right-0"></button>
                    </div>
                    <p className="text-2xl font-semibold text-center border-b-2 border-x-2 border-slate-700">Edit Post</p>
                    <div className="grid grid-cols-6 h-1/2 w-full">
                        <div className="bg-emerald-500 col-span-1">
                            <img
                                src="https://media.istockphoto.com/id/465504593/photo/golden-temple-dragon.jpg?s=612x612&w=0&k=20&c=XEshhnJCEdbAL1mAj3-USS2Dt1UXoRhgXuq3gvzBG3Y="
                                className=""
                            />
                        </div>
                        <form
                            onSubmit={(e) => { e.preventDefault(); update(formData) }}
                            className="flex flex-col justify-evenly pb-4 px-2 col-span-4 "
                        >
                            <div className=" font-medium">
                                <p>Title</p>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="rounded-md w-full border-2 border-slate-500 px-2 py-1"
                                    placeholder="Title"
                                    type="text"
                                />
                            </div>
                            <div className=" font-medium">
                                <p>Description</p>
                                <input
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="rounded-md w-full border-2 border-slate-500 px-2 py-1"
                                    placeholder="Description"
                                    type="text"
                                />
                            </div>
                            <div className="col-span-2 font-medium">
                                <p>ImageUrl</p>
                                <input
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="rounded-md w-full border-2 border-slate-500 px-2 py-1"
                                    placeholder="Replace or add ImageUrl"
                                    type="text"
                                />
                            </div>
                            <div className="w-full grid grid-cols-3">
                                <div className="col-span-1 font-medium">
                                    <p>ImageFile <br/><span className="text-tiny font-light">You can add multiple files on one post!</span></p>
                                    <input
                                        onChange={handleFileChange}
                                        type="file"
                                        className="text-sm text-stone-500file:mr-5 file:py-1 file:px-3 file:border-[1px]file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"

                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <div className="bg-gradient-to-b from-emerald-500 to-cyan-500 h-full w-1" />
                                </div>
                                <div className="flex col-span-1">
                                    <button 
                                        type="submit" 
                                        className="text-center text-lg bg-important hover:underline transition-all hover:brightness-100 brightness-75 text-white px-2 rounded-xl">
                                            Update Post!
                                    </button>
                                </div>
                            </div>
                            {updatePost.data?.data?.success && <p className="bg-emerald-500 py-1 mb-2 text-center font-semibold rounded-full">{updatePost.data.data.success}</p>}
                            {updatePost.data?.data?.error && <p className="bg-red-500 py-1 mb-2 text-center font-semibold rounded-full">{updatePost.data.data.error}</p>}
                        </form>
                        <div className="col-span-1 h-full">
                            <img 
                                src="https://media.istockphoto.com/id/465504593/photo/golden-temple-dragon.jpg?s=612x612&w=0&k=20&c=XEshhnJCEdbAL1mAj3-USS2Dt1UXoRhgXuq3gvzBG3Y="
                                className=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}