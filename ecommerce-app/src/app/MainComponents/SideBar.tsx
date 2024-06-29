"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SideBar() {
    const [ searchProduct, setSearchProduct ] = useState("");

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: api.getAllCategories,
    });

    const { data: searchResultsData, isLoading: searchResultsLoading } = useQuery({
        queryKey: ["products", searchProduct],
        queryFn: async () => {
            const data = await api.searchProducts(searchProduct);
            return data;
        },
        enabled: !!searchProduct
    });

    return (
        <div className="flex flex-col lg:h-full h-screen border-r p-2 md:p-4">
            <div className="rounded-lg border p-4 mt-4">
                <h2 className="text-2xl font-semibold">Delivery</h2>
                <div className="flex items-center gap-2">
                    <Checkbox/>
                    <p className="text-xl font-medium">Express delivery</p>
                </div>
                <p className="text-tiny">Delivery time may vary depending on store and country.</p>
            </div>
            <div className="mt-4 lg:mt-8 flex flex-col">
                <h2 className="text-center text-xl mb-2">Search Product</h2>
                <Input
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    type="text"
                    placeholder="Search by product name"
                />
                <div className="flex flex-col overflow-y-auto no-scrollbar h-[300px] border rounded-md mt-2 p-2">
                    {searchResultsLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    ) : (
                        searchResultsData?.products.length === 0 ? (
                            <p className="text-center">No Products found.</p>
                        ) : (
                            searchResultsData?.products?.map((product: any, index: any) => (
                                <div key={index}>
                                    <Button asChild variant="link" className="text-xs font-semibold">
                                        <Link
                                            href={`/productpage/${product.id}`}>
                                            {product.title}
                                        </Link>
                                    </Button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
            <div className="mt-4 lg:mt-8">
                <h2 className="text-center text-xl">Categories</h2>
                <div className="flex flex-col gap mt-2 overflow-y-scroll max-h-[300px] no-scrollbar border p-2 rounded-md">
                    {categoriesLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    ) : (
                    categoriesData?.map((category: any, index: any) => (
                        <div key={index}>
                            <Button asChild variant="link" className="text-xs font-semibold first-letter:uppercase">
                                <Link href={`/categorypage/${category.slug}`}>
                                {category.name}
                                </Link>
                            </Button>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    );
}
