"use client"
import LeftSection from "@/app/main-components/LeftSection";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { redirect, useParams } from "next/navigation";
import type { User, Account } from "@prisma/client";
import { UserWithAccount } from "@/lib/types";


export default  function Left({ user, currentUser, followUser }: { user: { data?: UserWithAccount }, currentUser: UserWithAccount , followUser: any}) {

    const params = useParams();
  
    return (
        <LeftSection>
            <div>
                {user.data?.id !== params.userId ? 
                <button onClick={() =>console.log(user.data?.accounts[0])}>{"test"}</button>
                : null}
            </div>
        </LeftSection>
    );
}