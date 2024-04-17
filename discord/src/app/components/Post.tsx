import api from "@/lib/axios";
import { ChatBubbleBottomCenterIcon, HeartIcon, ShareIcon } from "@heroicons/react/16/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import { useCopyToClipboard } from "usehooks-ts";



export default function Post({ post, imageClass }: any,) {

    const queryClient = useQueryClient();

    const [value, copy] = useCopyToClipboard();

    const likePost = useMutation({
        mutationFn: () => api.likePost(post.id),
        onSuccess: () => queryClient.invalidateQueries(),
    });

    const sharePost = (post: any) => {
        copy(process.env.NEXT_PUBLIC_BASE_URL + "/postpage/" + post.id)
        toast.success("Link copied to clipboard")
    }

    return (
        <div className={`w-full flex flex-col dark:border-slate-200 border-slate-800 border-b-2`}>
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-1/2">
                    <img src={post.postImage} alt="could not render image" className={`${imageClass}`} />
                </div>
                <div className="flex flex-col w-1/2 justify-between">
                    <div className=" flex-flex-col">
                        <h2 className="text-2xl font-bold text-center">{post.title}</h2>
                        <p className="text-xl text-center">{post.description}</p>
                        <p className="text-center">{post.tags.length > 0 ?
                            (post.tags.map((tag: any, index: number) => (
                                <span key={index} className="mx-1 text-slate-400">#{tag.tag}</span>
                            ))) : null}
                        </p>

                    </div>
                    <div className="mt-auto text-tiny">
                        Posted By: <Link href={process.env.NEXT_PUBLIC_BASE_URL + "/profilepage/" + post.user.id} className="text-xl font-bold dark:text-teal-200 text-black  hover:underline">{post.user.name ? post.user.name : post.user.firstName}</Link>
                </div>
                <div className="bg-slate-200 dark:bg-slate-950 py-2 pl-2 flex items-center">
                    <div className="flex w-full items-center justify-between text-sm">
                        <button onClick={() => likePost.mutate()} className="flex">
                            {post.userHasLiked === true ? <HeartIcon width={24} color="red" /> : <HeartIcon width={24} />}
                            {post.likes.length > 0 ? `(${post.likes.length})` : null}
                        </button>
                        <Link href={"/postpage/" + post.id} className="flex"><ChatBubbleBottomCenterIcon width={24} />({post.replies.length})</Link>
                        <button onClick={() => sharePost(post)} className="mr-8 flex"><ShareIcon width={24} /></button>
                    </div>
                    <div className="flex text-center mx-4 text-tiny">
                        <Link href={"/profilepage/" + post.user.id} className="font-semibold hover:underline">View Profile</Link>
                        <Link href={"/postpage/" + post.id} className="font-semibold hover:underline">View Post</Link>
                    </div>
                </div>
            </div>
        </div>
        </div >
    )
}