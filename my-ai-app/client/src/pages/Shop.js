import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Skeleton } from "src/components/ui/skeleton";
import { Button } from "src/components/ui/button";

export default function Shop () {
    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = currentUser?.data?.data?.success;

    const allProducts = useQuery({
        queryKey: ["allProducts"],
        queryFn: () => axiosInstance.get("/get-all-products")
    });

    const products = allProducts?.data?.data;

    if (allProducts.isLoading) {
        return (
            <div className="flex flex-wrap items-center justify-center space-y-3 space-x-3">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-[300px] w-[400px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[400px]" />
                            <Skeleton className="h-8 w-[400px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    };
    
    if (products) {
        return (
            <div className="md:w-screen">
                <p className="text-center pt-24 text-lg font-semibold md:text-4xl"> Reach your goals with our award winning products</p>
                <div className="flex justify-center md:w-full">
                    <div className="grid md:gap-12 md:p-12 grid-cols-12 ">
                        {products.products?.allProducts?.map((product, index) => (
                            <div className="col-span-12 md:col-span-4 lg:col-span-3" key={index}>
                                <ProductCard product={product} user={user}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    };
}

const ProductCard = ({ product , user}) => {
    const queryClient = useQueryClient();
    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id, productPrice: product.price }),
        onSuccess: (data)=> {
            queryClient.invalidateQueries(["currentUser"]);
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });
    
    return (
        <div className='h-full w-full flex flex-col md:p-2'>
            <img
                src={product.imageUrl}
                alt={`Image of ${product.title}`}
                className="object-cover h-2/3 rounded-sm"
            />
            <div className='flex flex-col justify-between h-1/3 md:1/2 w-full'>
                <div className='flex flex-col gap-2 mt-2 '>
                    <div className='flex border-b justify-between'>
                        <StarRating rating={product.rating} />
                        <p>Price: <span>{product.price} $</span></p>
                    </div>
                    <p className='text-center first-letter:uppercase text-lg'>{product.title}</p>
                    <p className="text-sm ml-auto ">{product.quantity}</p>
                </div>
                <div className="flex mb-2 md:mx-0 mx-4 justify-between">
                    <Button asChild size="sm">
                        <Link to={"/productpage/" + product.id}>View Product</Link>
                    </Button>
                    {user?.email ? (
                        <Button size="sm" onClick={addToCart.mutate}>Add to cart</Button>
                    ) : (
                        <Button asChild size="sm">
                            <Link to="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

const StarRating = ({ rating }) => {
    const renderStars = () => {
        const filledStars = Math.floor(rating);
        const remainder = rating - filledStars;
        const stars = [];
        for (let i = 0; i < filledStars; i++) {
            stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
        }

        if (remainder > 0) {
            stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
        }

        const remainingStars = 5 - filledStars - (remainder > 0 ? 1 : 0);

        for (let i = 0; i < remainingStars; i++) {
            stars.push(<i key={filledStars + i} className="far fa-star text-yellow-500"></i>);
        }

        return stars;
    };

    return <div className="text-sm">{renderStars()}</div>;
}