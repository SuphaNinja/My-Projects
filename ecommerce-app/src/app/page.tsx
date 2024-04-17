"use client";
import PageStructure from "./MainComponents/PageStructure";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import ProductCard from "./categorypage/ProductCard";


export default function Home() {

  const [searchProduct, setSearchProduct] = useState("");

  const searchResults = useQuery({
    queryKey: ["products", searchProduct],
    queryFn: async () => {
      const data = await api.searchProducts(searchProduct); // Search for products
      return data;
    },
  });


  return (
    <PageStructure>
      <div className="flex flex-col w-full">
        <h1 className="text-center text-4xl mt-4 font-semibold">Welcome to ElectroBuy</h1>
        <div className="mx-auto bg-slate-200 overflow-hidden rounded-full border-2 border-slate-300 flex w-1/2 mt-4">
          <input
            className="outline-none w-11/12 px-4 bg-slate-200"
            type="text"
            placeholder="Search for products"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
          <MagnifyingGlassIcon width={50} />
        </div>
        <hr className="w-full mt-2" />
        <div className="mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 mt-6 ">
          {!searchResults.isLoading && (
            searchResults.data.products.map((product: any, index: any) => (
              <div key={index} className="max-h-[350px] bg-slate-300 px-4 pb-6 py-2 rounded-xl">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </PageStructure>
  );
}
