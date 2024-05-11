import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, ) {

    const session = await auth();

    const searchData = await request.json();
   
   

    if (!searchData.content) {
        return NextResponse.json({ message: "SearchData is required" }, { status: 402 });
    }

    const currentUser = await prisma.user.findUnique({
        where: {id: session?.user?.id}
    })
    
    const searchResults = await prisma.user.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { name: { contains: searchData.content } },
                        { email: { contains: searchData.content } },
                    ]
                },
                {
                    id: { not: currentUser?.id }
                }
            ]
        },
        include: { followed: true, following: true, players:true }
    })

    if (searchResults.length === 0) {
        return NextResponse.json({ message: "No user found!" }, { status: 404 });
    }

    const resultsWithoutPassword = searchResults.map(user => {
        const { password, ...userWithoutPassword } = user; 
        return userWithoutPassword;
    });
   

    return NextResponse.json( resultsWithoutPassword, { status: 200 });

};