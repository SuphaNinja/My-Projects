import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axiosInstance"


import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function Comment(comment) {

    const queryClient = useQueryClient();

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const options = {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    };

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });

    const deleteComment = useMutation({
        mutationFn: (commentId) => axiosInstance.post("/delete-comment", {commentId})
    });

    const handleDeleteComment = (commentId) => {
        deleteComment.mutate(commentId)
        queryClient.invalidateQueries(['post']);
        console.log(commentId)
    };


    if (comment.comment.length < 1) {
        return (
            <p className="text-xl">No comments yet!</p>
        )
    } else {
        return (
            <div className="grid border-2 bg-primary grid-cols-6 p-1">
                <div className="col-span-1 flex flex-col">
                    <div className="flex justify-center">
                        {comment.comment.user.Profilemage !== null ?
                            <img src={comment.comment.user.Profilemage} />
                            :
                            <UserCircleIcon width={60} />
                        }
                    </div>
                    <p className="text-center">{comment.comment.user.userName}</p>
                </div>
                <div className="col-span-3 overflow-y-scroll border-x-2 px-2 max-h-[70px]  ">
                    <p className="text-pretty">{comment.comment.content}</p>
                </div>
                <div className="col-span-2 flex flex-col items-center justify-center">
                    {currentUser.data.data.success.role === "ADMIN" ? 
                        <button onClick={() => handleDeleteComment(comment.comment.id)} className="bg-important text-white rounded-xl py-1 px-2 hover:brightness-75">Delete comment!</button>
                    :null
                    }
                    <button onClick={() => console.log(deleteComment)}>testtesttest</button>
                    <p className="text-tiny font-thin">{formatDateTime(comment.comment.created_at)}</p>
                </div>
            </div>
        )
    }
}