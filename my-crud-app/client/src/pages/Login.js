import { useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function Login() {

    const navigate = useNavigate()

    const [ formData, setFormData ] = useState({
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
        <div className="w-full mt-24 flex justify-center">
            <div className="bg-secondary rounded-md  p-8 flex flex-col justify-center ">
                <div className="">
                    <p className="text-2xl text-center font-semibold">Login</p>
                </div>
                <hr className="mt-2" />
                <form onSubmit={handleSubmit} className="grid grid-cols-2 mt-4 gap-4 w-full items-center justify-center">
                    <div className="col-span-2  font-medium">
                        <p>Email:</p>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="rounded-md w-full px-2 py-1"
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                    </div>
                    <div className="col-span-1 font-medium">
                        <p>Password:</p>
                        <input
                            name="password"
                            value={formData.password} onChange={handleChange}
                            className="rounded-md px-2 py-1"
                            placeholder="***************"
                            type="password"
                        />
                    </div>
                    <div className="col-span-1 flex items-center mt-4 justify-center">
                        <button type="submit"  className="text-center text-lg bg-important hover:underline transition-all hover:brightness-100 brightness-75 text-white px-4 py-2 rounded-xl">Login!</button>
                    </div>
                    {login.isLoading && <div className="col-span-2">Logging in...</div>}
                    {login.isError && <div className="col-span-2">An error occurred: {login.error.message}</div>}
                    {login.data && login.data.data.error ? <p>{login.data.data.error}</p>: null}
                </form>
            </div>
        </div>
    )
}