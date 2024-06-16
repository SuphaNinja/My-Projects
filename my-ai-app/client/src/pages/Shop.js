import { useQueries, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";




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
    
    if (products) {
        return (
            <div className="md:w-screen ">
                <p className="text-center pt-24 text-lg font-semibold md:text-4xl"> Reach your goals with our award winning products</p>
                <div className="flex justify-center md:w-full">
                
                    <div className="grid md:gap-12  md:p-12 grid-cols-12 ">
                        {products.products?.allProducts?.map((product, index) => (
                            <div className="col-span-12 md:col-span-4 lg:col-span-3" key={index}>
                                <ProductCard product={product} user={user}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}


const ProductCard = ({product ,user }) => {
    const queryClient = useQueryClient();
    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id })
    });

    const handleAddToCart = () => {
        addToCart.mutate()
        toast("Item added to cart.")
        queryClient.invalidateQueries(["currentUser"])
    };
    

    return (
        <div className='md:h-full bg-slate-300 border-t-4 md:border-t-0 md:rounded-xl md:shadow-xl md:p-4 md:w-full h-full w-full flex flex-col'>
            <div className='h-2/3 md:1/2 w-full flex items-center'>

                <img
                    src={product.imageUrl}
                    alt={`Image of ${product.title}`}
                    className={`object-cover rounded-xl size-full }`}
                />

            </div>
            <div className='flex flex-col justify-between h-1/3 md:1/2 w-full'>
                <div className='flex flex-col gap-2 mt-2 '>
                    <div className='flex justify-between'>
                        <StarRating rating={product.rating} />
                        <p>Price: <span>{product.price} $</span></p>
                    </div>
                    <hr />
                    <p className='text-center first-letter:uppercase text-lg font-semibold'>{product.title}</p>
                    <p className="text-sm ml-auto mr-2 mb-2">{product.quantity}</p>
                </div>
                <div className="flex w-full justify-between">
                    <Link
                        className='text-center mb-2 md:w-auto w-1/2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 md:rounded-xl'
                        to={"/productpage/" + product.id}>View
                    </Link>
                    {user?.email ? (
                        <button
                            onClick={handleAddToCart}
                            className='text-center md:w-auto w-1/2 mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 md:rounded-xl'
                        >
                            Add to cart
                        </button>
                    ) : (
                        <Link
                                className='text-center md:w-auto w-1/2 mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 md:rounded-xl'
                            to="/login">
                            Login
                        </Link>
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
};