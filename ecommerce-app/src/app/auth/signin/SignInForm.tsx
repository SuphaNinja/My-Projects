"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
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
    }


    return (
        <div className="flex flex-col gap-3 border shadow rounded-xl overflow-hidden ww-full md:w-1/2 mb-4 ">
            <div className="bg-gradient-to-b p-2 text-center from-white to-slate-200 dark:from-slate-700 dark:to-slate-900">
                Sign In Form
            </div>
            <hr className="w-2/3 mx-auto" />
            <form onSubmit={handleSubmit(OnSubmit)} className="p-4 flex flex-col gap-4">
                <Input
                    label="Email"
                    {...register("email")}
                    placeholder="Email"
                    errorMessage={errors.email?.message}
                    isInvalid={!!errors.email}
                />
                <Input
                    label="Password"
                    {...register("password")}
                    type={visiblePass ? "text" : "password"}
                    placeholder="Password"
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                    endContent={
                        <button type="button" onClick={() => setVisiblePass(!visiblePass)}>
                            {visiblePass ? <EyeSlashIcon className="w-6 mb-1" /> : <EyeIcon className="w-6 mb-1" />}
                        </button>
                    }
                />
                <Button className="w-full md:w-1/3 px-4 py-2 bg-gradient-to-b from-slate-600 to-slate-400 hover:underline mx-auto md:text-xl" color="" type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                    {isSubmitting ? "Signing In..." : "Sign in"}
                </Button>
            </form>
        </div>
    )
}
export default SignInForm;