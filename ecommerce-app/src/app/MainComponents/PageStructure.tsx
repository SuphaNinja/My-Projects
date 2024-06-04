import { useState } from "react";
import NavBar from "../MainComponents/navbar/NavBar";
import SideBar from "./SideBar";
import Footer from "./Footer";

export default function PageStructure({ children }: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex  flex-col h-screen">
            <div className="fixed left-0 z-50  bg-white shadow-lg w-screen lg:static">
                <NavBar toggleSidebar={toggleSidebar} />
            </div>
            <div className="flex flex-1">
                <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform transform lg:static lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SideBar />
                </div>
                <div className="flex-1 mt-32 md:mt-0 lg:mt-0 bg-slate-100 p-4">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}
