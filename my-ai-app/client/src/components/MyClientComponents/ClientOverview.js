import { useState } from "react";
import ClientInfo from "./ClientInfo";
import ClientGoal from "./ClientGoal";
import { Button } from "../ui/button";

export default function ClientOverview({ user, setActiveComponent }) {
    const [activeOverview, setActiveOverview] = useState("clientinfo");

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
        <div className="w-full md:px-12 mt-8 flex flex-col">
            <div className="flex justify-evenly">
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveOverview('clientinfo')}
                    className={` ${activeOverview === 'clientinfo' && "underline"}`}>
                    Client info
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveOverview('clientgoal')}
                    className={`${activeOverview === 'clientgoal' && "underline" }`}>
                    Client Goal
                </Button>
            </div>
            <div>{renderComponent() }</div>
        </div>
    )
}