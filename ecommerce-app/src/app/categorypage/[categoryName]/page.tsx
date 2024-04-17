"use client"
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PageStructure from "@/app/MainComponents/PageStructure";
import { useState } from "react";
import { count } from "console";
import ProductCard from "../ProductCard";


export default function Page() {



    const params = useParams();

    const products = useQuery({
        queryKey: ["category", params.categoryName],
        queryFn: () => api.getProductsByCategory(params.categoryName as string),
    });

    return (
        <PageStructure>
            <button onClick={() => console.log(products)}>test</button>
            <h2 className="ml-4 mt-2">Results for - <span className="font-semibold first-letter:uppercase">{params.categoryName as string}</span></h2>
            <hr className="mb-2" />
            {!products.isLoading &&
                <div className="grid grid-cols-1 md:grid-cols-3 md:h-[700px] w-full gap-6 md:px-24">
                    {products.data?.products.map((product: any, index: any) => (
                        <div className="bg-slate-50 border-2 border-slate-300 p-6 h-full w-full rounded-xl overflow-hidden" key={index}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            }
        </PageStructure>
    )
}