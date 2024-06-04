"use client";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PageStructure from "@/app/MainComponents/PageStructure";
import ProductCard from "../ProductCard";

export default function Page() {
    const params = useParams();

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ["category", params.categoryName],
        queryFn: () => api.getProductsByCategory(params.categoryName as string),
    });

    return (
        <PageStructure>
            <button onClick={() => console.log(productsData)}>test</button>
            <h2 className="ml-4 mt-2">
                Results for - <span className="font-semibold first-letter:uppercase">{params.categoryName as string}</span>
            </h2>
            <hr className="mb-2" />
            {!productsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
                    {productsData?.products.map((product: any, index: any) => (
                        <div className="bg-slate-50 border-2 border-slate-300 p-6 rounded-xl overflow-hidden" key={index}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </PageStructure>
    );
}
