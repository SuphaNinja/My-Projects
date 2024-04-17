import { Image, Link } from "@nextui-org/react";
import SignUpForm from "@/app/components/SignUpForm";


const SignUpPage = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 md:mt-8">
            <div className="md:col-span-2 flex items-center justify-center">
                <p className="text-center p-2">Already Signed up?</p>
                <Link href="/auth/signin">Sign In</Link>
            </div>
            <div>

            </div>
            <div className="w-full">
                <SignUpForm />
            </div>
        </div>
    );
}

export default SignUpPage;