"use client"
import { Button, Link } from "@nextui-org/react";
import SignInForm from "./SignInForm";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface Props {
    searchParams: {
        callbackUrl?: string;
    };
};

const SignInPage = ({ searchParams }: Props) => {
    const { data, status } = useSession();
    if (status === "authenticated") {
        toast.success("Sign in succesfull! Redirecting...");
        window.location.href = searchParams.callbackUrl || "/";

    }

    return (
        <div className="flex items-center justify-center flex-col">
            <p className="mx-auto my-4"> Dont have an account yet?
                <Link className="text-xl ml-2 font-semibold hover:underline" as={Link} href="/auth/signup">Sign up</Link>
            </p>
            <SignInForm callbackUrl={searchParams.callbackUrl} />
            <Link href="/auth/forgotPass">Forgot Your Password?</Link>
        </div>
    );
};

export default SignInPage;