import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import axiosInstance from "../lib/axiosInstance";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from "react";
import Notifications from "../components/ProfileComponents/Notifications";
import Posts from "../components/ProfileComponents/Posts";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { toast } from "react-toastify";
import { Skeleton } from "src/components/ui/skeleton";

export default function Profile() {

    const [activeComponent, setActiveComponent] = useState('posts');

    const queryClient = useQueryClient();
    const params = useParams();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        adminKey: "",
        profileImage: ""
    });

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("get-current-user")
    });

    const fetchedUser = useQuery({
        queryKey: ["userProfile", params.userId],
        queryFn: () => axiosInstance.post("get-user", { params })
    });
    const user = fetchedUser.data?.data?.user;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const editProfile = useMutation({
        mutationFn: (formData) => axiosInstance.post("/edit-profile", formData),
        onSuccess: (data) => {
            if (data?.data?.success) {
                toast(data?.data?.success)
            } else {
                toast(data?.data?.error)
            }
        }
    });

    const handleEditProfile = () => {
        editProfile.mutate(formData);
    };

    useEffect(() => {
        if (fetchedUser.isSuccess && fetchedUser.data) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userName: user.userName,
                password: user.password,
                adminKey: user.adminKey,
                profileImage: user.profileImage
            })
        }
    }, [fetchedUser.data]);

    useEffect(() => {
        if (user?.id !== params.userId) {
            queryClient.invalidateQueries('userProfile');
        }
    }, [params.userId]);


    const renderComponent = () => {
        switch (activeComponent) {
            case 'notifications':
                return <Notifications currentUser={currentUser.data?.data?.success} />;
            case 'posts':
                return <Posts currentUser={currentUser.data?.data?.success} user={user} />;
            default:
                return null;
        }
    };

    if (fetchedUser.isLoading || currentUser.isLoading) {
        return (
            <div className="h-screen flex w-full items-center justify-center">
                <Skeleton />
            </div>
        );
    };

    return (
        <div>
            <button className="ml-4" onClick={() => console.log(currentUser)}>user</button>
            <div className="w-full md:mt-0 mt-16 flex" >
                <div className=" md:mx-24 md:p-8 border-2  md:rounded-xl md:my-24  flex flex-col w-full ">
                    <div className="flex flex-col md:flex-row items-center shadow-xl justify-between md:px-24 ">
                        <div className="">
                            <h1 className="text-lg md:text-4xl font-semibold">
                                {user.userName}
                                {user.id !== currentUser.data?.data?.success?.id && "'s profile"}
                            </h1>

                        </div>
                        {user?.profileImage ?
                            <img className="size-60" src={user.profileImage} />
                            :
                            <UserCircleIcon className="md:w-60 w-24" />
                        }
                    </div>
                    <div className="md:grid flex gap-4 flex-col max-h-[300px] md:grid-cols-6">
                        <div className="col-span-6 gap-4  grid grid-cols-6">
                            <div className="md:col-span-3 col-span-6">
                                {user.id === currentUser.data?.data?.success?.id &&
                                    <p className="col-span-2 mt-3 border-b-2 text-xl text-center font-semibold ">Edit profile</p>
                                }
                            </div>
                            <div className="md:col-span-3 hidden md:block">
                                <div className="flex border-b-2 justify-between px-12">
                                    {user.id === currentUser.data?.data?.success?.id &&
                                        <Button
                                            variant="link"
                                            onClick={() => setActiveComponent('notifications')}
                                            className={` transition-all hover:underline ${activeComponent === 'notifications' ? "  font-semibold underline" : ""}`}>
                                            Notifications
                                        </Button>
                                    }
                                    <Button
                                        variant="link"
                                        onClick={() => setActiveComponent('posts')}
                                        className={` transition-all hover:underline ${activeComponent === 'posts' ? "  font-semibold underline" : ""}`}>
                                        Posts
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-3 grid gap-2 grid-cols-2">
                            <div className="col-span-2 md:col-span-1 ">
                                <Label htmlfor="firstName">First Name:</Label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    type="text"
                                    disabled={user.id !== currentUser.data?.data?.success?.id}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Label htmlfor="lastName">Last Name:</Label>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    type="text"
                                    disabled={user.id !== currentUser.data?.data?.success?.id}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 ">
                                <Label htmlfor="email">Email:</Label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    disabled
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Label htmlfor="userName">Username:</Label>
                                <Input
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    type="text"
                                    disabled={user.id !== currentUser.data?.data?.success?.id}
                                />
                            </div>
                            {user.id === currentUser.data?.data?.success?.id &&
                                <>
                                {currentUser.data?.data?.success?.role === "ADMIN" &&
                                        <div className="col-span-2 md:col-span-1">
                                        <Label htmlfor="adminKey">Adminkey:</Label>
                                            <Input
                                                name="adminKey"
                                                value={formData.adminKey}
                                                onChange={handleChange}
                                                type="password"
                                            />
                                        </div>
                                    }
                                    <Button className="mt-auto col-span-2 md:col-span-1" onClick={handleEditProfile}>Save Changes</Button>
                                </>
                            }
                        </div>
                        <div className="col-span-3  h-full">
                            <div className="flex border-b-2 md:hidden justify-between px-12">
                                {user.id === currentUser.data?.data?.success?.id &&
                                    <Button
                                        variant="link"
                                        onClick={() => setActiveComponent('notifications')}
                                        className={` transition-all hover:underline ${activeComponent === 'notifications' ? "  font-semibold underline" : ""}`}>
                                        Notifications
                                    </Button>
                                }
                                    <Button
                                        variant="link"
                                        onClick={() => setActiveComponent('posts')}
                                        className={` transition-all hover:underline ${activeComponent === 'posts' ? "  font-semibold underline" : ""}`}>
                                        Posts
                                    </Button>
                            </div>
                            <div className="overflow-y-auto bg-slate-500/80 no-scrollbar mt-2 h-auto">
                                {renderComponent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}