import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import axiosInstance from "../lib/axiosInstance";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect,useState } from "react";
import Notifications from "../components/ProfileComponents/Notifications";
import Posts from "../components/ProfileComponents/Posts";

export default function Profile () {

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
    })

    const fetchedUser = useQuery({
        queryKey: ["userProfile"],
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
    });

    const handleEditProfile = () => {
        editProfile.mutate(formData);
    };


    useEffect(() => {
        if (fetchedUser && fetchedUser.data) {
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
                return <Notifications currentUser={currentUser.data.data.success}/>;
            case 'posts':
                return <Posts currentUser={currentUser.data.data.success} user={user} />;
            
            default:
                return null;
        }
    };

    if (fetchedUser.isLoading || currentUser.isLoading) {
        return (
            <div className="h-screen flex w-full items-center justify-center">
                <div className="text-2xl">Loading...</div>

            </div>
        )
    }

    return (
        <div>
            <button onClick={() => console.log(formData)}>currentuser</button>
            <button className="ml-4" onClick={() => console.log(user)}>user</button>
            <div
                className="w-full h-screen md:mt-0 mt-10 -z-1 flex md:items-center md:justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230720/pngtree-blue-and-purple-neon-star-3d-art-background-with-a-cool-image_3705286.jpg')" }}
            >
                <div className=" md:mx-24 md:p-8 bg-slate-500/80 md:overflow-hidden md:rounded-xl md:my-24 text-white flex flex-col w-full ">
                    <div className="flex flex-col md:flex-row items-center md:rounded-xl shadow-xl bg-slate-700/80 justify-between md:px-24 ">
                        <div className="">
                            <h1 className="text-lg md:text-4xl font-semibold">{user.userName}</h1>

                        </div>
                        {user.profileImage ?
                            <img src={user.profileImage}/>
                        :
                        <UserCircleIcon className="md:w-60 w-24"/>
                        }
                    </div>
                    <div className="md:grid flex gap-4 flex-col max-h-[300px] md:grid-cols-6">
                        
                        <div className="col-span-6 gap-4 mt-4 grid grid-cols-6">
                            <div className="md:col-span-3 col-span-6">
                                {user.id === currentUser.data.data.success.id &&
                                    <p className="col-span-2 border-b-2 text-xl text-center font-semibold ">Edit profile</p>
                                }
                            </div>
                            <div className="md:col-span-3 hidden md:block">
                                <div className="flex border-b-2 justify-between px-12">
                                    {user.id === currentUser.data.data.success.id &&
                                        <button
                                            onClick={() => setActiveComponent('notifications')}
                                            className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'notifications' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                            Notifications
                                        </button>
                                    }
                                    <button
                                        onClick={() => setActiveComponent('posts')}
                                        className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'posts' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                        Posts
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-3 grid gap-2 grid-cols-2 border-b-2 md:border-none pb-4 md:pb-0 ">
                            
                            <div className="col-span-2 md:col-span-1 font-medium ">
                                <p>First Name:</p>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                    type="text"
                                    disabled={user.id !== currentUser.data.data.success.id}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 font-medium">
                                <p>Last Name:</p>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                    type="text"
                                    disabled={user.id !== currentUser.data.data.success.id}
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 font-medium">
                                <p>Email:</p>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="rounded-md text-black bg-slate-500/70 w-full px-2 py-1"
                                    type="email"
                                    disabled
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 font-medium">
                                <p>User Name:</p>
                                <input
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"

                                    type="text"
                                    disabled={user.id !== currentUser.data.data.success.id}
                                />
                            </div>
                            {user.id === currentUser.data.data.success.id && 
                            <>
                                <div className="col-span-2 md:col-span-1 font-medium">
                                    <p>Password:</p>
                                    <input
                                        name="password"
                                        value={formData.password} onChange={handleChange}
                                        className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                        type="password"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1 font-medium">
                                    <p>ImageUrl</p>
                                    <input
                                        name="lastName"
                                        value={formData.profileImage}
                                        onChange={handleChange}
                                        className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                        type="text"
                                    />
                                </div>
                                {currentUser.data.data.success.role === "ADMIN" && 
                                    <div className="col-span-2 md:col-span-1 font-medium">
                                        <p>AdminKey:</p>
                                        <input
                                            name="adminKey"
                                            value={formData.adminKey}
                                            onChange={handleChange}
                                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                            type="password"
                                        />
                                    </div>
                                }
                                <button 
                                    onClick={handleEditProfile}
                                    className="col-span-2 md:col-span-1 py-1 px-4 rounded-md hover:underline hover:bg-slate-800/80 transition-all bg-slate-700/70">
                                    Save Changes
                                </button>
                            </>
                            }
                        </div>
                        <div className="col-span-3  h-full">
                            <div className="flex border-b-2 md:hidden justify-between px-12">
                                {user.id === currentUser.data.data.success.id &&
                                    <button
                                        onClick={() => setActiveComponent('guides')}
                                        className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'notifications' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                        Notifications
                                    </button>
                                }
                                <button
                                    onClick={() => setActiveComponent('posts')}
                                    className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'posts' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                    Posts
                                </button>
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