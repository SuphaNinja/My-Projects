"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function GetCartItem({ itemId, quantity }: any) {
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
    };

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(wishListData),
    });

    const handleAddToWishlist = () => {
        addToWishlist.mutate();
        if (itemIsInWishlist === false) {
            if (!toast.isActive(itemId)) {
                toast.success("Product added to wishlist!", { toastId: itemId })
            };
        } else {
            if (!toast.isActive(itemId)) {
                toast.success("Product removed to wishlist!", { toastId: itemId })
            };
        };
        setItemIsInWishlist(!itemIsInWishlist);
    };

    const deleteCartItem = useMutation({
        mutationFn: () => api.deleteCartItem(itemId.toString())
    });

    const handleDeleteCartItem = () => {
        deleteCartItem.mutate();
        setTimeout(() => {
            user.refetch();
        }, 50);
        if (!toast.isActive(itemId)) {
            toast.success("Item has been deleted from cart!", {
                toastId: itemId
            });
        };
    };

    const productData = {
        productId: itemId as string,
        quantity: newQuantity,
        price: product.data?.price
    };
    
    const addToCart = useMutation({
        mutationFn: () => api.addToCart(productData), 
    });

    const updateQuantity = (e: any) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value < 1) {
            setNewQuantity(1); 
            toast.error("Cannot add less than 1 quantity to cart")
            addToCart.mutate();
        } else {
            setNewQuantity(value); 
            addToCart.mutate();
        }
    };

    const checkWishList = (productId: string) => {
        if (user.data && productId) {
            const itemExists = user.data.wishLists.some((item: any) => {
                return item.productId === productId.toString();
            });
            setItemIsInWishlist(itemExists);
        } else {
            setItemIsInWishlist(false);
        };
    };

   useEffect(() => {
       checkWishList(itemId as string);
   },[]);

    return (
        <div className="w-full">
            {!product.isLoading && (
                <div className="md:grid flex flex-col md:max-h-[300px] w-full grid-cols-6 p-8 gap-4">
                    <div className="h-full col-span-1">
                        <img src={product.data?.thumbnail} alt="product image" className="w-full md:size-24 rounded-md object-cover" />
                    </div>
                    <div className="h-full flex flex-col justify-between col-span-4">
                        <h3 className="text-xl font-bold">{product.data?.brand}</h3>
                        <p className="text-xl font-semibold">{product.data?.title}</p>
                        <button
                            onClick={handleAddToWishlist}>
                            {itemIsInWishlist ? <HeartIcon color="red" fill="red" width={30} /> : <HeartIcon width={30} />}
                        </button>
                    </div>
                    <div className="h-full flex flex-col col-span-1">
                        <div className="font-semibold flex flex-col gap-1">
                            <p>Total Price:</p>
                            <p>{Math.round((product.data?.price - (product.data?.price * (product.data?.discountPercentage / 100))) * newQuantity)}$
                                <span className="text-tiny text-red-500 ml-2 line-through">{Math.round(product.data?.price * newQuantity)}</span>
                            </p> 
                        </div>
                        <Input
                            type="number"
                            onChange={(e) => updateQuantity(e)}
                            value={newQuantity}
                        />  
                        <Button 
                            variant="destructive" 
                            className="mt-2" 
                            onClick={handleDeleteCartItem}
                            >
                            Remove
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )


}