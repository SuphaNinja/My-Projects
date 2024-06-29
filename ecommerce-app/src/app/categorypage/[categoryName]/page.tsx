"use client";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PageStructure from "@/app/MainComponents/PageStructure";
import ProductCard from "../../MainComponents/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
    const params = useParams();

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ["category", params.categoryName],
        queryFn: () => api.getProductsByCategory(params.categoryName as string),
    });

    return (
        <PageStructure>
            <h2 className="ml-4 mt-2">
                Results for - <span className="font-semibold first-letter:uppercase">{params.categoryName as string}</span>
            </h2>
            <div className="md:mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 mt-6">
                {!productsLoading ? (
                    productsData?.products.map((product: any, index: any) => (
                        <div className="max-h-[400px] sm:border-x border-y p-6 sm:rounded-md" key={index}>
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="h-[350px] space-y-2">
                            <Skeleton className="h-1/2 w-[250px] rounded-xl" />
                            <div className="space-y-2 h-1/2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageStructure>
    );
}
