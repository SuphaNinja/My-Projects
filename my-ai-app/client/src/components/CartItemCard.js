

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState } from "react";
import { toast } from "react-toastify";



export default function CartItemCard ({ itemId, quantity, cartItemId }) {

    const [quantityInCart, setQuantityInCart] = useState(quantity);

    const queryClient = useQueryClient();

    const cartItem = useQuery({
        queryKey: ["cartItem", itemId],
        queryFn: () => axiosInstance.post("/get-product-by-id", { productId: itemId })
    });
    const item = cartItem.data?.data?.success;

    const updateCart = useMutation({
        mutationFn: () => axiosInstance.post("/update-cart-item", { cartItemId: cartItemId, quantity: quantityInCart })
    });

    const handleQuantityChange = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            setQuantityInCart(e.target.value);
        }
        updateCart.mutate();
        queryClient.invalidateQueries(["cartItem", itemId]);
        toast("Quantity Updated.")
    };

    const handleKeyDown = (e) => {
        if (["-", ".", "+", "e", ","].includes(e.key)) {
            e.preventDefault();
        }
    };

    const deleteCartItem = useMutation({
        mutationFn: () => axiosInstance.post("/delete-cart-item", { cartItemId: cartItemId })
    });
   
    const totalPrice = (quantityInCart * item?.price).toFixed(2)
    if (item) {
        return (
            <div className="w-full text-white bg-slate-600 p-2 rounded-xl">
                <div className="flex  w-full">
                    <div className="h-44 rounded-xl w-60">
                        <img className="rounded-xl object-cover size-full" src={item.imageUrl} />
                    </div>
                    <div className="flex flex-col my-4 ml-4 justify-between">
                        <p className="font-semibold text-lg">{item.title}</p>
                        <p>Price: {item.price} $</p>
                        <p>Qty: {item.quantity}</p>
                        <p><StarRating rating={item.rating}/></p>
                    </div>
                    <div className="flex ml-auto text-black flex-col p-4 bg-gray-100 rounded-lg shadow-md">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quantity">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                onChange={handleQuantityChange}
                                onKeyDown={handleKeyDown}
                                value={quantityInCart}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                type="number"
                                inputMode="numeric"
                                pattern="\d*"
                                min="0"
                                step="1"
                            />
                            <p className="text-lg font-semibold">
                                Total: ${totalPrice}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                /* onClick={handleRemoveFromCart} */
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Remove from cart
                            </button>
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