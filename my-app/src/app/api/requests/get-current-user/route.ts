
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";








export async function GET (request: NextRequest, ) {
   
    const session = await auth();
   
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { following: true, followed: true, }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 402 });
    }

    return NextResponse.json( user, { status: 200 });
    
};