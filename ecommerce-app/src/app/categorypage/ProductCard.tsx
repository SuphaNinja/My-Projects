import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";

const ProductCard = ({ product }: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const prevImage = () => {
        setTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex((currentImageIndex + product.images.length - 1) % product.images.length);
            setTransitioning(false);
        }, 300);
    };

    const nextImage = () => {
        setTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
            setTransitioning(false);
        }, 300);
    };

    const [itemIsInWishlist, setItemIsInWishlist] = useState(false);

    const user = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

    const wishListData = {
        productId: product.id.toString(),
        quantity: 1,
        price: product.price,
    };

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(wishListData),
        onSuccess: () => {
            toast.success("Updated wishlist successfully");
            user.refetch();
        },
    });

    const checkWishList = (productId: number) => {
        if (user.data && user.data.wishLists) {
            setItemIsInWishlist(user.data.wishLists.some((item: any) => item.productId === productId));
        }
    };

    useEffect(() => {
        checkWishList(product.id);
    }, [user]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="relative h-1/2 w-full">
                <button
                    className="flex items-center absolute bg-slate-950/20 text-2xl font-extrabold rounded-xl hover:bg-slate-950 transition-colors px-2 pb-1 text-center text-white bottom-14 left-2"
                    onClick={prevImage}
                >
                    &larr;
                </button>
                <img
                    src={product.images[currentImageIndex]}
                    alt={`Image of ${product.title}`}
                    className={`object-cover rounded-xl h-full w-full ${transitioning ? "transition-opacity duration-300 opacity-0" : ""}`}
                />
                <button
                    className="flex items-center absolute bg-slate-950/20 text-2xl font-extrabold rounded-xl hover:bg-slate-950 transition-colors px-2 pb-1 text-center text-white bottom-14 right-2"
                    onClick={nextImage}
                >
                    &rarr;
                </button>
            </div>
            <div className="h-1/2 w-full flex flex-col justify-between mt-2">
                <div className="flex justify-between">
                    <p className="text-sm font-medium">{product.brand}</p>
                    <button onClick={() => addToWishlist.mutate()}>
                        {itemIsInWishlist ? (
                            <div className="flex items-center">
                                <p className="text-tiny font-semibold hover:underline">Remove from Wishlist</p>
                                <HeartIcon color="red" fill="red" width={25} />
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <p className="text-tiny font-semibold hover:underline">Add To Wishlist</p>
                                <HeartIcon width={25} />
                            </div>
                        )}
                    </button>
                </div>
                <hr className="w-full my-1" />
                <div className="flex justify-between">
                    <p className="text-lg font-semibold">{product.title}</p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center mt-2">
                        <p className="mr-2">Price:</p>
                        <p className="font-semibold">{Math.round(product.price - product.price * (product.discountPercentage / 100))}$</p>
                        <p className="line-through text-sm text-red-500 ml-2">{product.price}</p>
                    </div>
                    <p className="text-sm">In stock: {product.stock}pcs</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
