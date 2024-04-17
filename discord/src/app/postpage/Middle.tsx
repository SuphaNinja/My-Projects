"use client";
import MiddleSection from "@/app/main-components/MiddleSection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import Post from "@/app/components/Post";
import { ChatBubbleBottomCenterIcon, HeartIcon, ShareIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";



export default function Middle() {
  const queryClient = useQueryClient();
  const params = useParams();

  const { data: session } = useSession();

  const [showComments, setShowComments] = useState(true);

  const [replyData, setReplyData] = useState("");

  const post = useQuery({
    queryKey: ["post", params.postId],
    queryFn: () => api.getPost(params.postId as string),
  });

  const likePost = useMutation({
    mutationFn: () => api.likePost(post.data.id),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const replyToPost = useMutation({
    mutationFn: () => api.replyToPost(params.postId as string, { content: replyData }),
    onSuccess: () => {
      setReplyData(""),
        post.refetch()
    }
  });


  return (
    <MiddleSection>
      {post.isSuccess ? (
        <div>
          <div className="w-full relative">
            <img src={post.data.postImage} className=" w-full object-cover h-[25rem] brightness-50" />
            <div className="absolute left-12 bottom-6 flex flex-col gap-2">
              <p className="font-bold text-2xl">{post.data.title}</p>
              <p className="font-semibold text-xl">{post.data.description}</p>
              <p>{post.data.user.email}</p>
            </div>
          </div>
          <div className="bg-slate-950 h-12 items-center flex justify-between w-full px-24">
            <button onClick={() => likePost.mutate()} className="flex">
              {post.data.userHasLiked === true ? <HeartIcon width={24} color="red" /> : <HeartIcon width={24} />}
              {post.data.likes.length > 0 ? `(${post.data.likes.length})` : null}
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex">
              {showComments ?
                <ChatBubbleBottomCenterIcon width={24} color="blue" /> :
                <ChatBubbleBottomCenterIcon width={24} color="" />
              }
              ({post.data.replies.length})
            </button>
            <button className="mr-8 flex"><ShareIcon width={24} />(3)</button>
          </div>
          <div>
            {showComments ? (
              <div className="w-full flex flex-col overflow-y-scroll items-center bg-slate-800 no-scrollbar h-[267px]">
                <div className="flex w-full h-24 border-b-4">
                  <input type="text" onChange={(e) => setReplyData(e.target.value)} value={replyData} placeholder="Add a comment" className="w-full text-xl pl-4 bg-gray-900" />
                  <button onClick={() => replyToPost.mutate()} className=" hover:underline bg-emerald-600 hover:bg-emerald-400 transition-colors text-xl py-2 text-center px-4">Send!</button>
                </div>
                <div className="overflow-hidden w-full overflow-y-scroll no-scrollbar">
                  {post.data.replies.map((reply: any, index: any) => (
                    <div key={index} className="w=full h-16 px-2 gap-2 bg-slate-600 border-b-2 flex items-center">
                      {reply.user.image ? <img src={reply.user.image} className="w-8 h-8 rounded-full" /> : <UserCircleIcon width={34} />}
                      <p className="border-r-2 pr-4 w-1/5 text-center text-xl">{reply.user.userName ? reply.user.userName : reply.user.name}</p>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </MiddleSection>
  );
}
