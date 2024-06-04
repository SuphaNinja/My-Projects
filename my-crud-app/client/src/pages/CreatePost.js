import { useLayoutEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function CreatePost () {
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        title: "",
        description: "",
        imageUrl: "",
        file: null
    });

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

    const createPost = useMutation({
        mutationFn: (data) => axios.post("http://localhost:5050/create-post", data, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }),
        onSuccess: (response) => {
            console.log("Post created successfully:", response.data);
        },
        onError: (error) => {
            console.error("Error creating post:", error);
        }
    });

    

    const fetchedUser = useQuery({
        queryKey: ["user"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = fetchedUser?.data?.data?.success;

    const post = (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("imageUrl", formData.imageUrl);
        if (formData.file) {
            data.append("file", formData.file);
        }
        createPost.mutate(data);
    };
    

    return ( 
        <div className="w-full  md:mt-24 flex justify-center" >
            <div className="bg-secondary md:w-auto w-full md:rounded-md p-8 flex flex-col justify-center">
                <p className="text-xl text-center font-semibold">Create a post!</p>
                <form 
                    onSubmit={(e) => {e.preventDefault(); post(formData)}} 
                    className="grid grid-cols-2 mt-4 gap-4 w-full items-center justify-center"
                >
                    <div className="col-span-2  font-medium">
                        <p>Title</p>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="rounded-md w-full px-2 py-1"
                            placeholder="Title"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 font-medium">
                        <p>Description</p>
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="rounded-md w-full px-2 py-1"
                            placeholder="Description"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 font-medium">
                        <p>ImageUrl</p>
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="rounded-md w-full px-2 py-1"
                            placeholder="Image URL"
                            type="text"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>ImageFile</p>
                        <input
                            onChange={handleFileChange}
                            type="file"
                            className="text-sm text-stone-500file:mr-5 file:py-1 file:px-3 file:border-[1px]file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"

                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center mt-4 justify-center">
                        <button type="submit" className="text-center text-lg bg-important hover:underline transition-all hover:brightness-100 brightness-75 text-white px-4 py-2 rounded-xl">Create Post!</button>
                    </div>
                    {createPost.isSuccess && <p className="p-4 col-span-2 text-xl text-center bg-green-500 font-semibold">{createPost.data.data.success}</p>}
                </form>
            </div>
        </div>
    )
}