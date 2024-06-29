import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST (request: NextRequest ) {
    const session = await auth();
    const itemId:string = await request.json();

    if (!itemId) { return NextResponse.json({ error: "Cannot delete at this moment, please try again later" }, { status: 401 }) };
    if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user?.id },
        });

        if (!user) { return NextResponse.json({ message: "User not found" }, { status: 404 }) };
        
        const cartItem = await prisma.cart.findFirst({
            where: {productId: String(itemId), userId: user.id },
        });

        if (cartItem) {
            await prisma.cart.delete({
                where: { id: cartItem.id},
            });
        };

        return NextResponse.json({ message: "Deleted item from cart" }, { status: 200 });

    } catch (error) {
        console.log("Error deleting item from cart:", error)
        return NextResponse.json({ error: "Something went wrong, please try again later!" }, { status: 200 });
    }
};