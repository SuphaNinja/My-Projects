import React, { useState } from 'react';

import StarRating from '@/app/categorypage/StarRating';
import Link from 'next/link';

const RecommendedProducts = ({ product }: any) => {
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
    if (product !== undefined && product !== null){
    return (
        <div className='md:h-[300px] md:w-[260px] flex flex-col'>
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
            <div className='flex flex-col justify-between h-1/2 w-full item'>
                <div className='flex flex-col gap-2 mt-2 '>
                    <div className='flex justify-between'>
                        <p className='ml-2 first-letter:uppercase font-medium'>{product.brand}</p>
                        <StarRating rating={product.rating} />
                    </div>
                    <hr/>
                    <p className='text-center first-letter:uppercase text-lg font-semibold'>{product.title}</p>
                </div>
                <Link 
                    className='text-center mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-300 rounded-xl' 
                    href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.id}>View Product</Link>
            </div>
        </div>
    )};
};

export default RecommendedProducts;
