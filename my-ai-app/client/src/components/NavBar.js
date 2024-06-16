import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function NavBar() {

    const token = localStorage.getItem("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

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
                <div className="w-2/3 md:w-1/3 flex justify-center md:justify-start">
                    <Link to="/" className="flex items-center space-x-2 text-4xl font-bold tracking-wide text-gray-900 hover:text-blue-600 transition-colors duration-300 ease-in-out">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>GoalFitPro</span>
                    </Link>
                </div>
                <div className=" hidden md:flex gap-4 justify-end ">
                    {token ? (
                        <>
                            {user?.guides?.length > 0 && 
                                <Link to="/myjourney" className="text-lg font-semibold hover:underline transition-all">My journey</Link>
                            }
                            {user?.role === "ADMIN" ? (
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">ADMIN</p>
                                    
                                </div>
                            ): (user?.role === "TRAINER" && 
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">TRAINER</p>
                                    <Link to="/myclients" className="text-lg text-nowrap font-semibold hover:underline transition-all">My Clients</Link>    
                                </div>
                            )}
                            <Link to="/shop" className="text-lg text-nowrap font-semibold hover:underline transition-all">Shop</Link>
                            <Link to="/newclient" className="text-lg text-nowrap font-semibold hover:underline transition-all">Create guide</Link>
                            <button className="text-lg font-semibold hover:underline transition-all" onClick={logout}>Log out</button>
                            <div className="flex">
                                <Link to="/shoppingcart">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6"
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
                                </Link>
                                {user?.cart?.cartItems?.length > 0 &&
                                    <p>({user?.cart?.cartItems?.length})</p>
                                }
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="text-lg text-nowrap font-semibold hover:underline transition-all">Sign Up</Link>
                            <Link to="/login" className="text-lg text-nowrap font-semibold hover:underline transition-all">Login</Link>
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
                                </div>
                            ) : (user?.role === "TRAINER" && 
                                <div className="flex gap-2 items-center">
                                    <p className="text-xs font-bold">TRAINER</p>
                                    <Link to="/myclients" className="text-lg text-nowrap font-semibold hover:underline transition-all">My Clients</Link>
                                </div>
                            )}
                                <Link to="/newclient" className="text-lg text-nowrap font-semibold hover:underline transition-all">Create guide</Link>
                                {user?.guides?.length > 0 &&
                                    <Link to="/myjourney" className="text-lg font-semibold hover:underline transition-all">My journey</Link>
                                }  
                            </div>
                            <div className="flex">
                                <Link to="/shoppingcart">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6"
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
                                </Link>
                                {user?.cart?.cartItems?.length > 0 &&
                                    <p>({user?.cart?.cartItems?.length})</p>
                                }
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