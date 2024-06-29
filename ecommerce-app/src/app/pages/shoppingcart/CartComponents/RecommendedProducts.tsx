import React, { useState } from 'react';
import StarRating from '@/app/categorypage/StarRating';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

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
            setTransitioning(false);
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
            setTransitioning(false);
        }, 300);
    };
    if (product !== undefined && product !== null){
    return (
        <Card className='md:h-[300px] md:w-[260px] flex flex-col'>
            <CardContent className='relative h-1/2 w-full items-center'>
                <Button variant="ghost" size="sm"
                    className='flex items-center absolute text-2xl text-center bottom-14 left-2 '
                    onClick={prevImage}>
                    &larr;
                </Button>
                <img
                    src={product.images[currentImageIndex]}
                    alt={`Image of ${product.title}`}
                    className={`object-cover rounded-xl h-full w-full ${transitioning ? 'transition-opacity duration-300 opacity-0' : ''}`}
                />
                <Button variant="ghost" size="sm"
                    className='flex items-center absolute text-2xl text-center bottom-14 right-2'
                    onClick={nextImage}>
                    &rarr;
                </Button>
            </CardContent>
            <CardContent className='flex flex-col justify-between h-1/2 w-full item'>
                <div className='flex flex-col gap-2 mt-2 '>
                    <div className='flex justify-between'>
                        <p className='ml-2 first-letter:uppercase font-medium'>{product.brand}</p>
                        <StarRating rating={product.rating} />
                    </div>
                    <p className='text-center first-letter:uppercase text-lg font-semibold'>{product.title}</p>
                </div>
                <Button asChild>
                    <Link href={process.env.NEXT_PUBLIC_URL + "/productpage/" + product.id}>View Product</Link>
                </Button>
            </CardContent>
        </Card>
    )};
};

export default RecommendedProducts;
