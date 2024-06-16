import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        adminKey: ""
    });

    const navigate = useNavigate();

    const signUp = useMutation({
        mutationFn: (formData) => axiosInstance.post("/create-new-user", formData),
        onSuccess: () => {
            toast("Sign up successfull! Redirecting to Login page.");
            setTimeout(() => {
                navigate("/pages/login")
                window.location.reload();
            }, 1000)}
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signUp.mutate(formData);
    };


    return (
        <div
            className="w-full h-screen flex md:items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230720/pngtree-blue-and-purple-neon-star-3d-art-background-with-a-cool-image_3705286.jpg')" }}
        >
            <div className="md:bg-slate-500/40 text-white rounded-md w-full md:w-auto p-8 flex flex-col justify-center ">
                <div className="">
                    <p className="text-2xl text-center font-semibold">Sign Up</p>
                </div>
                <hr className="mt-2" />
                <form onSubmit={handleSubmit} className="grid grid-cols-2 md:mt-4 gap-4 w-full items-center justify-center">
                    <div className="col-span-2 md:col-span-1 font-medium ">
                        <p>First Name:</p>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                            placeholder="Joe"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>Last Name:</p>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                            placeholder="Rogan"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2  font-medium">
                        <p>Email:</p>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="rounded-md text-black bg-slate-500/70 w-full px-2 py-1"
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>User Name:</p>
                        <input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                            placeholder="Joe_Rogan"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>Password:</p>
                        <input
                            name="password"
                            value={formData.password} onChange={handleChange}
                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                            placeholder="***************"
                            type="password"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>AdminKey:</p>
                        <input
                            name="adminKey"
                            value={formData.adminKey}
                            onChange={handleChange}
                            className="rounded-md w-full text-black bg-slate-500/70 px-2 py-1"
                            placeholder="Leave blank if regular user"
                            type="password"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center mt-2 justify-center">
                        <button type="submit" className="text-center text-lg bg-important hover:underline transition-all hover:brightness-100 brightness-75 text-white px-4 py-2 rounded-xl"> Sign Up!</button>
                    </div>
                    {signUp.isLoading && <div className="col-span-2">Creating user...</div>}
                    {signUp.isError && <div className="col-span-2">An error occurred: {signUp.error.message}</div>}
                    {signUp.isSuccess && <div className="col-span-2">User created successfully!</div>}
                </form>
            </div>
        </div>
    )
}