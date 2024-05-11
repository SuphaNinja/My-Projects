import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function GET (request: NextRequest ) {
   
    const allUsers = await prisma.user.findMany({
        where: {},
        include: { players: true, followed:true, following: true}
    })

    if (!allUsers) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ allUsers } , { status: 200 });
};