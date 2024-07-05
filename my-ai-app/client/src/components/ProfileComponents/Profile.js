
import axiosInstance from "../../lib/axiosInstance";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";


export default function Profile({ user }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [ isSomethingEdited, setIsSomethingEdited ] = useState(false);

    const [ formData, setFormData ] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        profileImage: null,
    });

    const updateProfile = useMutation({
        mutationFn: (formData) => axiosInstance.post("/edit-profile", formData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["currentUser"]);
            setIsSomethingEdited(false);
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleEditProfile = () => {
        if (
            user.firstName !== formData.firstName ||
            user.lastName !== formData.lastName ||
            user.email !== formData.email ||
            user.userName !== formData.userName ||
            user.password !== formData.password ||
            user.profileImage !== formData.profileImage
        ) {
            updateProfile.mutate(formData);
        }
    }; 

    const deleteUser = useMutation({
        mutationFn: (userIdToDelete) =>  axiosInstance.post("/delete-user", {userIdToDelete}),
        onSuccess: (data) => {
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });
    
    const handleDeleteUser = () => {
        deleteUser.mutate(user.id);
        navigate("/");
        window.location.reload();
    };
    
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userName: user.userName,
                password: user.password,
                profileImage: user.profileImage
            });
        }
    }, [user]);
    
    useEffect(() => {
        if (
            user &&
            (
                user.firstName !== formData.firstName ||
                user.lastName !== formData.lastName ||
                user.email !== formData.email ||
                user.userName !== formData.userName ||
                user.password !== formData.password ||
                user.profileImage !== formData.profileImage
            )
        ) {
            setIsSomethingEdited(true);
        } else {
            setIsSomethingEdited(false);
        }
    }, [formData, user]);

    return (
        <div className="w-full flex md:items-center md:justify-center">
            <div className="md:p-8 flex flex-col w-full">
                <div className="flex gap-4 flex-col max-h-[300px]">
                    {user && <p className="border-b pb-2 text-xl text-center font-semibold ">Edit profile</p>}
                    <div className="md:col-span-6 grid gap-2 grid-cols-2">
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="firstName">First Name:</Label>
                            <Input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="lastName">Last Name:</Label>
                            <Input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="email">Email:</Label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                disabled
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="userName">User Name:</Label>
                            <Input
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                type="text"
                            />
                        </div>
                        {user &&
                        <>
                            <div className="col-span-2 md:col-span-1">
                                <Label htmlFor="password">Password:</Label>
                                <Input
                                    name="password"
                                    value={formData.password} onChange={handleChange}
                                    type="password"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Label htmlFor="profileImage">ImageUrl</Label>
                                <Input
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                    type="text"
                                    />
                            </div>
                            <div className="col-span-1 md:block hidden"/>
                            <div className="col-span-2 justify-evenly md:flex">
                                <Button
                                    disabled={!isSomethingEdited}
                                    onClick={() => handleEditProfile()}>
                                    {isSomethingEdited ? "Save Changes" : "Edit something"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteUser()}>
                                    Delete account
                                </Button>
                            </div>
                            
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>    
    )
}