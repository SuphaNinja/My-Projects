import { useState } from "react";
import Trainer from "./Trainer";
import GoalTips from "./GoalTips";
import Profile from "./Profile";



export default function Overview ({user, setActiveComponent}) {

    const [activeOverview, setActiveOverview] = useState("tips");

    
    const renderComponent = () => {
        switch (activeOverview) {
            case 'trainer':
                return <Trainer trainer={user.trainer} setActiveComponent={setActiveComponent}/>;
            case 'GoalTips':
                return <GoalTips />;
            case 'profile':
                return <Profile user={user}/>;
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
                        onClick={() => setActiveOverview('trainer')}
                        className={`md:text-xl transition-all ml-8 hover:font-semibold hover:underline ${activeOverview === 'trainer' ? " text-white font-semibold underline" : "text-slate-300"}`}>
                        Your Trainer
                    </button>
                    <button
                        onClick={() => setActiveOverview('profile')}
                        className={`md:text-xl transition-all hover:font-semibold  hover:underline ${activeOverview === 'profile' ? " text-white font-semibold underline " : "text-slate-300"}`}>
                        Your profile
                    </button>
                    <button
                        onClick={() => setActiveOverview('GoalTips')}
                        className={`md:text-xl transition-all hover:font-semibold  hover:underline ${activeOverview === 'GoalTips' ? " text-white font-semibold underline " : "text-slate-300"}`}>
                        Reach your goals
                    </button>
                </div>
                <div>{renderComponent() }</div>
            </div>
        </div>
    )
}