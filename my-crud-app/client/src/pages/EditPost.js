import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import axiosInstance from "../lib/axiosInstance"
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Label } from "src/components/ui/label";


export default function EditPost() {

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
            setTransitioning(false);
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
            setTransitioning(false);
        }, 500);
    };




    if (post.isLoading) { return (<div>Loading...</div>) };
    if (post.isSuccess) {
        return (
            <div className="flex flex-col md:h-screen  md:mx-80">
                <div className="relative h-1/2 mt-16 w-full">
                    <button onClick={prevImageIndex} className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 left-0"></button>
                    <img
                        src={imageSrcList[imageIndex]}
                        alt={`Image ${imageIndex}`}
                        className={`size-full  ${transitioning ? 'transition-opacity duration-500 opacity-0' : ''}`}
                    />
                    <button onClick={nextImageIndex} className="z-10 h-full w-1/3 hover:bg-slate-500/30 transition-colors absolute top-0 right-0"></button>
                </div>
                <p className="text-2xl font-semibold text-center ">Edit Post</p>
                <div className=" h-1/2  w-full">
                    <form
                        onSubmit={(e) => { e.preventDefault(); update(formData) }}
                        className="flex flex-col gap-2"
                    >
                        <div className=" font-medium">
                        <Label htmlFor="title">Title</Label>
                        <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Title"
                                type="text"
                            />
                        </div>
                        <div className=" font-medium">
                        <Label htmlFor="description">Description</Label>
                            <Input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                type="text"
                            />
                        </div>
                        <div className="col-span-2 font-medium">
                            <Label htmlFor="imageUrl">ImageUrl</Label>
                            <Input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="Replace or add ImageUrl"
                                type="text"
                            />
                        </div>
                        <div className="w-full gap-2 grid grid-cols-2 col-span-2 md:col-span-1">
                            <div className="flex md:flex-col col-span-2 md:col-span-1 font-medium">
                                <p>ImageFile <br /><span className="text-tiny text-prettyfont-light">You can add multiple files on one post!</span></p>
                                <Input
                                    onChange={handleFileChange}
                                    type="file"

                                />
                            </div>
                            <div className="flex items-center mt-2 md:mt-0 col-span-2 md:col-span-1">
                                <Button
                                    type="submit"
                                    className="w-full mt-auto">
                                    Update Post!
                            </Button>
                            </div>
                        </div>
                        {updatePost.data?.data?.success && <p className="bg-emerald-500 py-1 mb-2 text-center font-semibold rounded-full">{updatePost.data.data.success}</p>}
                        {updatePost.data?.data?.error && <p className="bg-red-500 py-1 mb-2 text-center font-semibold rounded-full">{updatePost.data.data.error}</p>}
                    </form>
                </div>
            </div>
        )
    }
}