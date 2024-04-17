"use client";

import api from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, redirect } from "next/navigation";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import PageStructure from "@/app/main-components/PageStructure";
import { Account, User } from "@prisma/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { UserWithAccount } from "@/lib/types";

const CreatePostPage = () => {
    const { data: session } = useSession();
    const currentUser = session?.user as UserWithAccount;


    
    return (
        <PageStructure
            left={<Left  currentUser={currentUser} />}
            middle={<Middle  currentUser={currentUser} />}
            right={<Right  currentUser={currentUser} />}
        />
    );
};

export default CreatePostPage;