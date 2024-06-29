import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "./ui/StarRating";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function CartItemCard({ itemId, quantity, cartItemId }) {
    const [ quantityInCart, setQuantityInCart] = useState(quantity);
    const queryClient = useQueryClient();

    const cartItem = useQuery({
        queryKey: ["cartItem", itemId],
        queryFn: () => axiosInstance.post("/get-product-by-id", { productId: itemId })
    });
    const item = cartItem.data?.data?.success;

    const updateCart = useMutation({
        mutationFn: () => axiosInstance.post("/update-cart-item", { cartItemId: cartItemId, quantity: quantityInCart }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["cartItem", itemId]);
            if (data.data.success) { toast(data.data.success)};
            if (data.data.error) { toast(data.data.error) };
        } 
    });

    const handleQuantityChange = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            setQuantityInCart(e.target.value);
        }
        updateCart.mutate();
    };

    const handleKeyDown = (e) => {
        if (["-", ".", "+", "e", ","].includes(e.key)) {
            e.preventDefault();
        };
    };

    const deleteCartItem = useMutation({
        mutationFn: () => axiosInstance.post("/delete-cart-item", { cartItemId: cartItemId }),
        onSuccess:(data) => {
            queryClient.invalidateQueries(["cartItem", itemId]);
            if (data.data.success) { toast(data.data.success) };
            if (data.data.error) { toast(data.data.error) };
        }
    });

    const totalPrice = (quantityInCart * item?.price).toFixed(2);
    if (item) {
        return (
            <div className="flex md:p-2 flex-col md:flex-row md:mr-2 md:rounded-xl border w-full">
                <img className="md:rounded-xl object-cover md:h-44 md:w-60" src={item.imageUrl} />
                <div className="flex md:flex-col my-4 ml-4 justify-between">
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p>Price: {item.price} $</p>
                    <p>Qty: {item.quantity}</p>
                    <p><StarRating rating={item.rating} /></p>
                </div>
                <div className="flex md:ml-auto flex-col justify-between md:p-4">
                    <div className="flex ml-2 md:ml-0 flex-col">
                        <Label htmlFor="quantity">Quantity:</Label>
                        <Input
                            name="quantity"
                            onChange={handleQuantityChange}
                            onKeyDown={handleKeyDown}
                            value={quantityInCart}
                            type="number"
                            inputMode="numeric"
                            pattern="\d*"
                            min="0"
                            step="1"
                        />
                    </div>
                    <p className="text-lg ml-2 md:ml-0 font-semibold">Total: ${totalPrice}</p>
                    <Button
                        variant="destructive"
                        onClick={deleteCartItem.mutate} 
                    >
                        Remove from cart
                    </Button>
                </div>
            </div>
        )
    }
}