import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState } from "react";
import Guide from "../components/Guide";
import Overview from "../components/Overview";
import Profile from "../components/Profile";


export default function MyJourney () {
    const [activeComponent, setActiveComponent] = useState('overview');

    
    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = currentUser?.data?.data?.success;

    const renderComponent = () => {
        switch (activeComponent) {
            case 'guide':
                return <Guide guide={user?.guides[0]} />;
            case 'profile':
                return <Profile user={user}/>;
            case 'overview':
                return <Overview />;

            default:
                return null;
        }
    };



    if (currentUser.isSuccess) {
        return ( 
            <div>
                <button onClick={() => console.log(user)}>console.log user</button>
                <div className="md:mx-24 h-full text-white flex flex-col">
                    <div className="bg-gradient-to-b  from-slate-800 to-slate-600 md:rounded-md md:overflow-hidden flex flex-col w-full h-[88vh]">
                        <div className="bg-gradient-to-b  from-slate-800 to-slate-600 flex md:px-12 items-center justify-between w-full h-1/6">
                            <p className="text-2xl text-center mx-auto">{user.userName}'s <span>training guide!</span></p>
                        </div>
                        <div className="flex border-b-2 px-12 pb-2 justify-between">
                            <button
                                onClick={() => setActiveComponent('guide')}
                                className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'guide' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                Guide
                            </button>
                            <button
                                onClick={() => setActiveComponent('overview')}
                                className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'overview' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                overview
                            </button>
                            <button
                                onClick={() => setActiveComponent('profile')}
                                className={`md:text-xl transition-all hover:font-semibold hover:underline ${activeComponent === 'profile' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                                Profile
                            </button>
                        </div>
                        <div className="mt-2 p-4 h-auto">
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
                       
                        <div className="flex items-center mt-auto py-4 justify-center bg-slate-950">
                            <p className="md:text-6xl text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-pulse">
                                Unleash your inner BEAST!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          
        )
    }
}   