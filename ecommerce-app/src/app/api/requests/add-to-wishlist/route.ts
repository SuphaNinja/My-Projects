import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST (request: NextRequest, ) {
    const session = await auth();

    if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    if (!session.user) { return NextResponse.json({ error: "User not found!" }, { status: 404 }) };

    const productData = await request.json();
    const userId = session.user.id;
    
    if (!productData.productId) { return NextResponse.json({ error: "Product ID is required" }, { status: 402 }) };
    if (!productData.quantity || isNaN(productData.quantity) || productData.quantity < 1) { return NextResponse.json({ error: "Invalid quantity" }, { status: 402 }) };
    if (!userId) { return NextResponse.json({ error: "User ID is undefined" }, { status: 500 }) };

    try {
        const foundWishListItem = await prisma.wishList.findFirst({
            where: { userId: userId, productId: productData.productId },
        });

        if (foundWishListItem) {
            if (productData.quantity === 1 && foundWishListItem.quantity === 1) {   
                await prisma.wishList.delete({
                    where: { userId: userId, id: foundWishListItem.id }
                });

                return NextResponse.json({ message: "Item removed from wishlist!" }, { status: 200 });

            } else {
                await prisma.wishList.update({
                    where: { id: foundWishListItem.id, userId: userId },
                    data: {
                        quantity: productData.quantity,
                        price: productData.price
                    },
                });
            };
            
        } else {
            await prisma.wishList.create({
                data: {
                    userId: userId,
                    productId: productData.productId,
                    quantity: productData.quantity,
                    price: productData.price
                },
            });
        };

        return NextResponse.json({ message: "Product added to wishlist successfully" }, { status: 200 });

    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        return NextResponse.json({ error: "Failed to add product to wishlist" }, { status: 500 });
    }
};