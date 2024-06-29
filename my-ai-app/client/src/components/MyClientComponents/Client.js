import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import { useParams } from "react-router-dom";
import ClientGuide from "./ClientGuide";
import ClientOverview from "./ClientOverview";
import ClientChat from "./ClientChat";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export default function Client () {
    const queryClient = useQueryClient();
    const params = useParams();
    const [ activeComponent, setActiveComponent ] = useState('overview');

    const fetchUser = useQuery({
        queryKey: ["client"],
        queryFn: () => axiosInstance.post("/get-user-by-id", params)
    });
    const user = fetchUser?.data?.data?.success;
    
    const renderComponent = () => {
        switch (activeComponent) {
            case 'guide':
                return <ClientGuide guide={user?.guides[0]} />;
            case "overview": 
                return <ClientOverview user={user} setActiveComponent={setActiveComponent} />
            case "chat":
                return <ClientChat user={user}/>
            default:
                return null;
        }
    };

    useEffect(()=>{
        setTimeout(() => {
            queryClient.invalidateQueries(["client"]);
        }, 50);
    }, [params])

    if (fetchUser.isLoading) {
        return (
            <div className="flex md:mx-4 md:mt-4  w-auto flex-col space-y-3">
                <Skeleton className="h-[600px] md:w-auto w-screen rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-12 md:w-full w-screen" />
                    <Skeleton className="h-12 md:w-full w-screen" />
                    <Skeleton className="h-12 md:w-full w-screen" />
                </div>
            </div>
        )
    };

    if (!user) {
       return (
           <div className="flex md:mx-8 md:mt-4  w-auto flex-col space-y-3">
               <Skeleton className="h-[600px] md:w-auto w-screen rounded-xl" >
                   <p className="mt-60 text-4xl text-center">Click on a client to view their profile!</p>
                </Skeleton>
               <div className="space-y-2">
                   <Skeleton className="h-12 md:w-full w-screen" />
                   <Skeleton className="h-12 md:w-full w-screen" />
                   <Skeleton className="h-12 md:w-full w-screen" />
               </div>
           </div>
       )
    };

    return (
        <div className="md:mx-12 md:my-6 p-2 md:border-2 min-h-screen md:min-h-[88vh] md:h-[88vh] md:rounded-md flex flex-col">
            <div className="flex items-center justify-evenly w-full py-6 md:py-0 border-b">
                <p className="text-2xl mt-12 md:mt-0 ">
                    <span className="md:text-4xl font-extrabold">{user.userName}'s</span>{' '}
                    <span className="text-cyan-700 dark:text-cyan-500 md:text-4xl font-extrabold">training guide!</span>
                </p>
                <div className="md:block hidden">
                    {user.profileImage ? (
                        <img className="size-44 object-cover rounded-full" src={user.profileImage} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-44">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    )}
                </div>
            </div>
            <div className="flex py-4 border-b justify-between md:px-12">
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('guide')}
                    className={`${activeComponent === 'guide' && "font-semibold underline"}`}>
                    Guide
                </Button>
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('overview')}
                    className={`${activeComponent === 'overview' && "font-semibold underline"}`}>
                    Overview
                </Button>
                <Button
                    variant="link"
                    onClick={() => setActiveComponent('chat')}
                    className={`${activeComponent === 'chat' && "font-semibold underline"}`}>
                    Chat
                </Button>
            </div>
            <div className="h-auto">
                {renderComponent()}
            </div>
            <div className="md:flex items-center mt-auto py-2 hidden justify-center">
                <p className="md:text-6xl text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-pulse">
                    Unleash your inner BEAST!
                </p>
            </div>
        </div>
    )
}   