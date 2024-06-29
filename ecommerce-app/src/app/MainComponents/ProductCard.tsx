import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductCard = ({ product }: any) => {
    const queryClient = useQueryClient();

    const [ currentImageIndex, setCurrentImageIndex ] = useState(0);
    const [ transitioning, setTransitioning] = useState(false);

    const [ itemIsInWishlist, setItemIsInWishlist ] = useState(false);

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
    });

    const addToCart = useMutation({
        mutationFn: () => api.addToCart(wishListData),
    });

    const handleAddToCart = () => {
        addToCart.mutate();
        if (!toast.isActive(product.id as string)) {
            toast.success("Product added to cart!", {
                toastId: product.id as string
            });
        };
    };

    const handleAddToWishlist = () => {
        addToWishlist.mutate();
        if (itemIsInWishlist === false) {
            if (!toast.isActive(product.id)) {
                toast.success("Product added to wishlist!", {toastId: product.id})
            };
        } else {
            if (!toast.isActive(product.id)) {
                toast.success("Product removed to wishlist!", { toastId: product.id })
            };
        };
        setItemIsInWishlist(!itemIsInWishlist);
    };

    const checkWishList = (productId: string) => {
        if (user.data && user.data.wishLists) {
            const itemExists = user.data.wishLists.some((item: any) => {
                return item.productId === productId.toString();
            });
            setItemIsInWishlist(itemExists);
        } else {
            setItemIsInWishlist(false);
        };
    };

    useEffect(() => {
        checkWishList(product.id as string);
    }, [user.data]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="relative h-1/2 w-full">
                <Button variant="ghost" className="absolute bottom-14 text-xl left-2" onClick={(prevImage)}>&larr;</Button>
                <img
                    src={product.images[currentImageIndex]}
                    alt={`Image of ${product.title}`}
                    className={`object-cover h-full w-full ${transitioning ? "transition-opacity duration-300 opacity-0" : ""}`}
                />
                <Button variant="ghost" className="absolute bottom-14 text-xl right-2" onClick={nextImage}>&rarr;</Button>
            </div>
            <div className="h-1/2 w-full flex flex-col justify-between">
                <div className="flex items-end border-b justify-between">
                    <Button asChild variant="link">
                        <Link href={`/categorypage/${product.category}`}>
                            {product.brand}
                        </Link>
                    </Button>
                    <Button variant="link" onClick={handleAddToWishlist}>
                        {itemIsInWishlist ? (
                            <HeartIcon color="red" fill="red" width={25} />
                        ) : (
                            <HeartIcon width={25} />
                        )}
                    </Button>
                </div>
                <Button asChild variant="link" className="mr-auto text-md">
                    <Link
                        href={`/productpage/${product.id}`}>
                        {product.title}
                    </Link>
                </Button>
                <div className="flex justify-between pb-2 border-b items-center">
                    <div className="flex items-center mt-2">
                        <p className="mr-2">Price:</p>
                        <p className="font-semibold">{Math.round(product.price - product.price * (product.discountPercentage / 100))}$</p>
                        <p className="line-through text-sm text-red-500 ml-2">{product.price}</p>
                    </div>
                    <p className="text-sm">In stock: {product.stock}pcs</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <Button onClick={handleAddToCart} size="sm">Add to cart</Button>
                    <Button asChild size="sm">
                        <Link href={`/productpage/${product.id}`}>View product</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
