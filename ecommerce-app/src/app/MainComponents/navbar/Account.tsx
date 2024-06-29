"use client";

import { Button } from "@/components/ui/button";
import { BriefcaseIcon, HeartIcon, MapPinIcon, UserIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Account({ signOut }: any) {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col absolute top-12 mt-1 w-48 -left-10 px-2 bg-background pt-2 rounded-b-lg z-10 border-x border-b">
            <h1 className="font-semibold text-center">Welcome</h1>
            {session ?
                <div className="flex flex-col gap-2 pb-2">
                    <Button asChild variant="link">
                        <Link href="#"><UserIcon width={20} />{session.user?.email}</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="#"><BriefcaseIcon width={20} />Your orders</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="#"><MapPinIcon width={20} />Track an order</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href={process.env.NEXT_PUBLIC_URL + "/pages/wishlist"}><HeartIcon width={20} />Wishlist</Link>
                    </Button>
                    <Button variant="link" onClick={signOut}>Sign out</Button>
                </div>
                :
                <div className="flex flex-col gap-2 pb-2">
                    <Button asChild variant="link">
                        <Link href="/auth/signin">Sign in</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="/auth/signup">Create an account</Link>
                    </Button>
                </div>
            }
        </div>
    );
}
