"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function GetCartItem({ itemId, quantity }: any) {


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
            toast.success("Updated wishlist successfully");
            user.refetch(); // Invalidate user query
        },
    });


    const deleteCartItem = useMutation({
        mutationFn: () => api.deleteCartItem(itemId.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success("Item removed from cart");
        }
    });
    const productData = {
        productId: itemId as string,
        quantity: newQuantity,
        price: product.data?.price
    }

    const updateQuantity = (e: any) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value < 1) { // Check if it's a valid number
            setNewQuantity(1); // Update state with the entered value if >= 0
            toast.error("Cannot add less than 1 quantity to cart")
            handleAddToCart.mutate();
        } else {
            setNewQuantity(value); // Update state with the entered value if >= 0
            handleAddToCart.mutate();
        }
    }

    const handleAddToCart = useMutation({
        mutationFn: () => api.addToCart(productData),
        onSuccess: () => {
            const currentTime = new Date().getTime();
            if (!lastSuccessTime || (currentTime - lastSuccessTime) > 5000) {
                // If more than 5 seconds have passed since the last success, show toast
                toast.success(`Updated cart successfully`);
                setLastSuccessTime(currentTime);
            }
        }
    });

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
                    <div className="h-full col-span-1">
                        <img src={product.data?.thumbnail} alt="product image" className="w-24 h-24 rounded-md object-cover" />
                    </div>
                    <div className="h-full flex flex-col justify-between col-span-4">
                        <h3 className="text-xl font-bold">{product.data?.brand}</h3>
                        <p className="text-xl font-semibold">{product.data?.title}</p>
                        <button
                            onClick={() => addToWishlist.mutate()}>
                            {itemIsInWishlist ? <HeartIcon color="red" fill="red" width={30} /> : <HeartIcon width={30} />}
                        </button>
                    </div>
                    <div className="h-full flex flex-col justify-between items-center col-span-1">
                        <p className="font-semibold ">
                            <span className="text-nowrap">Total Price:</span> {Math.round((product.data?.price - (product.data?.price * (product.data?.discountPercentage / 100))) * newQuantity)}$ 
                            <span className="text-tiny text-red-500 line-through">{product.data?.price * newQuantity}</span>
                        </p>
                        <input
                            type="number"
                            onChange={(e) => updateQuantity(e)}
                            value={newQuantity}
                            className="w-2/3 no-scrollbar border-2 border-slate-300 rounded-md"
                        />  
                        <button onClick={() => deleteCartItem.mutate(itemId)} className="rounded-md font-bold py-1 px-2 hover:text-red-500 transition-all w-full hover:underline bg-slate-300">Remove</button>
                    </div>
                </div>
            )}
        </div>
    )


}