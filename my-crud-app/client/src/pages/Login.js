import { useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Label } from "src/components/ui/label";



export default function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const login = useMutation({
        mutationFn: (formData) => axiosInstance.post("/login", formData),
        onSuccess: (data) => {
            console.log(data)
            setFormData({
                email: "",
                password: ""
            });
            if (data.data.token) {
                localStorage.setItem("token", data.data.token);
                toast.success   ("You've been logged in! Redirecting to homepage.");
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
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:mx-auto md:w-1/3 gap-2 md:mt-24 md:border-2 p-4 rounded-md">
            <p className="text-center text-2xl col-span-2 mt-24 md:mt-0">Login</p>
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
            <Button className="md:col-span-1 mt-4 col-span-2 md:mt-auto" type="submit">Login!</Button>
            {login.isLoading && <div className="col-span-2">Logging in...</div>}
            {login.isError && <div className="col-span-2">An error occurred: {login.error.message}</div>}
            {login.data && login.data.data.error ? <p className="col-span-2">{login.data.data.error}</p> : null}
        </form>

    )
}