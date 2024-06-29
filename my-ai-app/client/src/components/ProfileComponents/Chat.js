import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function Chat(user) {
    const [message, setMessage] = useState();

    const queryClient = useQueryClient();

    const sendMessage = useMutation({
        mutationFn: () => axiosInstance.post("/send-message", { message: message, recieverId: user.user.trainerId }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["messages"])
            setMessage("")
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    const fetchUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const currentUser = fetchUser?.data?.data?.success;

    const deleteMessage = useMutation({
        mutationFn: (messageId) => axiosInstance.post("/delete-message", { messageId: messageId }),
        onSuccess:(data) => {
            setTimeout(() => {
                queryClient.invalidateQueries(["messages"]);
            }, 50);
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    const messages = useQuery({
        queryKey: ["messages"],
        queryFn: () => axiosInstance.get("/get-messages")
    });

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hrs ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " min ago";
        }
        return Math.floor(seconds) + " sec ago";
    };
    console.log(messages.data?.data?.messages)
    return (
        <div className="flex flex-col justify-between gap-4 md:mx-12 mt-4">
            <div className="overflow-y-auto no-scrollbar grid grid-cols-4 gap-4 h-[53vh] md:h-[350px]">
                <div className="col-span-2 flex flex-col gap-2">
                    {messages.data?.data?.messages?.recievedMessages?.length > 0 &&
                        messages.data?.data?.messages.recievedMessages.map((message, index) => (
                            <div key={index} className="md:h-24 h-[40vh] md:grid flex border p-1 rounded-md flex-col md:grid-cols-8 justify-between">
                                <div className="col-span-2 ">
                                    {message.sender.profileImage ? (
                                        <div className="flex flex-col items-center justify-center">
                                            <img className="size-10 rounded-full object-cover" src={message.sender.profileImage} alt="Profile image" />
                                            <p className="font-semibold">{message.sender.userName}</p>
                                            {message.sender.role === "TRAINER" && <p className="text-xs text-center">Trainer</p>}
                                            {message.sender.role === "ADMIN" && <p className="text-xs text-center">-Admin-</p>}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col size-full items-center justify-center ">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </div>
                                            <p className="font-semibold ">{message.sender.userName}</p>
                                            {message.sender.role === "TRAINER" && <p className="text-xs text-center">-Trainer-</p>}
                                            {message.sender.role === "ADMIN" && <p className="text-xs text-center">-Admin-</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-5 p-2 md:mb-0 mb-auto md:border-t-0 border-t overflow-y-auto no-scrollbar md:border-x ">
                                    <p className="text-sm text-pretty">{message.content}</p>
                                </div>
                                <div className="col-span-1 ">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <p className="text-xs text-center ">{timeAgo(message.createdAt)}</p>
                                        {currentUser.role === "TRAINER" || currentUser.id === message.sender.id ? (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteMessage.mutate(message.id)}
                                            > Delete
                                            </Button>
                                        ) : (null)
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    {messages.data?.data?.messages?.sentMessages?.length > 0 &&
                        messages.data?.data?.messages.sentMessages.map((message, index) => (
                            <div key={index} className="justify-between md:h-24 border p-1 rounded-md md:grid flex flex-col md:grid-cols-8 h-[40vh]">
                                <div className="col-span-2 ">
                                    {message.sender.profileImage ? (
                                        <div className="flex flex-col items-center justify-center">
                                            <img className="size-10 rounded-full object-cover" src={message.sender.profileImage} alt="Profile image" />
                                            <p className="font-semibold">{message.sender.userName}</p>
                                            {message.sender.role === "TRAINER" && <p className="text-xs text-center">Trainer</p>}
                                            {message.sender.role === "ADMIN" && <p className="text-xs text-center">-Admin-</p>}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col size-full items-center justify-center ">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            <p className="font-semibold ">{message.sender.userName}</p>
                                            {message.sender.role === "TRAINER" && <p className="text-xs text-center">-Trainer-</p>}
                                            {message.sender.role === "ADMIN" && <p className="text-xs text-center">-Admin-</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-5 p-2 md:mb-0 mb-auto md:border-t-0 border-t overflow-y-auto no-scrollbar md:border-x">
                                    <p className="text-sm text-pretty">{message.content}</p>
                                </div>
                                <div className="col-span-1 ">
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <p className="text-xs text-center">{timeAgo(message.createdAt)}</p>
                                        {currentUser.role === "TRAINER" || currentUser.id === message.sender.id ? (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteMessage.mutate(message.id)}
                                            > Delete
                                            </Button>
                                        ) :  ( null )
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="w-full md:flex-row mt-4 flex flex-col ">
                <Textarea
                    className="md:w-2/3"
                    name="description"
                    placeholder="Ask anything related to training!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></Textarea>
                <Button
                    className="md:m-auto"
                    onClick={sendMessage.mutate}>
                    Send message!
                </Button>
            </div>
        </div>
    )
}