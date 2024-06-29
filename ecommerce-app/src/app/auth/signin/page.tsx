"use client"
import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import NavBar from "@/app/MainComponents/navbar/NavBar";

interface Props {
    searchParams: {
        callbackUrl?: string;
    };
};

const SignInPage = ({ searchParams }: Props) => {
    const { data, status } = useSession();
    if (status === "authenticated") {
        if(!toast.isActive("loginMessage")) {
            toast.success("Sign in succesfull! Redirecting...", {
                toastId: "loginMessage"
            });
        }
        window.location.href = searchParams.callbackUrl || "/";
    };

    return (
        <div>
            <NavBar/>
            <div className="flex h-screen items-center md:mt-24 flex-col">
                <p className="text-center "> Dont have an account yet?
                    <Button asChild variant="link">
                        <Link href="/auth/signup">Sign up</Link>
                    </Button>
                </p>
                <SignInForm callbackUrl={searchParams.callbackUrl} />
                <Button asChild variant="link">
                    <Link href="/auth/forgotPass">Forgot Your Password?</Link>
                </Button>
            </div>
        </div>
    );
};

export default SignInPage;