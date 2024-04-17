"use client";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
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

    

const FormSchema = z.object({
    firstName: z
        .string()
        .min(2,"First name must be atleast 2 characters")
        .max(50,"First name must be less than 50 characters")
        .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    lastName: z
        .string()
        .min(2,"Last name must be atleast 2 characters")
        .max(50,"Last name must be less than 50 characters")
        .regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed!"),
    name: z
        .string(),
    userName: z
        .string()
        .min(4,"Username must be atleast 2 characters")
        .max(50,"Username must be less than 50 characters"),
    email: 
        z.string()
        .email("Please enter a valid email address"),
    phoneNumber: 
        z.string()
        .refine(validator.isMobilePhone, "Please enter a valid phone number!"),
    password: 
        z.string()
        .min(6, "Password must be atleast 6 characters")
        .max(50, "Password must be less than 50 characters"),
    confirmPassword: 
        z.string()
        .min(6, "Password must be atleast 6 characters")
        .max(50, "Password must be less than 50 characters"),
    accepted: z.literal(true,{
        errorMap: () => ({
            message: "You must accept the terms and conditions to continue!"
        })
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match!",
    path: ["confirmPassword"]

});

type InputType = z.infer<typeof FormSchema>;

const SignUpForm = () => {

    const { register, handleSubmit, reset, control, formState:{errors}, watch } = useForm<InputType>({
        resolver: zodResolver(FormSchema)
    });

    const [ passStrength , setPassStrength ] = useState(0);
    const [ passLength , setPassLength ] = useState(0);

    const [isVisiblePass, setIsVisiblePass] = useState(false);
    const toggleVisiblePass = () => setIsVisiblePass(!isVisiblePass);

    useEffect(() => {
        setPassLength(passwordStrength(watch().password).length);
        setPassStrength(passwordStrength(watch().password).id);
    }, [watch().password]);

 
    const saveUser: SubmitHandler<InputType> = async (data) => {
        const { accepted, confirmPassword, ...user} = data;
        try {
            const result = await registerUser(user);
            toast.success("User registered successfully!");
        } catch (error) {
            toast.error("An error occured while registering user!");
            console.error(error);
        } finally {
            reset();
            window.location.href = "/auth/signin";
        }
    };


    
    return (
    <form onSubmit={handleSubmit(saveUser)} className="grid grid-cols-2 gap-5 p-3 shadow border-2 border-slate-500 rounded-xl mx-auto max-w-[60rem]">
        <Input 
            {...register("firstName")} 
            errorMessage={errors.firstName?.message}
            isInvalid={!!errors.firstName}
            className="col-span-2 md:col-span-1" 
            label="First Name" 
            startContent={<UserIcon className="w-4" />}
        />
        <Input 
            {...register("lastName")} 
            errorMessage={errors.lastName?.message}
            isInvalid={!!errors.lastName} 
            className="col-span-2 md:col-span-1" 
            label="Last Name" 
            startContent={<UserIcon className="w-4" />}
        />
        <Input 
            {...register("userName")} 
            errorMessage={errors.userName?.message}
            isInvalid={!!errors.userName}
            className="col-span-2 md:col-span-1" 
            label="User Name" 
            startContent={<AtSymbolIcon className="w-4" />}
        />
        <Input 
            {...register("phoneNumber")} 
            errorMessage={errors.phoneNumber?.message}
            isInvalid={!!errors.phoneNumber}
            className="col-span-2 md:col-span-1" 
            label="Phone Number" 
            startContent={<PhoneIcon 
            className="w-4" />}
        /> 
        <Input 
            {...register("email")} 
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            className="col-span-2" 
            label="Email" 
            startContent={<EnvelopeIcon className="w-4" />}
        />
        
        <Input 
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label="Password" 
            type={isVisiblePass ? "text" : "password"}
            className="col-span-2 md:col-span-1"
            startContent={<LockClosedIcon className="w-4" />}
            endContent={isVisiblePass ? <EyeIcon className="w-6 cursor-pointer my-auto" onClick={toggleVisiblePass} /> : <EyeSlashIcon className="w-6 my-auto cursor-pointer" onClick={toggleVisiblePass} />}
        />  
        <Input 
            {...register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
            isInvalid={!!errors.confirmPassword}
            className="col-span-2 md:col-span-1" 
            label="Confirm Password" 
            type={isVisiblePass ? "text" : "password"} 
            startContent={<LockClosedIcon className="w-4" />}
        />
        {passLength > 0 && <PasswordStrength passStrength={passStrength} />}
        <Controller 
            control={control} 
            name="accepted" 
            render={({field}) => (
            <Checkbox onChange={field.onChange} onBlur={field.onBlur} className="col-span-2 "> 
                I agree to the <Link underline="hover" href="/terms"> Terms of Service </Link> and <Link underline="hover" href="/privacy"> Privacy Policy </Link>
                {!!errors.accepted && <p className="text-red-500" >{errors.accepted.message}</p>}
            </Checkbox>
            )}
        />
        <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
            <Checkbox>I want to receive notifications to my email.</Checkbox>
            <Checkbox>I want to receive notifications to my phonenumber.</Checkbox>
        </div>
        <Button className="col-span-2 md:col-span-1 hover:underline text-xl underline-offset-4" color="primary"  type="submit" variant="flat">Sign Up</Button>
    </form>
    )
}

export default SignUpForm;