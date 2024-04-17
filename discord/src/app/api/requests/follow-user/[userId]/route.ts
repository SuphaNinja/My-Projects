import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest,{ params }: { params: { userId: string }} ) {
   
    const userId = params.userId;

    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const requester = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true }
    });

    if(!requester) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.email === requester.id) {
        return NextResponse.json({ message: "You cannot follow yourself" }, { status: 402 });
    }

    const follow = await prisma.follow.findFirst({
        where: { followedId: userId, followingId: requester.id }
    });

    if (follow) {
        await prisma.follow.delete({
            where: { id: follow.id }
        });

        return NextResponse.json({ message: "Unfollowed user" }, { status: 200 });
    } else {
         await prisma.follow.create({
            data: {
                followed: {
                    connect: { id: userId }
                },
                following: {
                    connect: { id: requester.id }
                }
            }
        });
        if (requester.id !== user.id) {
        await prisma.notification.create({
        data: {
            user: { connect: { id: user.id } },
            message: `${requester.name ? requester.name : requester.userName} has followed you!`,
        }
    })};
        return NextResponse.json({ message: "Followed user" }, { status: 200 });
    }
};