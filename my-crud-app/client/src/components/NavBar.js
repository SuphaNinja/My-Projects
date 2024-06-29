import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ToggleTheme } from "./ui/ToggleTheme";
import { Button } from "./ui/button";



export default function NavBar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const fetchedUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = fetchedUser?.data?.data?.success;
    
    return (
        <div className="md:w-full border-b-2 z-50 fixed md:static w-full shadow-lg bg-primary px-6 py-4">
            <div className="flex relative items-center justify-between">
                <div className="w-1/3 md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg
                            className="w-6 h-6 text-white dark:text-black"
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
                <Button asChild>
                    <Link to="/" className="text-4xl    ">Blog Page</Link>
                </Button>
                </div>
                <div className="w-1/3 hidden md:flex gap-4 justify-end">
                    {user ? (
                        <>
                            {user?.role === "ADMIN" && (
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold dark:text-black text-white ">ADMIN</p>
                                    <Button asChild>
                                        <Link to="/createpost" >Create new post</Link>
                                    </Button>
                                </div>
                            )}
                            <Button asChild>
                                <Link to={`/profile/${user?.id}`}>Profile</Link>
                            </Button>
                            <Button className="text-lg font-semibold hover:underline transition-all" onClick={logout}>Log out</Button>
                            <ToggleTheme />
                        </>
                    ) : (
                        <>
                        <Button asChild>
                            <Link to="/signup" >Sign Up</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                            <ToggleTheme />
                        </>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="mt-4 md:hidden">
                    {user ? (
                        <>
                            {user?.role === "ADMIN" && (
                                <div className="flex flex-col gap-2 items-center">
                                    <p className="text-xs font-bold dark:text-black text-white">ADMIN</p>
                                    <Button asChild>
                                        <Link to="/createpost" >Create new post</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link to={`/profile/${user?.id}`} >Profile</Link>
                                    </Button>
                                </div>
                            )}
                            <Button className="" onClick={logout}>Log out</Button>
                            <ToggleTheme />
                        </>
                    ) : (
                        <>
                            <Button asChild>
                                <Link to="/signup" >Sign Up</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                                <ToggleTheme />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}   