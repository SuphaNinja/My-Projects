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
        
        const foundCartItem = await prisma.cart.findFirst({
            where: {userId: userId, productId: productData.productId},
        });

        if (foundCartItem) {
            await prisma.cart.update({
                where: { id: foundCartItem.id },
                data: {
                    quantity: productData.quantity === 1 ? foundCartItem.quantity + productData.quantity : productData.quantity ,
                    price: productData.price
                },
            })
        } else {
            await prisma.cart.create({
                data: {
                    userId: userId,
                    productId: productData.productId,
                    quantity: productData.quantity,
                },
            });
        }

        return NextResponse.json({ message: "Product added to cart successfully" }, { status: 200 });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        return NextResponse.json({ message: "Failed to add product to cart" }, { status: 500 });
    }

};