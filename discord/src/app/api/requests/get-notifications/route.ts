
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";








export async function GET (request: NextRequest, ) {
   
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

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { created_at: "desc" },
    });

    return NextResponse.json( notifications, { status: 200 });
    
};