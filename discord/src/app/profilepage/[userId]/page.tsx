"use client";

import api from "@/lib/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, redirect } from "next/navigation";
import Left from "../Left";
import Middle from "../Middle";

import PageStructure from "@/app/main-components/PageStructure";
import { Account, User } from "@prisma/client";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { UserWithAccount } from "@/lib/types";

const ProfilePage = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as UserWithAccount;

  const params = useParams();

  const user = useQuery({
    queryKey: ["user", params.userId],
    queryFn: () => api.getUser(params.userId as string),
  });

  const followUser = useMutation({
    mutationFn: () => api.followUser(params.userId as string),
    onSuccess: () => user.refetch()
  })

  if (user.isError) {
    redirect("/")
    toast.error("Profile not found.. redirecting to home page");
  }

  return (
    <PageStructure
      left={<Left followUser={followUser} user={user} currentUser={currentUser}/>}
      middle={<Middle followUser={followUser} user={user} currentUser={currentUser} />}
    />
  );
};

export default ProfilePage;
