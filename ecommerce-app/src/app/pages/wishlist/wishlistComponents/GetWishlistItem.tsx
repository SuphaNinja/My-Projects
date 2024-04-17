"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";


export default function GetWishlistItem({ itemId, quantity }: any) {


    const [lastSuccessTime, setLastSuccessTime] = useState(0);

    const queryClient = useQueryClient();

    const [newQuantity, setNewQuantity] = useState(quantity);

    const [ itemIsInWishlist, setItemIsInWishlist ] = useState(false);

    const product = useQuery({
        queryKey: ['product', itemId],
        queryFn: () => api.getProductById(itemId as string),
        enabled: !!itemId,
    });

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const wishListData = {
        productId: itemId as string,
        quantity: 1,
        price: product.data?.price
    }

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(wishListData),
        onSuccess: () => {
            toast.warn("Deleted Item From WishList!",{theme:"dark"});
            user.refetch(); // Invalidate user query
        },
    });

    const productData = {
        productId: itemId as string,
        quantity: 1,
        price: product.data?.price
    }

    const checkWishList = (productId:number) => {
        if (user.data && user.data.wishLists) {
            const foundItem = user.data?.wishLists.find((item: any) => item.productId == productId);

            if (foundItem !== undefined && foundItem !== null ) {
                setItemIsInWishlist(true)
            } else {
                setItemIsInWishlist(false)
            }    
        } else {
            console.log("error with setting itemIsInWishlist", itemIsInWishlist)
        }
    }
   useEffect(() => {
        checkWishList(product.data?.id as number)
   },[user]);


    return (
        <div>
            {!product.isLoading && (
                <div className="grid max-h-[300px] w-full grid-cols-6 p-8 gap-4">
                    <Link href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.data?.id}>
                        <div className="h-full col-span-1">
                            <img src={product.data?.thumbnail} alt="product image" className="w-24 h-24 hover:brightness-75 transition-all rounded-md object-cover" />
                        </div>
                    </Link>
                    <div className="h-full flex flex-col justify-between col-span-4">
                        <Link href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.data?.id}>
                            <h3 className="text-xl hover:underline transition-all font-bold">{product.data?.brand}</h3>
                            <p className="text-xl hover:underline transition-all font-semibold">{product.data?.title}</p>
                        </Link>
                        <button 
                            onClick={() => addToWishlist.mutate()}>
                            {itemIsInWishlist &&
                                <div className="flex gap-2">
                                    <HeartIcon color="red" fill="red" width={30} />
                                    <p className="text-slate-950 text-lg hover:underline transition-all hover:text-red-600 hover:font-semibold">Remove from wishlist!</p>
                                </div> 
                            }
                        </button>
                    </div>
                   
                </div>
            )}
        </div>
    )


}