import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState } from "react";
import Guide from "../components/ProfileComponents/Guide";
import Overview from "../components/ProfileComponents/Overview";
import Profile from "../components/ProfileComponents/Profile";
import Chat from "../components/ProfileComponents/Chat";
import { Button } from "src/components/ui/button";
import { Skeleton } from "src/components/ui/skeleton";


export default function MyJourney() {
    const [activeComponent, setActiveComponent] = useState('overview');

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = currentUser?.data?.data?.success;

    const renderComponent = () => {
        switch (activeComponent) {
            case 'guide':
                return <Guide guide={user?.guides[0]} isLoading={currentUser.isLoading} />;
            case 'overview':
                return <Overview user={user} setActiveComponent={setActiveComponent} isLoading={currentUser.isLoading}/>;
            case 'chat':
                return <Chat user={user} isLoading={currentUser.isLoading}/>;
            default:
                return null;
        }
    };

    if (currentUser.isLoading) {
        return (
            <div className="w-screen flex ">
                <div className="flex flex-col mt-24 md:mt-4 h-screen space-y-3 md:mx-auto">
                    <Skeleton className="md:h-[500px] h-1/2 w-screen md:w-[1200px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 md:w-[1200px]" />
                        <Skeleton className="h-12 md:w-[1200px]" />
                        <Skeleton className="h-12 md:w-[1200px]" />
                        <Skeleton className="h-12 md:w-[1200px]" />
                    </div>
                </div>
            </div>
        )
    };

    if (currentUser.isSuccess) {
        return (
            <div className="md:mx-24 md:my-6 p-2 md:border-2 min-h-screen md:min-h-[95vh] md:max-h-[95vh] md:rounded-md flex flex-col">
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
                    {user.guides.length > 0 ? (
                        renderComponent()
                    ) : (
                        activeComponent === 'profile' ? (
                            <Profile user={user} />
                        ) : (
                            <div>
                                <p className="text-xl text-center mt-6">No guide yet, create a guide and return to this page after!</p>
                            </div>
                        )
                    )}
                </div>
                <div className="md:flex items-center mt-auto py-6  hidden justify-center">
                    <p className="md:text-6xl text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-pulse">
                        Unleash your inner BEAST!
                    </p>
                </div>
            </div>
        )
    };
}   