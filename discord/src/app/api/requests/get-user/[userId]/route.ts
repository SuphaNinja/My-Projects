import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { use } from "react";

export async function GET (request: NextRequest,{ params }: { params: { userId: string }} ) {
   
    const userId = params.userId;

    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    };

    let user = await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true, following:true, followed:true }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 402 });
    };

    const requester = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
    });

    if (!requester) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    };
    
    const follow = await prisma.follow.findFirst({
        where: { followedId: user.id, followingId: requester.id }
    });

    let userWithFollowing;

    if (follow) {
        userWithFollowing = {
            ...user,
            isFollowing: true
        }
    } else {
        userWithFollowing = {
            ...user,
            isFollowing: false
        }
    }

    return NextResponse.json( userWithFollowing, { status: 200 });
    
};