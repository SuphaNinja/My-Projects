
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";








export async function GET (request: NextRequest, ) {
   
    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email},
        include: { accounts: true, carts: true , wishLists: true }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 402 });
    }

    return NextResponse.json( user, { status: 200 });
};