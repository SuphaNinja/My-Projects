
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "src/components/ui/skeleton";
import { Button } from "src/components/ui/button";
import StarRating from "src/components/ui/StarRating";


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
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id, productPrice: product.price }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["currentUser"])
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    if (fetchedProduct.isLoading) {
        return (
            <div  className="flex flex-col md:flex-row items-center justify-center h-screen md:mx-24">
                <Skeleton className="h-2/3 md:w-1/2 mt-24 md:mt-0 w-full rounded-xl" />
                <div className="space-y-2 flex flex-col items-center mt-4 md:justify-center h-2/3 w-full md:w-1/2">
                    <Skeleton className="h-8 md:w-1/2 w-full" />
                    <Skeleton className="h-8 md:w-1/2 w-full" />
                    <Skeleton className="h-8 md:w-1/2 w-full" />
                    <Skeleton className="h-8 md:w-1/2 w-full" />
                </div>
            </div>
        )
    };
   
    if (product) {
        return (
            <div className="md:mx-24 md:my-12">
                <div className="flex md:flex-row md:items-center flex-col md:border md:rounded-xl">
                    <div className="mt-24 md:mt-0 md:w-3/5 md:mr-4">
                        <img className="h-1/3 w-full object-cover md:rounded-l-lg" src={product.imageUrl}/>
                    </div>
                    <div className="md:w-2/5">
                        <p className="text-center border-b font-semibold text-2xl">{product.title}</p>
                        <div className="flex text-xl items-center justify-evenly mt-6">
                            <div>
                                <p className="">Price: {product.price} $</p>
                                <p>Qty: {product.quantity}</p>
                            </div>
                            <StarRating rating={product.rating} />
                        </div>
                        <div className="flex w-full mt-6 justify-between">
                            {user?.email ? (
                                <Button onClick={addToCart.mutate} className="mx-auto" size="lg">
                                    Add to cart
                                </Button>
                            ) : (
                                <Button asChild className="mx-auto" size="lg">
                                    <Link to="/login">Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}   

