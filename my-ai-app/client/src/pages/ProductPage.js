
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function ProductPage () {

    const params = useParams();

    const currentUser = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user")
    });
    const user = currentUser.data?.data?.success;

    const fetchedProduct = useQuery({
        queryKey: ["product"],
        queryFn: () => axiosInstance.post("/get-product-by-id", {productId: params.productId})
    });
    const product = fetchedProduct.data?.data?.success;

    const queryClient = useQueryClient();
    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id })
    });

    const handleAddToCart = () => {
        addToCart.mutate()
        toast("Item added to cart.")
        queryClient.invalidateQueries(["currentUser"])
    };

   
    if (product) {
        return (
            <div className="md:mx-24 pb-12 md:mt-12 ">
                <div className="flex md:flex-row md:items-center flex-col md:h-[80vh] md:border-2 md:pr-2 md:rounded-xl">
                    <div className="h-full mt-24 md:mt-auto  md:w-3/5 md:mr-4">
                        <img className="size-full object-cover md:rounded-l-lg" src={product.imageUrl}/>
                    </div>
                    <div className="md:w-2/5  ">
                        <p className="text-center font-semibold text-2xl">{product.title}</p>
                        <hr/>
                        <div className="flex text-xl items-center justify-evenly mt-6">
                            <div>
                                <p className="">Price: {product.price} $</p>
                                <p>Qty: {product.quantity}</p>
                            </div>
                            <StarRating rating={product.rating} />
                        </div>
                        <div className="flex w-full mt-6 justify-between">
                            {user?.email ? (
                                <button
                                    onClick={handleAddToCart}
                                    className='text-center w-1/2 mx-auto mb-2 font-semibold text-large hover:bg-slate-500 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-95 rounded-xl'
                                >
                                    Add to cart
                                </button>
                            ) : (
                                <Link
                                    className='text-center w-full mb-2 font-semibold text-large hover:bg-slate-400 transition-all hover:underline py-2 px-4 bg-slate-600 hover:scale-105 rounded-xl'
                                    to="/login">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
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