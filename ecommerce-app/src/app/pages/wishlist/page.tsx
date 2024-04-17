"use client";


import { useQuery } from "@tanstack/react-query";
import GetCartItem from "../shoppingcart/CartComponents/GetCartItem";
import api from "@/lib/axios";
import NavBar from "@/app/MainComponents/navbar/NavBar";
import Link from "next/link";
import TotalCartPrice from "../shoppingcart/CartComponents/TotalCartPrice";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import Footer from "@/app/MainComponents/Footer";
import RecommendedProducts from "../shoppingcart/CartComponents/RecommendedProducts";
import { useEffect, useRef, useState } from "react";
import GetWishlistItem from "./wishlistComponents/GetWishlistItem";



export default function Page() {
    const scrollRef = useRef<HTMLDivElement>(0);

    const scrollLeft = () => {
        if (scrollRef.current) {
            (scrollRef.current as HTMLDivElement).scrollBy({
                left: -290, // Adjust the scroll distance as needed
                behavior: 'smooth', // Use smooth scrolling behavior
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            (scrollRef.current as HTMLDivElement).scrollBy({
                left: 290, // Adjust the scroll distance as needed
                behavior: 'smooth', // Use smooth scrolling behavior
            });
        }
    };

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const products = useQuery({
        queryKey: ["products"],
        queryFn: () => api.getAllProducts()
    });

    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    useEffect(() => {
        // Calculate total width of all items
        if (scrollRef.current) {
            const totalWidth = scrollRef.current.scrollWidth;
            setContainerWidth(totalWidth as number);
        }
    }, [products.data?.products]);


    return (
        <div className="w-full">
            <NavBar />
            <div className="pl-4 w-full border-b-1 py-2 ">
                <Link href={"/"} className="font-bold text-lg hover:underline">{"< Continue Shopping"}</Link>
            </div>
            <div className="grid grid-cols-12 md:mx-44">
                <div className="flex flex-col col-span-8 bg-slate-50 p-6 border-x-2 border-b-2 shadow-lg">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-semibold">WishList <span className="font-light text-xl">({user.data?.wishLists.length} items)</span></h2>
                        <button onClick={() => location.reload()} className="rounded-md font-bold text-sm py-1 px-2 bg-slate-300">Update Wishlist</button>
                    </div>
                    <p className="w-full border-y-1 py-1 pl-5 border-slate-300 mt-2 font-semibold">Est. delivery: Friday, April 19</p>
                    <div className="w-full flex flex-col gap-8">
                        {user.data?.wishLists.map((item: any, index: any) => (
                            <div key={index} className={`flex w-full gap-4 border-2 border-slate-300 ${index === 0 ? "rounded-b-xl" : "rounded-xl"}`}>
                                <GetWishlistItem quantity={item.quantity} itemId={item.productId} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-4 max-h-[350px] max-w-[400px] ml-6 mt-6 bg-slate-200  p-2 rounded-xl flex flex-col  ">
                    <div className="w-full flex px-4 flex-col gap-2">
                        <h2 className="text-2xl font-bold mr-">Order Summary</h2>
                        <div className="flex justify-between font-semibold">Subtotal: <div className="flex font-normal"><TotalCartPrice cartItems={user.data?.carts} />.00 $</div></div>
                        <p className="flex justify-between font-semibold">Shipping Fee: <span className="flex font-normal">Calculating at checkout</span></p>
                        <p className="flex justify-between font-semibold">Customs: <span className="flex font-normal">Calculating at checkout</span></p>
                    </div>
                    <Link
                        href={"#"}
                        className="px-auto flex items-center gap-2 justify-center text-center font-semibold mx-4 mt-2 py-2 bg-gradient-to-b from-yellow-400 to-yellow-500 hover:underline hover:to-yellow-500 hover:from-yellow-500 transition-colors rounded-md">
                        <LockClosedIcon width={20} /> Proceed To Checkout
                    </Link>
                    <div className="flex flex-col gap-1 mt-4 mx-4">
                        <p className="text-xl font-semibold">Discount Codes</p>
                        <p className="font-light">Enter your coupon code if you have one.</p>
                        <input type="text" className="outline-none px-2 rounded-lg py-1" />
                        <button
                            className="mx-auto w-1/2 hover:w-full px-2 py-1 text-lg mt-2 transition-all  rounded-lg bg-gradient-to-b from-yellow-400 to-yellow-500 hover:underline hover:to-yellow-500 hover:from-yellow-500">
                            Apply Discount
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col mt-12 gap-2 mb-12">
                <div className="flex w-full items-center mx">
                    <hr className=" ml-4 w-1/3"/>
                    <p className="mx-auto font-bold text-xl">Recommended for you...</p>
                    <hr className="mr-4 w-1/3"/>
                </div>
                {!products.isLoading ?
                <div className="w-full flex mx-auto">
                    <button 
                        className="m-auto bg-slate-200 px-4 py-2 font-semibold text-center ml-2 transition-all hover:bg-slate-300 text-xl rounded-full" 
                        onClick={scrollLeft}>{"<"}
                    </button>
                        <div 
                            style={{scrollBehavior: 'smooth', maxWidth: containerWidth as number}} 
                            ref={scrollRef} 
                            className="flex overflow-x-scroll no-scrollbar justify-center items-center py-4 gap-4 border-slate-300 ">
                            {products.data.products.map((product: any, index: any) => (
                                <div key={index} className="flex w-[300px] h-full p-2 border-2 rounded-xl ">
                                    <RecommendedProducts product={product} />
                                </div>
                            ))}
                        </div>
                        <button 
                            className="m-auto bg-slate-200 px-4 py-2 font-semibold text-center mr-2 transition-all hover:bg-slate-300 text-xl rounded-full" 
                            onClick={scrollRight}> {">"}
                        </button>
                </div>
                : null}
            </div>
            <Footer />
        </div>
    )
}