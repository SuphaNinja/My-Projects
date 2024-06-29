"use client";
import PageStructure from "./MainComponents/PageStructure";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import ProductCard from "./MainComponents/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchProduct, setSearchProduct] = useState("");

  const searchResults = useQuery({
    queryKey: ["products", searchProduct],
    queryFn: async () => {
      const data = await api.searchProducts(searchProduct);
      return data;
    },
  });

  return (
    <PageStructure>
      <div className="flex flex-col w-full">
        <h1 className="text-center text-xl md:text-4xl md:mt-4 mt-12">Welcome to ElectroBuy</h1>
        <div className="md:mx-auto items-center rounded-full border flex md:w-1/3 mt-4 px-4">
          <Input
            className="border-none focus-visible:ring-offset-0 focus-visible:ring-none focus-visible:ring-0"
            type="text"
            placeholder="Search for products"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <MagnifyingGlassIcon width={50} />
        </div>
        <hr className="w-full m-2" />
        <div className="md:mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 mt-6">
          {!searchResults.isLoading ? (
            searchResults.data.products.map((product: any, index: any) => (
              <div key={index} className="max-h-[400px] sm:border-x border-y p-6 sm:rounded-md">
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
      </div>
    </PageStructure>
  );
}
