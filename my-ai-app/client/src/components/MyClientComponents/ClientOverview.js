import { useState } from "react";
import ClientInfo from "./ClientInfo";
import ClientChat from "./ClientChat";
import ClientGoal from "./ClientGoal";




export default function ClientOverview({ user, setActiveComponent }) {

    const [activeOverview, setActiveOverview] = useState("tips");


    const renderComponent = () => {
        switch (activeOverview) {
            case 'clientinfo':
                return <ClientInfo client={user} setActiveComponent={setActiveComponent}/>;
            case 'clientgoal':
                return <ClientGoal guide={user.guides[0]} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <p className="text-center md:text-4xl mb-6 text-xl">Overview</p>
            <div className="w-full md:px-12 flex flex-col">
                <div className="flex justify-evenly">
                    <button
                        onClick={() => setActiveOverview('clientinfo')}
                        className={`md:text-xl transition-all hover:font-semibold  hover:underline ${activeOverview === 'clientinfo' ? " text-white font-semibold underline " : "text-slate-300"}`}>
                        Client information
                    </button>
                    <button
                        onClick={() => setActiveOverview('clientgoal')}
                        className={`md:text-xl transition-all hover:font-semibold  hover:underline ${activeOverview === 'clientgoal' ? " text-white font-semibold underline " : "text-slate-300"}`}>
                        Client Goal
                    </button>
                </div>
                <div>{renderComponent()}</div>
            </div>
        </div>
    )
}