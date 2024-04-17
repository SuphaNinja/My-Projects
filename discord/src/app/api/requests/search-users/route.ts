import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, ) {

    const session = await auth();

    const searchData = await request.json();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!searchData.content) {
        return NextResponse.json({ message: "Post image is required" }, { status: 402 });
    }
    
    const results = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: searchData.content }},
                { email: { contains: searchData.content }},
                { userName: { contains: searchData.content }},
            ]
        },
    })
   

    return NextResponse.json( results, { status: 200 });

};