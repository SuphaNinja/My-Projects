
import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
   
    const session = await auth();
    console.log("session ID : ", session?.user?.id)
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const friendList = await prisma.user.findMany({ 
        where: { 
            followed: { some: { followingId: session.user.id} }
        },
        include: { 
            followed:true, 
            following: true, 
            players: {
                include: {
                    gameSession:true
                }
            } 
        } 
    })
    

    if (!friendList) {
        return NextResponse.json({ message: "Friendslist not found" }, { status: 404 });
    }

    return NextResponse.json({ friendList }, { status: 200 });
    
};