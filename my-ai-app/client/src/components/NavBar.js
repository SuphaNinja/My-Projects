import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";



export default function NavBar() {

    const token = localStorage.getItem("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const fetchedUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = fetchedUser?.data?.data?.success;

    return (
        <div className="md:w-full z-50 fixed md:static w-full shadow-lg bg-gradient-to-b from-slate-600 to-slate-400 px-6 py-4">
            <div className="flex relative items-center justify-between">
                <div className="w-1/3 md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                            ></path>
                        </svg>
                    </button>
                </div>  
                <div className="w-1/3 flex justify-center md:justify-start">
                    <Link to="/" className="text-2xl font-semibold hover:font-bold hover:underline font-serif">Blog Page</Link>
                </div>
                <div className="w-1/3 hidden md:flex gap-4 justify-end">
                    {token ? (
                        <>
                            <Link to="/myjourney" className="text-lg font-semibold hover:underline transition-all">My journey</Link>
                            {user?.role === "ADMIN" ? (
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">ADMIN</p>
                                    <Link to="/newclient" className="text-lg font-semibold hover:underline transition-all">New Client</Link>
                                </div>
                            ): (user?.role === "TRAINER" && 
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">TRAINER</p>
                                    <Link to="/myclients" className="text-lg font-semibold hover:underline transition-all">My Clients</Link>    
                                </div>
                            )}
                            
                            <button className="text-lg font-semibold hover:underline transition-all" onClick={logout}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="text-lg font-semibold hover:underline transition-all">Sign Up</Link>
                            <Link to="/login" className="text-lg font-semibold hover:underline transition-all">Login</Link>
                        </>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="mt-4 md:hidden">
                    {token ? (
                        <>
                        <div className="flex flex-col gap-2 items-center">
                            {user?.role === "ADMIN" ? (
                                <div>
                                    <p className="text-xs font-bold">ADMIN</p>
                                    
                                    <Link to={`/profile/${user?.id}`} className="text-lg font-semibold hover:underline transition-all">Profile</Link>
                                </div>
                            ) : (user?.role === "TRAINER" && 
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">TRAINER</p>
                                    <Link to="/myclients" className="text-lg font-semibold hover:underline transition-all">My Clients</Link>
                                </div>
                            )}
                                <Link to="/myjourney" className="text-lg font-semibold hover:underline transition-all">My journey</Link>    
                            </div>
                            <button className="text-lg font-semibold hover:underline transition-all" onClick={logout}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="text-lg font-semibold hover:underline transition-all block">Sign Up</Link>
                            <Link to="/login" className="text-lg font-semibold hover:underline transition-all block">Login</Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}   