import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
   
 
    const Cards = await prisma.memoryCards.findMany()

    if (!Cards) {
        return NextResponse.json( "no cards found!", { status: 404 });
    }

    return NextResponse.json( Cards, { status: 200 });
    
};