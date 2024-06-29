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

        if (!user) { return NextResponse.json({ error: "User not found" }, { status: 404 }) };
        
        const wishListItem = await prisma.wishList.findFirst({
            where: { productId: String(itemId), userId: user.id },
        });

        if (!wishListItem) { return NextResponse.json({ error: "Could not find item to delete!" }, { status: 404 }) };

        if (wishListItem) {
            await prisma.wishList.delete({
                where: { id: wishListItem.id},
            });
        };

        return NextResponse.json({ message: "Deleted item from WishList" }, { status: 200 });

    } catch (error) {
        console.log("Error deleting wishlist item:", error)
        return NextResponse.json({ error: "Something went wrong, please try again later!" }, { status: 200 });
    }
};