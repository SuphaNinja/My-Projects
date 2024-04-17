"use client"

import { Checkbox } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

export default function SideBar() {

    const [searchProduct, setSearchProduct] = useState("");

    const categories = useQuery({
        queryKey: ["categories"],
        queryFn: api.getAllCategories,  // Fetch all categories
    });

    const searchResults = useQuery({
        queryKey: ["products", searchProduct],
        queryFn: async () => {
            const data = await api.searchProducts(searchProduct); // Search for products
            return data;
        },
    });

    return (
        <div className="flex sticky top-0 flex-col col-span-3 h-full text-black bg-slate-300">
            <div className="p-4 mx-12 bg-blue-500/20 mt-12 rounded-lg">
                <h2 className="text-2xl font-semibold">Delivery</h2>
                <Checkbox><p className="text-black text-xl font-medium">Express delivery</p></Checkbox>
                <p className="text-tiny ">Delivery time may vary depending on store and country.</p>
            </div>
            <div className="mt-12 flex flex-col md:mx-12">
                <h2 className="text-2xl font-semibold text-center mb-2">Search Product</h2>
                <div className="flex items-center bg-slate-200 rounded-full w-full border-2 border-slate-400 overflow-hidden">
                    <div className="items-center flex w-1/12 justify-center">
                        <button><MagnifyingGlassIcon width={25} /></button>
                    </div>
                    <input
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        type="text" placeholder="Search by product name"
                        className="w-11/12 text-tiny bg-slate-200 outline-none pl-2 border-l-1 border-slate-400"
                    />
                </div>
                <div className={`$flex flex-col overflow-y-scroll scrollbar-thin max-h-[300px] border-2 border-slate-400 rounded-md mt-4 p-4 gap-1`}>
                    {searchResults.data?.products.length === 0 && <p>No Products found.</p>}
                    {!searchResults.isLoading && (
                        searchResults.data.products.map((product: any, index: any) => (
                            <div key={index}>
                                <Link
                                    className="hover:underline text-sm font-medium"
                                    href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.id}>
                                    {product.title}
                                </Link>
                            </div>
                        )))}
                </div>
            </div>
            <div className="mt-4 md:mx-12">
                <h2 className="text-center font-semibold text-2xl underline">Categories</h2>
                <div className="flex flex-col gap-2 mt-4 overflow-y-scroll max-h-[400px] mb-2 scrollbar-thin border-2 border-slate-400 p-3 rounded-md">

                    {!categories.isLoading && categories.data?.map((category: any, index: any) => (
                        <div key={index} className="">
                            <Link href={process.env.NEXT_PUBLIC_URL + "/categorypage/" + category}><p className="first-letter:uppercase font-medium hover:underline">{category}</p></Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}