"use client"
import LeftSection from "@/app/main-components/LeftSection";
import { UserWithAccount } from "@/lib/types";


export default function Left({ currentUser, }: { currentUser: UserWithAccount }) {

    return (
        <LeftSection>
            <h2 className="text-1xl text-white"></h2>
        </LeftSection>
    );
}