import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, { params }: { params: { userId: string }} ) {
   
    const userId = params.userId;
    console.log("User ID to follow:", userId);
    const session = await auth();
    console.log("Session object:", session);


    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { 
            accounts: true, 
            followed:true, 
            following:true 
        }
    });
    

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    console.log("Attempting to find requester with ID:", session?.user?.id);
    const requester = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { accounts: true, followed: true, following: true }
    });
       
    if (!requester) {    
        console.log("Failed to find requester with ID:", session.user.id);    
        return NextResponse.json({ message: "Requester not found" }, { status: 404 });
    }

    console.log("Requester found:", requester);

    if (user.id === requester.id) {
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
        
        return NextResponse.json({ message: "Followed user" }, { status: 200 });
    }
};