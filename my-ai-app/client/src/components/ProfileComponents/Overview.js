import { useState } from "react";
import Trainer from "./Trainer";
import GoalTips from "./GoalTips";
import Profile from "./Profile";
import { Button } from "../ui/button";

export default function Overview ({user, setActiveComponent, isLoading}) {
    const [activeOverview, setActiveOverview] = useState("profile");

    const renderComponent = () => {
        switch (activeOverview) {
            case 'trainer':
                return <Trainer trainer={user.trainer} setActiveComponent={setActiveComponent} />;
            case 'GoalTips':
                return <GoalTips guide={user.guides[0]}/>;
            case 'profile':
                return <Profile user={user}/>;
            default:
                return null;
        }
    };

    return ( 
        <div className="w-full md:px-12 mt-8 flex flex-col">
            <div className="flex justify-evenly">
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveOverview('trainer')}
                    className={` ${activeOverview === 'trainer' && "font-semibold underline"}`}>
                    Your Trainer
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveOverview('profile')}
                    className={`${activeOverview === 'profile' && "font-semibold underline" }`}>
                    Your profile
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveOverview('GoalTips')}
                    className={`${activeOverview === 'GoalTips' && "font-semibold underline"}`}>
                    Reach your goals
                </Button>
            </div>
            <div>{renderComponent() }</div>
        </div>
    )
}