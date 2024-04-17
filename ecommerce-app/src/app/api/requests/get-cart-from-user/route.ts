import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function GET (request: NextRequest, ) {

    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user) {
        return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { carts: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        const cart = await prisma.cart.findUnique({
            where: { id: user.carts[0].id },
        });

        if (!cart) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 200 });
        }

        return NextResponse.json({ cart }, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 });
    }

};