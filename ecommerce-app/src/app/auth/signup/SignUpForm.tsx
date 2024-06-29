"use client";

import { AtSymbolIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, PhoneIcon, UserIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import z from "zod";
import validator from "validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordStrength } from "check-password-strength";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/lib/actions/authActions";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be atleast 2 characters")
        .max(50, "First name must be less than 50 characters")
        .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    lastName: z
        .string()
        .min(2, "Last name must be atleast 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    adress: z
        .string(),
    email:
        z.string()
            .email("Please enter a valid email address"),
    password:
        z.string()
            .min(6, "Password must be atleast 6 characters")
            .max(50, "Password must be less than 50 characters"),
    confirmPassword:
        z.string()
            .min(6, "Password must be atleast 6 characters")
            .max(50, "Password must be less than 50 characters"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match!",
    path: ["confirmPassword"]
});

type InputType = z.infer<typeof FormSchema>;

const SignUpForm = () => {

    const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    });

    const [ passStrength, setPassStrength ] = useState(0);
    const [ passLength, setPassLength ] = useState(0);

    const [ termsAccepted, setTermsAccepted ] = useState(false);
    const [ termsError, setTermsError ] = useState("");

    const [isVisiblePass, setIsVisiblePass] = useState(false);
    const toggleVisiblePass = () => setIsVisiblePass(!isVisiblePass);

    useEffect(() => {
        setPassLength(passwordStrength(watch().password).length);
        setPassStrength(passwordStrength(watch().password).id);
    }, [watch().password]);


    const saveUser: SubmitHandler<InputType> = async (data) => {
        if (!termsAccepted) {
            setTermsError('You must accept the terms and conditions.');
            return;
        }

        const { confirmPassword, ...user } = data;
        try {
            await registerUser(user);
            toast.success("User registered successfully!");
        } catch (error) {
            toast.error("An error occurred while registering user!");
            console.error(error);
        } finally {
            reset();
            window.location.href = "/auth/signin";
        }
    };

    return (
        <form onSubmit={handleSubmit(saveUser)} className="grid grid-cols-2 gap-5 max-w-[90vh] p-3 border rounded-md mx-auto">
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="firstName" className="flex gap-1"><UserIcon className="w-4" />First Name</Label>
                <Input
                    {...register("firstName")}
                />
            {errors.firstName && <p className="text-red-500">{errors.firstName?.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="lastName" className="flex gap-1">{<UserIcon className="w-4" />}Last Name</Label>
                <Input
                    {...register("lastName")}
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName?.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="email" className="flex gap-1">{<EnvelopeIcon className="w-4" />}Email</Label>
                <Input
                    {...register("email")}
                />
                {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="adress" className="flex gap-1">{<UserIcon className="w-4" />}Adress</Label>
                <Input
                    {...register("adress")}
                />
                {errors.lastName && <p className="text-red-500">{errors.adress?.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="firstName" className="flex gap-1 items-center">
                    {<LockClosedIcon className="w-4" />}
                    Password
                    {isVisiblePass ? <EyeIcon className="w-4 cursor-pointer" onClick={toggleVisiblePass} /> :
                    <EyeSlashIcon className="w-4 cursor-pointer" onClick={toggleVisiblePass} />}</Label>
                <Input
                    {...register("password")}
                    type={isVisiblePass ? "text" : "password"}
                />
                {errors.password && <p className="text-red-500">{errors.password?.message}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
                <Label htmlFor="confirmPassword" className="flex gap-1">{<LockClosedIcon className="w-4" />}Confirm Password</Label>
                <Input
                    {...register("confirmPassword")}
                    type={isVisiblePass ? "text" : "password"}
                    className="pb-1"
                />
                {passLength > 0 && <PasswordStrength passStrength={passStrength} />}
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword?.message}</p>}
            </div>
            <div className="flex items-center md:col-span-1 col-span-2 space-x-2">
                <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onClick={() => {
                        setTermsAccepted(!termsAccepted);
                        setTermsError('');
                    }}
                />
                <Label htmlFor="terms">Accept terms and conditions</Label>
                {termsError && <p className="text-red-500">{termsError}</p>}
            </div>
            
            <Button className="col-span-2 md:col-span-1 hover:underline text-xl underline-offset-4" color="primary" type="submit">Sign Up</Button>
        </form>
    )
}

export default SignUpForm;