import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, ) {

    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user) {
        return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const productData = await request.json();
    const userId = session.user.id;
    

    if (!productData.productId) {
        return NextResponse.json({ message: "Product ID is required" }, { status: 402 });
    }

    if (!productData.quantity || isNaN(productData.quantity) || productData.quantity < 1) {
        return NextResponse.json({ message: "Invalid quantity" }, { status: 402 });
    }
    if (!userId) {
        return NextResponse.json({ message: "User ID is undefined" }, { status: 500 });
    }


   try {
    const foundWishListItem = await prisma.wishList.findFirst({
        where: { userId: userId, productId: productData.productId },
    });

    if (foundWishListItem) {
        if (productData.quantity === 1 && foundWishListItem.quantity === 1) {
            // Delete item from wishlist if quantity becomes zero
            await prisma.wishList.delete({
                where: { userId: userId, id: foundWishListItem.id }
            });
            return NextResponse.json({ message: "Item deleted successfully!" }, { status: 200 });
        } else {
            // Update quantity and price if item already exists in wishlist
            await prisma.wishList.update({
                where: { id: foundWishListItem.id },
                data: {
                    quantity: productData.quantity,
                    price: productData.price
                },
            });
        }
    } else {
        // Create new item in wishlist if it doesn't exist
        await prisma.wishList.create({
            data: {
                userId: userId,
                productId: productData.productId,
                quantity: productData.quantity,
                price: productData.price
            },
        });
    }

    return NextResponse.json({ message: "Product added to wishlist successfully" }, { status: 200 });

} catch (error) {
    console.error('Error adding product to wishlist:', error);
    return NextResponse.json({ message: "Failed to add product to wishlist" }, { status: 500 });
}

};