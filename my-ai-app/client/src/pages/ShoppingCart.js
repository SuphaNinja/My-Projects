
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance"
import CartItemCard from "../components/CartItemCard";
import { Link } from "react-router-dom";

export default function ShoppingCart () {



    const user = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const currentUser = user.data?.data?.success;
    

    if(user.isLoading) {
        return <p>Loading... </p>
    }

    if (currentUser.cart.cartItems.length < 1) {
        return (
            <div className="w-full h-screen flex md:items-center justify-center">
                <div className="bg-slate-500 md:p-24 pt-24 text-center md:rounded-full text-white font-semibold text-4xl shadow-xl">
                    <p className="text-3xl">You have no items in your cart!</p>
                    <Link className="hover:underline mt-2 font-bold hover:text-6xl transition-all duration-1000 " to="/shop">Visit our <
                        span className="text-blue-400">Shop</span> and add some!
                        
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <button onClick={() => console.log(currentUser)}>currentuser </button>
            <p className="text-4xl ml-6">ShoppingCart ({currentUser.cart.cartItems.length})</p>
            <div className="grid grid-cols-4 p-6">
                <div className="col-span-3 overflow-y-auto md:max-h-[680px] flex gap-4 bg-slate-500 p-6 w-full flex-col ">
                    {currentUser.cart.cartItems.map((item, index) => (
                        <div key={index} className="flex w-full">
                            <CartItemCard itemId={item.productId} quantity={item.quantity} cartItemId={item.id}/>
                        </div>
                    ))}
                </div>
                <div className="col-span-1 bg-red-500">
                        {/* //this should be a dropdown on small devices that comes out from the side */}
                </div>
            </div>
        </div>
    )
}



