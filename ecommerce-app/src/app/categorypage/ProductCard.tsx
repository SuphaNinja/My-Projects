import React, { useEffect, useState } from 'react';

import StarRating from './StarRating';
import Link from 'next/link';
import api from '@/lib/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { HeartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const prevImage = () => {
        setTransitioning(true);
        setTimeout(() => {
            if (currentImageIndex === 0) {
                setCurrentImageIndex(product.images.length - 1);
            } else {
                setCurrentImageIndex(currentImageIndex - 1);
            }
            setTransitioning(false); // Deactivate transition after image change
        }, 300);
    };

    const nextImage = () => {
        setTransitioning(true);
        setTimeout(() => {
            if (currentImageIndex === product.images.length - 1) {
                setCurrentImageIndex(0);
            } else {
                setCurrentImageIndex(currentImageIndex + 1);
            }
            setTransitioning(false); // Deactivate transition after image change
        }, 300);
    };

    const [itemIsInWishlist, setItemIsInWishlist] = useState(false);

    const user = useQuery({
        queryKey: ['user'],
        queryFn: () => api.getCurrentUser(),
    });

    const wishListData = {
        productId: product.id.toString(),
        quantity: 1,
        price: product.price
    }

    const addToWishlist = useMutation({
        mutationFn: () => api.addToWishlist(wishListData),
        onSuccess: () => {
            toast.success("Updated wishlist successfully");
            user.refetch(); // Invalidate user query
        },
    });

    const checkWishList = (productId: number) => {
        if (user.data && user.data.wishLists) {
            const foundItem = user.data?.wishLists.find((item: any) => item.productId == productId);

            if (foundItem !== undefined && foundItem !== null) {
                setItemIsInWishlist(true)
            } else {
                setItemIsInWishlist(false)
            }
        } else {
            console.log("error with setting itemIsInWishlist", itemIsInWishlist)
        }
    }
    useEffect(() => {
        checkWishList(product.id as number)
    }, [user]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className='relative h-1/2 w-full items-center'>
                <button
                    className='flex items-center absolute bg-slate-950/20 text-2xl font-extrabold rounded-xl hover:bg-slate-950 transition-colors px-2 pb-1 text-center text-white bottom-14 left-2 '
                    onClick={prevImage}>
                    &larr;
                </button>
                <img
                    src={product.images[currentImageIndex]}
                    alt={`Image of ${product.title}`}
                    className={`object-cover rounded-xl h-full w-full ${transitioning ? 'transition-opacity duration-300 opacity-0' : ''}`}
                />
                <button
                    className='flex items-center absolute bg-slate-950/20 text-2xl font-extrabold rounded-xl hover:bg-slate-950 transition-colors px-2 pb-1 text-center text-white bottom-14 right-2'
                    onClick={nextImage}>
                    &rarr;
                </button>
            </div>
            <div className='h-1/2 w-full'>
                <div className='flex w-full h-1/6 mt-2 justify-between'>
                    <p className='text-tiny'><span className='text-sm font-medium'>{product.brand}</span></p>
                        
                </div>
                <hr className='w-full my-1' />
                <div className='flex flex-col justify-between h-5/6 w-full'>
                    <div className='w-full justify-between flex'>
                        <p className='text-lg font-semibold text-balance'>{product.title}</p>
                        <button
                            onClick={() => addToWishlist.mutate()}>
                            {itemIsInWishlist ? 
                                <div className='flex items-center'>
                                    <p className='text-tiny font-semibold hover:underline'>Remove from Wishlist</p>
                                    <HeartIcon color="red" fill="red" width={25} />
                                </div> 
                                : 
                                <div className='flex items-center'>
                                    <p className='text-tiny font-semibold hover:underline'>Add To Wishlist</p>
                                    <HeartIcon width={25} />
                                </div> 
                            }
                        </button>
                    </div>
                    
                    <div className='flex flex-col md:flex-row justify-between items-center '>
                        <div className='flex mt-2'>
                            <p>Price:</p>
                            <p className='mr-1 font-semibold'>{Math.round(product.price - (product.price * (product.discountPercentage / 100)))}$</p>
                            <p className='line-through text-sm text-red-500'>{product.price}</p>
                        </div>
                        <p className='text-sm'>In stock: {product.stock}pcs</p>
                    </div>
                    <Link
                        href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.id}
                        className='w-full mb-2 text-center hover:underline font-semibold rounded-md px-4 py-2 bg-gradient-to-b from-slate-400 to-slate-300 hover:from-slate-500 hover:to-slate-300 transition-colors'>
                        View Product
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
