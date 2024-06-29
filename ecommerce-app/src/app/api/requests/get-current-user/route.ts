import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
    const session = await auth();
   
    if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user?.id},
            include: { accounts: true, carts: true , wishLists: true }
        });

        if (!user) {return NextResponse.json({ error: "User not found" }, { status: 402 }) };
        
        return NextResponse.json( user, { status: 200 });

    } catch (error) {
        console.log("Error getting current user:", error);
        return NextResponse.json({error: "Something went wrong, please try again later!"});
    }
};