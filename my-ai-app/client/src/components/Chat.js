import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../lib/axiosInstance";




export default function Chat (user) {
    const [ message, setMessage ] = useState(); 

    const queryClient = useQueryClient();

    const sendMessage = useMutation({
        mutationFn: () => axiosInstance.post("/send-message",{ message: message, recieverId: user.user.trainerId }),
        onSuccess: () => {
            queryClient.invalidateQueries(["messages"])
        }
    });

    const messages = useQuery({
        queryKey: ["messages"],
        queryFn: () => axiosInstance.get("/get-messages")
    });

    const readMessage = useMutation({
        mutationFn: (messageId) => axiosInstance.post("/update-message", {messageId}),
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries(["messages"])
            }, 200);
        }
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
    }
    

    return ( 
        <div className="md:h-auto md:mt-8 h-[65vh] ">
            <div className=" flex flex-col justify-between  md:h-full gap-2 md:mx-12">
                <div className="overflow-y-auto  grid grid-cols-4 md:rounded-xl md:border-2 bg-slate-500/80 md:p-4 h-[65vh] md:h-[350px]">
                    <div className="col-span-2 flex flex-col gap-2">
                        {messages.data?.data?.messages.recievedMessages?.length > 0 &&
                            messages.data?.data?.messages.recievedMessages.map((message, index) => (
                                <div key={index} className="bg-gradient-to-r from-slate-900 shadow-xl to-slate-700 text-white md:h-24 h-[40vh] md:grid flex flex-col md:grid-cols-8 justify-between md:rounded-l-md md:border-l-2 border-y-2 border-slate-300">
                                    <div className="col-span-2 ">
                                        {message.sender.profileImage ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={message.sender.profileImage} alt="Profile image" />
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
                                    <div className="col-span-5 p-2 md:mb-0 mb-auto md:border-t-0 border-t-2 overflow-y-auto no-scrollbar md:border-x-2 border-slate-300">
                                        <p className="text-sm text-pretty">{message.content}</p>
                                    </div>

                                    <div className="col-span-1 ">
                                        <div className="flex flex-col md:ml-2 md:pt-0 md:border-t-0 pt-2 border-t-2 h-full">
                                            <p className="text-xs text-center  md:my-auto ">{timeAgo(message.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="col-span-2 flex flex-col gap-2">
                        {messages.data?.data?.messages.sentMessages.length > 0 && 
                            messages.data?.data?.messages.sentMessages.map((message, index) => (
                                <div key={index} className="bg-gradient-to-r relative from-slate-700 shadow-xl to-slate-500 justify-between text-white md:h-24 md:grid flex flex-col  md:grid-cols-8 h-[40vh] rounded-r-md md:border-r-2 border-y-2 border-slate-300">
                                    <div className="absolute left-6 hidden md:block top-1/4 w-0.5 h-1/2 bg-slate-300"></div>
                                <div className="col-span-2 ">
                                    {message.sender.profileImage ? (
                                        <div className="flex flex-col items-center justify-center">
                                            <img src={message.sender.profileImage} alt="Profile image" />
                                            <p className="font-semibold">{message.sender.userName}</p>
                                        </div>
                                    ) : (
                                            <div className="flex flex-col size-full md:ml-4 items-center justify-center ">
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </div>
                                            <p className="font-semibold">{message.sender.userName}</p>
                                        </div>
                                    )}
                                   
                                </div>
                                <div className="col-span-5 p-2 mb-auto md:mt-0 mt-4 border-t-2 md:border-none overflow-y-auto  border-slate-300">
                                    <p className="text-sm text-pretty">{message.content}</p>
                                </div>
                                
                                <div className="col-span-1 ">
                                        <div className="flex flex-col md:pt-0 border-l-2 md:border-t-0 pt-2 border-t-2 h-full">
                                        <p className="text-xs text-center mt-auto md:mx-auto md:my-auto ">{timeAgo(message.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
                <div className="w-full md:flex-row flex flex-col ">
                    <textarea
                        name="description"
                        placeholder="Ask anything related to training!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full h-16 -mt-2 md:-mt-0 p-2 md:border-2 border-gray-300 md:rounded-lg bg-slate-800 text-white resize-none"
                        rows="4"
                    ></textarea>
                    <button 
                        className="md:w-1/6 mt-2 md:mt-0 py-2 md:py-0 hover:scale-105 sm:mx-auto bg-gradient-to-r from-emerald-700 to-emerald-400 md:rounded-full hover:from-emerald-800 hover:to-emerald-500 transition-all hover:underline" 
                        onClick={sendMessage.mutate}>
                            Send message!
                    </button>
                </div>
                {sendMessage.data?.data?.error && <p className="bg-red-500 -mt-3 md:-mt-1 font-semibold rounded-md text-center">{sendMessage.data?.data?.error}</p>}
                {sendMessage.data?.data?.success && <p className="bg-emerald-500 -mt-3 md:-mt-1 font-semibold rounded-md text-center">{sendMessage.data?.data?.success}</p>}
          </div>
        </div>
    )
}