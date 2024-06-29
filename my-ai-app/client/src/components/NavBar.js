import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToggleTheme } from "./ui/ToggleTheme";
import { Button } from "./ui/button";



export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/")
        window.location.reload();
    };

    const fetchedUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = fetchedUser?.data?.data?.success;

    return (
        <div className="z-50 top-0 fixed md:static w-full bg-primary px-6 py-4">
            <div className="flex relative items-center justify-between">
                <div className="w-1/3 md:hidden ">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg
                            className="w-6 h-6 dark:text-black text-white"
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
                    <Link to="/" className="flex items-center space-x-2 md:text-4xl text-2xl font-bold tracking-wide dark:hover:text-blue-600 dark:text-black text-white hover:text-blue-600 transition-colors duration-300 ease-in-out">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>GoalFitPro</span>
                    </Link>
                </div>
                <div className="w-1/3 hidden md:flex gap-4 justify-end">
                    {user ? (
                        <>  
                            <Button asChild>
                                    <Link to="/shop" className="hover:underline transition-all">Shop</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/newclient" className="hover:underline transition-all">Create guide</Link>
                            </Button>
                            {user?.guides?.length > 0 &&
                            <Button asChild>
                                <Link to="/myjourney" className="hover:underline transition-all">My journey</Link>
                            </Button>
                            } 
                           {user?.role === "TRAINER" &&
                            <Button asChild>
                                <Link to="/myclients" className="hover:underline transition-all">My Clients</Link>
                            </Button>
                            }
                            <Button asChild>
                                <Link to="/shoppingcart" className="flex my-auto" >
                                    <svg
                                        className="w-5 h-5  "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                                stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M3 4h2l2.68 9.92A2 2 0 0 0 9.62 16h4.76a2 2 0 0 0 1.94-1.08L19 6h-3"
                                        ></path>
                                        <circle cx="9" cy="19" r="2"></circle>
                                        <circle cx="17" cy="19" r="2"></circle>
                                    </svg>
                                    {user?.cart?.cartItems?.length > 0 &&
                                        <p className="text-xs ">({user?.cart?.cartItems?.length})</p>
                                    }
                                </Link>
                            </Button>
                            <Button onClick={logout} className="hover:underline transition-all">Log out</Button>
                            <ToggleTheme />
                        </>
                    ) : (
                        <>
                            <Button asChild>
                                <Link to="/signup" className="hover:underline transition-all">Sign Up</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/login" className="hover:underline transition-all">Login</Link>
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
                            <Button asChild>
                                <Link to="/shop" className="hover:underline transition-all">Shop</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/newclient" className="hover:underline transition-all">Create guide</Link>
                            </Button>
                            {user?.guides?.length > 0 &&
                                <Button asChild>
                                    <Link to="/myjourney" className="hover:underline transition-all">My journey</Link>
                                </Button>
                            }
                            {user?.role === "TRAINER" &&
                                <Button asChild>
                                    <Link to="/myclients" className="hover:underline transition-all">My Clients</Link>
                                </Button>
                            }
                            <Button asChild>
                                <Link to="/shoppingcart" className="flex my-auto" >
                                    <svg
                                        className="w-5 h-5  "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M3 4h2l2.68 9.92A2 2 0 0 0 9.62 16h4.76a2 2 0 0 0 1.94-1.08L19 6h-3"
                                        ></path>
                                        <circle cx="9" cy="19" r="2"></circle>
                                        <circle cx="17" cy="19" r="2"></circle>
                                    </svg>
                                    {user?.cart?.cartItems?.length > 0 &&
                                        <p className="text-xs ">({user?.cart?.cartItems?.length})</p>
                                    }
                                </Link>
                            </Button>
                            <Button onClick={logout} className="ml-24">Log out</Button>
                            <ToggleTheme />
                        </>
                    ) : (
                        <>
                            <Button asChild>
                                <Link to="/signup" className="hover:underline transition-all">Sign Up</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/login" className="hover:underline transition-all">Login</Link>
                            </Button>
                            <ToggleTheme />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}   