"use client";

import { Checkbox } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

export default function SideBar() {
    const [searchProduct, setSearchProduct] = useState("");

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: api.getAllCategories,  // Fetch all categories
    });

    const { data: searchResultsData, isLoading: searchResultsLoading } = useQuery({
        queryKey: ["products", searchProduct],
        queryFn: async () => {
            const data = await api.searchProducts(searchProduct); // Search for products
            return data;
        },
        enabled: !!searchProduct // Only fetch when searchProduct is not empty
    });

    return (
        <div className="flex flex-col lg:h-full h-screen text-black bg-slate-300 p-4 lg:p-6">
            <div className="bg-blue-500/20 rounded-lg p-4 mt-4 lg:mt-12">
                <h2 className="text-2xl font-semibold">Delivery</h2>
                <Checkbox>
                    <p className="text-black text-xl font-medium">Express delivery</p>
                </Checkbox>
                <p className="text-tiny">Delivery time may vary depending on store and country.</p>
            </div>
            <div className="mt-4 lg:mt-12 flex flex-col">
                <h2 className="text-2xl font-semibold text-center mb-2">Search Product</h2>
                <div className="flex items-center bg-slate-200 rounded-full w-full border-2 border-slate-400 overflow-hidden">
                    <div className="items-center flex w-1/12 justify-center">
                        <button><MagnifyingGlassIcon width={25} /></button>
                    </div>
                    <input
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        type="text"
                        placeholder="Search by product name"
                        className="w-11/12 text-tiny bg-slate-200 outline-none pl-2 border-l-1 border-slate-400"
                    />
                </div>
                <div className="flex flex-col overflow-y-scroll scrollbar-thin max-h-[300px] border-2 border-slate-400 rounded-md mt-4 p-4 gap-1">
                    {searchResultsLoading ? (
                        <p>Loading...</p>
                    ) : (
                        searchResultsData?.products.length === 0 ? (
                            <p>No Products found.</p>
                        ) : (
                            searchResultsData?.products?.map((product: any, index: any) => (
                                <div key={index}>
                                    <Link
                                        className="hover:underline text-sm font-medium"
                                        href={`/productpage/${product.id}`}>
                                        {product.title}
                                    </Link>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
            <div className="mt-4 lg:mt-12">
                <h2 className="text-center font-semibold text-2xl underline">Categories</h2>
                <div className="flex flex-col gap-2 mt-4 overflow-y-scroll max-h-[400px] mb-2 scrollbar-thin border-2 border-slate-400 p-3 rounded-md">
                    {categoriesLoading ? (
                        <p>Loading...</p>
                    ) : (
                        categoriesData?.map((category: any, index: any) => (
                            <div key={index}>
                                <Link href={`/categorypage/${category.slug}`}>
                                    <p className="first-letter:uppercase font-medium hover:underline">{category.name}</p>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
