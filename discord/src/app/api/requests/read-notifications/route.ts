
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";








export async function POST (request: NextRequest, ) {
   
    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true, following: true, followed: true }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 402 });
    }

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
    });

    return NextResponse.json( {message: "Read all notifications."}, { status: 200 });
    
};