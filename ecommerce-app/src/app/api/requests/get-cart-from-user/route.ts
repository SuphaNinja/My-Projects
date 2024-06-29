import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
    const session = await auth();

    if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    if (!session.user) { return NextResponse.json({ error: "User not found!" }, { status: 404 }) };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) { return NextResponse.json({ error: "User not found!" }, { status: 404 }) };

        const cart = await prisma.cart.findFirst({
            where: { userId: user.id },
        });

        if (!cart) { return NextResponse.json({ error: "Cart not found on user!" }, { status: 200 }) };

        return NextResponse.json({ cart }, { status: 200 });

    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
};