import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest ) {
   

    const session = await auth();

    const itemId:string = await request.json();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user?.id },
        include: { accounts: true, carts: true, wishLists: true }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!itemId) {
        return NextResponse.json({ message: "Cannot delete at this moment, please try again later" }, { status: 401 });
    }
    
    const wishListItem = await prisma.cart.findFirst({
        where: {productId: String(itemId) },
    });

    if (wishListItem) {
        await prisma.cart.delete({
            where: { id: wishListItem.id},
        });
    }
        return NextResponse.json({ message: "Deleted item from WishList" }, { status: 200 });
    
};