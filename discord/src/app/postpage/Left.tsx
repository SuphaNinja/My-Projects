"use client"
import LeftSection from "@/app/main-components/LeftSection";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { redirect, useParams } from "next/navigation";
import type { User, Account } from "@prisma/client";
import { UserWithAccount } from "@/lib/types";


export default  function Left() {

    const params = useParams();
  
    return (
        <LeftSection>
            <div>
                
              
            </div>
        </LeftSection>
    );
}