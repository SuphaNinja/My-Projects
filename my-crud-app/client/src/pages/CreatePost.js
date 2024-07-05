import { useLayoutEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Button } from "src/components/ui/button";


export default function CreatePost() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        file: null
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0]; 
        setFormData({
            ...formData,
            file: file 
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
        <form
            onSubmit={(e) => { e.preventDefault(); post(formData) }}
            className="grid grid-cols-2   md:mx-80 gap-2 md:mt-24 border-2 p-4 rounded-md"
        >
            <p className="text-2xl text-center mt-16 md:mt-0 col-span-2">Create a post!</p>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="title">Title</Label>
                <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    type="text"
                    required
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="title">Description</Label>
                <Input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    type="text"
                    required
                />
            </div>
            <div className="col-span-2">
            <Label htmlFor="imageUrl">ImageUrl</Label>
                <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Image URL"
                    type="text"
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="file">File</Label>
                <Input
                    name="file"
                    onChange={handleFileChange}
                    type="file"

                />
            </div>
            <Button type="submit" className="mt-auto col-span-2 md:col-span-1">Create Post!</Button>
            {createPost.isSuccess && <p className="p-4 col-span-2 text-xl text-center bg-green-500 font-semibold">{createPost.data.data.success}</p>}
            {createPost.isError && <p className="p-4 col-span-2 text-xl text-center bg-red-500 font-semibold">{createPost.data.data.error}</p>}
        </form>
    )
}