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



export default function ProductPage() {

    const queryClient = useQueryClient()

    const params = useParams();

    const [transitioning, setTransitioning] = useState(false);

    const [imageIndex, setImageIndex] = useState(0);

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const product = useQuery({
        queryKey: ['product', params.productId],
        queryFn: () => api.getProductById(params.productId as string)
    });

    const productData = {
        productId: params.productId as string,
        quantity: 1,
        price: product.data?.price
    };

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(productData),
        onSuccess: () => {
            toast.success("Updated wishlist successfully");
            user.refetch(); // Invalidate user query
        },
    });

    const prevImageIndex = () => {
        setTransitioning(true);
        setTimeout(() => {
            if (imageIndex === 0) {
                setImageIndex(product.data.images.length - 1);
            } else {
                setImageIndex(imageIndex - 1);
            }
            setTransitioning(false); // Deactivate transition after image change
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
            setTransitioning(false); // Deactivate transition after image change
        }, 300);
    };

    const handleAddToCart = useMutation({
        mutationFn: () => api.addToCart(productData),
        onSuccess: () => {
            toast.success("Updated cart successfully");
        }
    });

    const [ itemIsInWishlist, setItemIsInWishlist ] = useState(false);

    const checkWishList = (productId:number) => {
        if (user.data && user.data.wishLists) {
            const foundItem = user.data?.wishLists.find((item: any) => item.productId === productId as number);

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
        checkWishList(params.productId as any);
   },[user]);

    return (
        <PageStructure>
            {!product.isLoading &&
                <div className="w-full">
                    <div className="flex-col flex w-3/4 justify-center mx-auto ">
                        <button></button>
                        <div className="flex w-full justify-center gap-8">
                            {product.data.images.map((image: string, index: number) => (
                                <div key={index} className={`flex p-2 border-2  rounded-md ${index === imageIndex ? "border-yellow-500" : "border-slate-400"}`}>
                                    <button onClick={() => setImageIndex(index)}>
                                        <img src={image} className="size-16 object-cover" alt="product image" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col mt-4 w-full">
                            <div className=" w-3/4  rounded-xl mx-auto">
                                <div className="relative w-full max-h-[350px] z-1 ">
                                    <button onClick={prevImageIndex} className="absolute w-1/3 h-full rounded-md left-0 bottom-0  bg-slate-500 opacity-0 hover:opacity-25 transition-opacity"></button>
                                    <button onClick={nextImageIndex} className="absolute w-1/3 h-full rounded-md right-0 bottom-0  bg-slate-500 opacity-0 hover:opacity-25 transition-opacity"></button>
                                    <img src={product.data.images[imageIndex]} className={`w-full border-2 border-slate-300 max-h-[350px] rounded-xl object-cover ${transitioning ? 'transition-opacity duration-300 opacity-0' : ''}`} />
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:gap-12 mt-12    w-full">
                                    <button
                                        onClick={() => handleAddToCart.mutate()}
                                        className="flex ml-auto gap-2 hover:underline hover:bg-yellow-500 transition-colors w-full md:w-1/3 justify-center items-center rounded-md py-4 px-6 bg-yellow-400 text-xl">
                                        <ShoppingCartIcon width={25} />Add To Cart!
                                    </button>
                                    <button onClick={() => addToWishlist.mutate()}>{itemIsInWishlist ? <HeartIcon color="red" fill="red" width={30} /> : <HeartIcon width={30} />}</button>
                                    <button
                                        onClick={() => checkWishList(params.productId as any)}
                                        className="flex w-full md:w-1/3 hover:underline hover:bg-slate-800 transition-colors mr-auto justify-center items-center gap-2 text-white rounded-md py-4 px-6 bg-slate-700 text-xl">
                                        <BoltIcon width={25} /> Buy Now!
                                    </button>
                                </div>
                            </div>
                            <hr className="w-full mt-2" />
                            <div className="w-full flex flex-col">
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold">{product.data.brand}</p>
                                    <p className="font-bold text-xl">{product.data.title}</p>
                                    <p className="text-lg">{product.data.description}</p>
                                    <div className="flex gap-2">
                                        <StarRating rating={product.data.rating} />
                                        <p className="font-semibold">{product.data.rating} Rating</p>
                                    </div>
                                    <div className='flex mt-2'>
                                        <p>Price:</p>
                                        <p className='mr-1 font-semibold'>{Math.round(product.data?.price - (product.data?.price * (product.data?.discountPercentage / 100)))}$</p>
                                        <p className='line-through text-sm text-red-500'>{product.data.price}</p>
                                    </div>
                                    <p className="text-green-500 font-medium text-sm">Order now and get it before April 21st!</p>
                                </div>
                                <div className="flex mt-4 flex-col">
                                    <div className="flex items-center gap-1">Availability: {product.data.stock}<p>pcs in stock!</p><CheckIcon color="green" width={25} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </PageStructure>
    )
}