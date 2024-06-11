
import axiosInstance from "../lib/axiosInstance";
import { useEffect, useState } from "react";

export default function Profile(user) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        adminKey: "",
        profileImage: ""
    });



    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    


    return (
        <div className="">
            <div
                className="w-full -z-1 flex md:items-center md:justify-center "
            >
                <div className=" md:p-8  md:overflow-hidden md:rounded-xl  text-white flex flex-col w-full ">
                    <div className="flex flex-col md:flex-row items-center md:rounded-xl shadow-xl  justify-between md:px-24 ">
                        <div className="">
                            <h1 className="text-lg md:text-4xl font-semibold">{user.userName}</h1>

                        </div>
                    </div>
                    <div className="md:grid flex gap-4 flex-col max-h-[300px] md:grid-cols-6">

                        <div className="col-span-6 gap-4 mt-4 grid grid-cols-6">
                            <div className="md:col-span-6 col-span-6">
                                {user &&
                                    <p className="col-span-2 border-b-2 text-xl text-center font-semibold ">Edit profile</p>
                                }
                            </div>
                        </div>
                        <div className="md:col-span-6 grid gap-2 grid-cols-2 border-b-2 md:border-none pb-4 md:pb-0 ">

                            <div className="col-span-2 md:col-span-1 font-medium ">
                                <p>First Name:</p>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                                    type="text"
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
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1 font-medium">
                                <p>Email:</p>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="rounded-md hover:cursor-not-allowed text-black bg-slate-500/70 w-full px-2 py-1"
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
                                />
                            </div>
                            {user &&
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
                                    {user.role === "ADMIN" &&
                                        <div className="col-span-2 md:col-span-1 font-medium">
                                            <p>AdminKey:</p>
                                            <input
                                                name="adminKey"
                                                value={formData.adminKey}
                                                onChange={handleChange}
                                                className="rounded-md w-full  text-black bg-slate-500/70 px-2 py-1"
                                                type="password"
                                            />
                                        </div>
                                    }
                                    <button
                                        
                                        className="col-span-2 mx-auto md:col-span-2 py-1 px-4 rounded-md hover:underline hover:bg-slate-800/80 transition-all bg-slate-500/70">
                                        Save Changes
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}