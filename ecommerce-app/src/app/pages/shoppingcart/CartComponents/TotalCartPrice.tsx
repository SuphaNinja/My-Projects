"use client"
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function TotalCartPrice({ cartItems ,className}: any) {
    const [ totalPrice, setTotalPrice ] = useState<number>(0);

    useEffect(() => {
        if (cartItems && cartItems !== undefined) {
        let totalPrice = 0;
        const fetchProductDetails = async () => {
            for (const cartItem of cartItems) {
                const productId = cartItem.productId;
                const product = await api.getProductById(productId);
                if (product) {
                    totalPrice += product.price * cartItem.quantity;
                }
            }
            setTotalPrice(totalPrice);
        };
        fetchProductDetails();
    }
    }, [cartItems]);

    return <p className={className}>{Math.round(totalPrice)}</p>;
}