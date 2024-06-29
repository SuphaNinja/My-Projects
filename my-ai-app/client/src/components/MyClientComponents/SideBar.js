import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";

export default function SideBar({ trainer, setActiveComponent, activeComponent, isSidebarOpen, toggleSidebar }) {
    const params = useParams();

    return (
        <div>
            <div
                className={`h-[91vh] w-screen md:w-full px-2 dark:bg-slate-950/90 bg-slate-100/90 pt-8 sm:relative fixed top-16 md:top-0 left-0 z-40 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
            >
                <div className="flex flex-col">
                    <p className="text-center border-b-2 pb-2 font-semibold text-xl">{trainer.userName}'s clients</p>
                    <div className="overflow-y-auto h-[350px] flex gap-2 flex-col mt-2">
                        {trainer.clients.length > 0 ? (
                            trainer.clients.map((client, index) => (
                                <div
                                    key={index}
                                    className={`flex p-2 justify-between border rounded-md ${params.userId === client.id && "border-green-500"}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {client.profileImage ? (
                                            <img src={client.profileImage} alt="client" className="size-10 rounded-full" />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-10"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                        )}
                                        <p className="mx-auto border-l pl-2 text-lg">{client.userName}</p>
                                    </div>
                                    <Button 
                                        asChild
                                        variant="link"
                                    >
                                        <Link onClick={() => setActiveComponent("client")} to={"/myclients/" + client.id}>
                                            {params.userId === client.id ? "Viewing" : "View Client"}
                                        </Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>You have no clients yet!</p>
                        )}
                    </div>
                </div>
            </div>
            <Button 
                variant="ghost"
                onClick={toggleSidebar} 
                className="sm:hidden fixed top-20 left-0 z-50"
                >
                {isSidebarOpen ? "Close" : "Open"}
            </Button>
        </div>
    );
}
