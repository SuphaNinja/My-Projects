import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
   
    const session = await auth();
   
 
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const gameSessions = await prisma.player.findMany({
        where: { userId: session.user?.id},
        include: {
            gameSession: {
                include: {
                    gameCards:true,
                    players: {
                        include: { foundCards:true }
                    }
                }
            },
           
        }
    })
    if (!gameSessions) {
        return NextResponse.json({ message: "Gamesession with this userId not found"}, { status: 404 });
    }

   
    
    return NextResponse.json( gameSessions, { status: 200 });

     
};