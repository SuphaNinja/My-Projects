import { useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

export default function SideBar({ trainer, setActiveComponent, activeComponent, isSidebarOpen, toggleSidebar }) {
    const params = useParams();
    const queryClient = useQueryClient();

    const handleViewClient = () => {
        setActiveComponent("client");
    };

    return (
        <div>
            <div
                className={`h-[91vh]  bg-gradient-to-r from-slate-400 to-slate-300 p-2 w-screen md:w-full sm:relative fixed top-16 md:top-0 sm:left-auto left-0 z-40 sm:z-auto transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
            >
                <div className="flex flex-col">
                    <div>
                        <p className="text-center font-semibold text-xl">{trainer.userName}'s clients</p>
                    </div>
                    <div className="overflow-y-auto text-white h-[350px] flex gap-2 flex-col mt-2">
                        {trainer.clients.length > 0 ? (
                            trainer.clients.map((client, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between bg-gradient-to-r rounded-md ${params.userId === client.id ? "from-slate-900 to-slate-700" : "from-slate-600 to-slate-400"}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {client.profileImage ? (
                                            <div className="size-full border-r-2">
                                                <img src={client.profileImage} alt="client" className="w-10 h-10 rounded-full" />
                                            </div>
                                        ) : (
                                            <div className="border-r-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-10 h-10"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <p className="mx-auto text-lg">{client.userName}</p>
                                    </div>
                                    <Link
                                        onClick={handleViewClient}
                                        to={"/myclients/" + client.id}
                                        className="bg-slate-700 text-nowrap mr-2 my-auto py-1 rounded-md hover:scale-105 transition-all hover:underline hover:bg-slate-800 px-2"
                                    >
                                        {params.userId === client.id ? "Viewing" : "View Client"}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div>
                                <p>You have no clients yet!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={toggleSidebar} className="sm:hidden fixed top-20 left-0 z-50 bg-slate-700/30 text-white p-2 rounded-md">
                {isSidebarOpen ? "Close" : "Open"}
            </button>
        </div>
    );
}
