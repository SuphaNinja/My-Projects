import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, ) {

   

    const Card = await request.json();
   

 

   

    if (!Card.image) {
        return NextResponse.json({ message: "Post image is required" }, { status: 402 });
    }
    if (!Card.title) {
        return NextResponse.json({ message: "Post title is required" }, { status: 402 });
    }
    


    await prisma.memoryCards.create({
        data: {
            title: Card.title,
            image: Card.image,
            isVisible: Card.isVisible
        }
    });

    return NextResponse.json({message: "Successfully added Card to database!" }, { status: 200 });

};