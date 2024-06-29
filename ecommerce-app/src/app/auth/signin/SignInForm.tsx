"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
    callbackUrl?: string;
};

const FormSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string({ required_error: "Please enter a password." }),

});

type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InputType>({ resolver: zodResolver(FormSchema) });

    const router = useRouter();
    const [visiblePass, setVisiblePass] = useState(false);

    const OnSubmit: SubmitHandler<InputType> = async (data) => {
        const result = await signIn("credentials", {
            redirect: false,
            userName: data.email,
            password: data.password,

        });
        if (result?.error) {
            toast.error(result?.error);
            return;
        }
        toast.success("Welcome back!");
        router.push(props.callbackUrl ? props.callbackUrl : "/");
    };

    return (
        <div className="flex flex-col gap-3 border rounded-md w-full md:w-1/2 mb-4 ">
            <div className="border-b text-lg text-center p-4">
                Sign In Form
            </div>
            <form onSubmit={handleSubmit(OnSubmit)} className="p-4 flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    {...register("email")}
                    placeholder="Email"
                />
                {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
                <div className="flex items-center gap-2">
                    <Label htmlFor="password">Password</Label>
                    <button type="button" onClick={() => setVisiblePass(!visiblePass)}>
                        {visiblePass ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
                    </button>
                </div>
                <Input
                    {...register("password")}
                    type={visiblePass ? "text" : "password"}
                    placeholder="Password"
                />
                {errors.password && <p className="text-red-500">{errors.password?.message}</p>}
                <Button type="submit" disabled={isSubmitting} className="md:w-1/2 mx-auto">
                    {isSubmitting ? "Signing In..." : "Sign in"}
                </Button>
            </form>
        </div>
    )
}

export default SignInForm;