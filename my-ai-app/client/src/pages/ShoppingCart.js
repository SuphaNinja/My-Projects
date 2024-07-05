
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance"
import CartItemCard from "../components/CartItemCard";
import { Link } from "react-router-dom";
import { Skeleton } from "src/components/ui/skeleton";
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "src/components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useRef, useState } from "react";
import { Button } from "src/components/ui/button";

export default function ShoppingCart() {
    const stripePromise = loadStripe('ENTER KEY HERE');

    const targetRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleScroll = () => {
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollPosition = () => {
        if (targetRef.current) {
            const targetPosition = targetRef.current.getBoundingClientRect().top;
            setShowScrollButton(targetPosition > window.innerHeight || targetPosition < 0);
        }
    };

    window.addEventListener('scroll', handleScrollPosition);

    const user = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const currentUser = user.data?.data?.success;

    if (user.isLoading) {
        return (
            <div className="flex flex-col gap-2 md:justify-center h-screen md:mx-24">
                <Skeleton className="md:h-1/6 h-2/6 md:w-1/2 mt-24 md:mt-0 w-full rounded-xl"/>
                <Skeleton className="md:h-1/6 h-2/6 md:w-1/2 md:mt-0 w-full rounded-xl"/>
                <Skeleton className="md:h-1/6 h-2/6 md:w-1/2 md:mt-0 w-full rounded-xl"/>
                <Skeleton className="md:h-1/6 h-2/6 md:w-1/2  md:mt-0 w-full rounded-xl"/>
            </div>
        )
    };

    if (currentUser.cart?.cartItems?.length < 1) {
        return (
            <div className="h-screen flex flex-col items-center ">
                <p className="md:text-3xl mt-24">You have no items in your cart!</p>
                <Link className="hover:underline text-lg mt-2" to="/shop">Visit our 
                    <span className="text-blue-400"> Shop</span> and add some!
                </Link>
            </div>
        )
    };


    return (
        <div className="relative">
            {showScrollButton && (
            <Button
                onClick={handleScroll}
                className="fixed md:hidden right-0 top-16 z-10"
                >
                Proceed to Checkout
            </Button>
            )}
            <p className="md:text-3xl text-2xl ml-6 mt-16 md:mt-0">ShoppingCart ({currentUser.cart?.cartItems?.length})</p>
            <div className="grid grid-cols-4 md:p-6">
                <div className="md:col-span-3 col-span-4 overflow-y-auto md:max-h-[80vh] flex gap-4 w-full flex-col">
                    {currentUser.cart?.cartItems?.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row w-full">
                            <CartItemCard itemId={item.productId} quantity={item.quantity} cartItemId={item.id} />
                        </div>
                    ))}
                </div>
                <div ref={targetRef} className="col-span-4 pt-12 md:pt-0 md:col-span-1 p-4 md:bg-transparent">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm currentUser={currentUser} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}



