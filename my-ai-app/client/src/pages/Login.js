import { useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const login = useMutation({
        mutationFn: (formData) => axiosInstance.post("/login", formData),
        onSuccess: (data) => {
            setFormData({
                email: "",
                password: ""
            });
            localStorage.setItem("token", data.data.token);
            toast("You've been logged in! Redirecting to homepage.");
            setTimeout(() => {
                navigate("/")
                window.location.reload();

            }, 2000);
        }
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
        login.mutate(formData);
    };




    return (
        <div
            className="w-full h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230720/pngtree-blue-and-purple-neon-star-3d-art-background-with-a-cool-image_3705286.jpg')" }}
        >
            <div className="text-white bg-slate-500/40 w-full md:w-auto rounded-md p-8 flex flex-col justify-center mx-4">
                <div>
                    <p className="text-2xl text-center font-semibold">Login</p>
                </div>
                <hr className="mt-2" />
                <form onSubmit={handleSubmit} className="grid grid-cols-2 mt-4 gap-4 w-full items-center justify-center">
                    <div className="col-span-2 font-medium">
                        <p>Email:</p>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="rounded-md w-full text-black px-2 py-1"
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <p>Password:</p>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="rounded-md w-full text-black px-2 py-1"
                            placeholder="***************"
                            type="password"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center mt-4 justify-center">
                        <button
                            type="submit"
                            className="text-center text-lg bg-important hover:underline transition-all hover:brightness-100 brightness-75 text-white px-4 py-2 rounded-xl"
                        >
                            Login!
                        </button>
                    </div>
                    {login.isLoading && <div className="col-span-2">Logging in...</div>}
                    {login.isError && <div className="col-span-2">An error occurred: {login.error.message}</div>}
                    {login.data && login.data.data.error ? <p className="col-span-2">{login.data.data.error}</p> : null}
                </form>
            </div>
        </div>
    )
}