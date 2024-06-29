import { useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";



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
                password: ""
            });
            if(data.data.token) {
                localStorage.setItem("token", data.data.token);
                toast("You've been logged in! Redirecting to homepage.");
                setTimeout(() => {
                    navigate("/")
                    window.location.reload();
                }, 2000);
            }
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
        <div className="w-full h-screen flex items-center justify-center">
            <div className="md:border-2 md:rounded-md w-full md:w-auto p-8 flex flex-col justify-center ">
                <div>
                    <p className="text-2xl text-center font-semibold">Login</p>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full items-center justify-center">
                    <div className="col-span-2">
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            type="email"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="password">Password:</Label>
                        <Input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="***************"
                            type="password"
                            required
                        />
                    </div>
                    <Button type="submit" className="mt-auto md:col-span-1 col-span-2">Login!</Button>
                    {login.isLoading && <div className="col-span-2">Logging in...</div>}
                    {login.isError && <div className="col-span-2">An error occurred: {login.error.message}</div>}
                    {login.data && login.data.data.error ? <p className="col-span-2">{login.data.data.error}</p> : null}
                </form>
            </div>
        </div>
    )
}