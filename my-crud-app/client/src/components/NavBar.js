import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";



export default function NavBar() {

    const token = localStorage.getItem("token")

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
        <div className="md:w-full border-b-2 shadow-lg flex items-center justify-between bg-primary px-6 py-4">
            <div className="w-1/3">
                <button onClick={() => toast("resti")}>test</button>
            </div>
            <div className="w-1/3 flex justify-center">
                <Link to="/" className="text-2xl font-semibold hover:font-bold hover:underline font-serif">Blog Page</Link>  
            </div>
            {token ?
            (
            <div className="w-1/3 flex gap-4 justify-end">
                {user?.role === "ADMIN" ? 
                <div className="flex gap-2  items-center">
                    <p className="text-xs font-bold ">ADMIN</p>
                    <Link to="/createpost" className="text-lg font-semibold hover:underline transition-all ">Create new post</Link>
                </div>
                :
                null
                }
                <button className="text-lg font-semibold hover:underline transition-all " onClick={() => logout()}>Log out</button>
            </div>
            )
            :
            (
            <div className="w-1/3 flex gap-4 justify-end">
                <Link to="/signup" className="text-lg font-semibold hover:underline transition-all ">Sign Up</Link>
                <Link to="/login" className="text-lg font-semibold hover:underline transition-all " >Login</Link>
            </div >
            )
            }
        </div>
    )
}   