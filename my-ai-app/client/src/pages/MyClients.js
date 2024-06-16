import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import SideBar from "../components/MyClientComponents/SideBar";
import { useState } from "react";
import Client from "../components/MyClientComponents/Client";

export default function MyClients() {
    const [activeComponent, setActiveComponent] = useState("client");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchTrainer = useQuery({
        queryKey: ["trainer"],
        queryFn: () => axiosInstance.get("/get-current-trainer"),
    });

    const trainer = fetchTrainer?.data?.data?.success;

    const renderComponent = () => {
        switch (activeComponent) {
            case "client":
                return <Client />;
            default:
                return null;
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (trainer) {
        return (
            <div className="flex flex-col md:flex-row md:h-[91vh]  ">
                
                <div className="md:w-[350px]">
                    <SideBar
                        trainer={trainer}
                        activeComponent={activeComponent}
                        setActiveComponent={setActiveComponent}
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                    />
                </div>
                <div className="flex-1">
                    {renderComponent()}
                </div>
            </div>
        );
    }

    return null;
}
