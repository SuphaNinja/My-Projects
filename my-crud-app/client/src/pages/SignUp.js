import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from "react-router-dom";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Form } from "src/components/ui/form";
import { Label } from "src/components/ui/label";
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
        onSuccess: () => navigate
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
        toast.success("You have been signed up! redirecting to login page.");
        setTimeout(() => {
            navigate("/login");
        }, 200);
    };


    return (    
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:mx-auto md:w-1/2 gap-2 md:mt-24 md:border-2 p-4 rounded-md">
                <p className="text-center col-span-2 mt-24 md:mt-0 text-2xl">Sign up</p>
                <div className="md:col-span-1 col-span-2">
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
                <div className="md:col-span-1 col-span-2">
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
                <div className="md:col-span-1 col-span-2">
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
                <div className="md:col-span-1 col-span-2">
                    <Label htmlFor="userName">Username:</Label>
                    <Input
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Joe_Rogan"
                        type="text"
                        required
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Label htmlFor="password">Password:</Label>
                    <Input
                        name="password"
                        value={formData.password} onChange={handleChange}
                        placeholder="***************"
                        type="password"
                        required
                    />
                </div>

                <div className="md:col-span-1 col-span-2">
                    <Label htmlFor="adminKey">Admin Key:</Label>
                    <Input
                        name="adminKey"
                        value={formData.adminKey}
                        onChange={handleChange}
                        placeholder="Leave blank if regular user"
                        type="password"
                    />
                </div>
                <Button type="submit" className="col-span-2 md:w-1/2 md:mx-auto"> Sign Up!</Button>
                {signUp.isLoading && <div className="col-span-2">Creating user...</div>}
                {signUp.isError && <div className="col-span-2">An error occurred: {signUp.error.message}</div>}
                {signUp.isSuccess && <div className="col-span-2">User created successfully!</div>}
            </form>
    )
}