import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Button } from "src/components/ui/button";


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
        onSuccess: (data) => {
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
            setTimeout(() => {
                navigate("/login")
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
        <div className="w-full h-screen flex md:items-center justify-center">
            <div className="w-full md:border-2 md:rounded-md md:w-auto p-8 flex flex-col justify-center ">
                <div className="">
                    <p className="text-2xl text-center font-semibold">Sign Up</p>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 md:mt-4 gap-4 w-full items-center justify-center">
                    <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="firstName">First Name:</Label>
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Joe"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="lastName">Last Name:</Label>
                        <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Rogan"
                            type="text"
                            required
                        />
                    </div>
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
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <Label htmlFor="userName">User Name:</Label>
                        <Input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Joe_Rogan"
                            type="text"
                            required
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1 font-medium">
                        <Label htmlFor="password">Password:</Label>
                        <Input
                            name="password"
                            value={formData.password} onChange={handleChange}
                            placeholder="***************"
                            type="password"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1 font-medium">
                        <Label htmlFor="adminKey">Trainer Key:</Label>
                        <Input
                            name="adminKey"
                            value={formData.adminKey}
                            onChange={handleChange}
                            placeholder="Leave blank if regular user"
                            type="password"
                        />
                    </div>
                    <Button type="submit" className="mt-auto col-span-2 md:col-span-1"> Sign Up!</Button>
                    {signUp.isLoading && <div className="col-span-2">Creating user...</div>}
                    {signUp.isError && <div className="col-span-2">An error occurred: {signUp.error.message}</div>}
                    {signUp.isSuccess && <div className="col-span-2">User created successfully!</div>}
                </form>
            </div>
        </div>
    )
}