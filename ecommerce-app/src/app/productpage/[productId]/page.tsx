"use client"
import PageStructure from "@/app/MainComponents/PageStructure";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";
import { BoltIcon } from "@heroicons/react/16/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import StarRating from "@/app/categorypage/StarRating";
import { CheckIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";



export default function ProductPage() {
    const queryClient = useQueryClient();
    const params = useParams();
    
    const [ transitioning, setTransitioning ] = useState(false);
    const [ imageIndex, setImageIndex ] = useState(0);
    const [ itemIsInWishlist, setItemIsInWishlist ] = useState(false);
    
    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const product = useQuery({
        queryKey: ['product', params.productId],
        queryFn: () => api.getProductById(params.productId as string)
    });

    const productData = {
        productId: params.productId.toString(),
        quantity: 1,
        price: product.data?.price
    };
    
    const addToCart = useMutation({
        mutationFn: () => api.addToCart(productData),
    });

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(productData),
    });

    const prevImageIndex = () => {
        setTransitioning(true);
        setTimeout(() => {
            if (imageIndex === 0) {
                setImageIndex(product.data.images.length - 1);
            } else {
                setImageIndex(imageIndex - 1);
            };
            setTransitioning(false);
        }, 300);
    };

    const nextImageIndex = () => {
        setTransitioning(true);
        setTimeout(() => {
            if (imageIndex === product.data.images.length - 1) {
                setImageIndex(0);
            } else {
                setImageIndex(imageIndex + 1);
            }
            setTransitioning(false);
        }, 300);
    };

    const handleAddToCart = () => {
        addToCart.mutate();
        if (!toast.isActive(params.productId as string)) {
            toast.success("Product added to cart!", {
                toastId: params.productId as string
            });
        };
    };

    const handleAddToWishlist = () => {
        addToWishlist.mutate();
        if (itemIsInWishlist === false) {
            if (!toast.isActive(params.productId as string)) {
                toast.success("Product added to wishlist!", { toastId: params.productId as string })
            };
        } else {
            if (!toast.isActive(params.productId as string)) {
                toast.success("Product removed to wishlist!", { toastId: params.productId as string })
            };
        };
        setItemIsInWishlist(!itemIsInWishlist);
    };
    
    const checkWishList = (productId: string) => {
        if (user.data && user.data.wishLists) {
            const itemExists = user.data.wishLists.some((item: any) => {
                return item.productId === productId;
            });
            setItemIsInWishlist(itemExists);
        } else {
            setItemIsInWishlist(false);
        };
    };

   useEffect(() => {
        checkWishList(params.productId as string);
   },[user.data]);
   
    return (
        <PageStructure>
            <div className="w-full">
                <div className="flex-col lg:mt-4 md:mt-24 mt-12 flex lg:w-3/4 justify-center lg:mx-auto">
                    {product.isLoading && (
                        <div className="flex flex-col mt-12 w-full h-full space-y-3">
                            <Skeleton className="h-[500px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    )}
                    {product.data && (
                        <div>
                            <div className="flex w-full justify-center gap-8">
                                {product.data?.images?.map((image: string, index: number) => (
                                    <div key={index} className={`flex p-2 border rounded-md ${index === imageIndex && "border-emerald-500"}`}>
                                        <button onClick={() => setImageIndex(index)}>
                                            <img src={image} className="sm:size-16 size-12 object-cover" alt="product image" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col mt-4 w-full">
                                <div className="sm:w-3/4 w-full mx-auto">
                                    <div className="relative w-full max-h-[350px] z-1">
                                        <button onClick={prevImageIndex} className="absolute w-1/3 h-full rounded-md left-0 bottom-0 bg-slate-500 opacity-0 hover:opacity-25 transition-opacity"></button>
                                        <button onClick={nextImageIndex} className="absolute w-1/3 h-full rounded-md right-0 bottom-0 bg-slate-500 opacity-0 hover:opacity-25 transition-opacity"></button>
                                        <img src={product.data.images[imageIndex]} className={`w-full sm:border max-h-[350px] sm:p-8 sm:rounded-xl object-cover ${transitioning && 'transition-opacity duration-300 opacity-0'}`} />
                                    </div>
                                    <div className="flex items-center border-b pb-4 justify-evenly sm:gap-12 mt-6 sm:mt-12 w-full">
                                        <Button onClick={handleAddToCart}>
                                            <ShoppingCartIcon width={25} />Add To Cart!
                                        </Button>
                                        <Button variant="link" onClick={handleAddToWishlist}>
                                            {itemIsInWishlist ? <HeartIcon color="red" fill="red" width={30} /> : <HeartIcon width={30} />}
                                        </Button>
                                        <Button onClick={() => checkWishList(params.productId as any)}>
                                            <BoltIcon width={25} /> Buy Now!
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col py-6 mx-12 md:mx-24 gap-2">
                                    <p className="text-center">{product.data?.brand}</p>
                                    <p className="text-xl text-center">{product.data?.title}</p>
                                    <p className="text-pretty mx-auto sm:w-1/2">{product.data?.description}</p>
                                    <div className="flex mt-4 gap-2">
                                        <StarRating rating={product.data?.rating} />
                                        <p className="font-semibold">{product.data.rating} Rating</p>
                                    </div>
                                    <div className='flex gap-1 mt-2'>
                                        <p>Price:</p>
                                        <p className='mr-1 font-semibold'>{Math.round(product.data?.price - (product.data?.price * (product.data?.discountPercentage / 100)))}$</p>
                                        <p className='line-through text-sm text-red-500'>{product.data.price}</p>
                                        <p className="text-green-500 ml-auto font-medium text-sm">Order now and get it before April 21st!</p>
                                    </div>
                                    <div className="flex mt-4 flex-col">
                                        <div className="flex items-center gap-1">Availability: {product.data.stock}<p>pcs in stock!</p><CheckIcon color="green" width={25} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageStructure>
    )
}