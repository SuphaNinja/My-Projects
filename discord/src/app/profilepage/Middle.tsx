"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import MiddleSection from "@/app/main-components/MiddleSection";
import { useParams } from "next/navigation";
import { UserWithAccount } from "@/lib/types";
import { Button } from "@nextui-org/react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import Post from "../components/Post";

export default function Middle({ user, currentUser, followUser }: { user: { data?: UserWithAccount }, currentUser: UserWithAccount, followUser: any }) {
  const params = useParams();


  const posts = useQuery({
    queryKey: ["posts", params.userId],
    queryFn: () => api.getUserPosts(params.userId as string),
  });

  return (
    <MiddleSection>
      <div className="flex flex-col items-center">
        <div className="w-full flex gap-2 items-center bg-gradient-to-b from-slate-800 to-slate-600 border-b-2 border-slate-800 p-2">
          <div>
            {user.data?.image ?
              <img className="rounded-full" src={user.data?.image as string} />
              : <UserCircleIcon className="h-16 w-16" />
            }
          </div>
          <div className="flex-flex-col">
            <p className="font-semibold">{user.data?.name ? user.data.name :
              <span className="flex gap-1">
                <span>{user.data?.firstName}</span>
                <span>{user.data?.lastName}</span>
              </span>
            }</p>
            <p className="text-sm">{user.data?.email}</p>
            {/* add amount of posts here */}
          </div>
          <div className="flex flex-col gap-2 ml-auto mr-4">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="font-bold">{user.data?.followed.length ?? "-"}</p>
                <p>Followers</p>
              </div >
              <div className="text-center">
                <p className="font-bold">{user.data?.following.length ?? "-"}</p>
                <p>Following</p>
              </div>
            </div>
            {params.userId === currentUser.id ? (
              <button className="py-1 px-2 bg-slate-950 rounded-xl font-semibold hover:underline hover:bg-slate-800 transition-colors">Edit Profile</button>
            ) : (
              <button
                onClick={() => followUser.mutate()}
                className="py-1 px-2 bg-rose-600 rounded-xl font-semibold hover:underline hover:bg-rose-800 transition-colors">
                {user.data?.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
        <div className="w-full ">
          <h2 className="text-center text-xl font-semibold underline bg-slate-800 pb-2">Posts</h2>
          {posts.isSuccess ? (
            <>
              {posts.data.map((post: any, index: number) => (
                <Post key={index} post={post} />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </MiddleSection>
  );
}
