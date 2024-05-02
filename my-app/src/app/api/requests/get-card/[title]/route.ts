import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest , { params }: { params: { title: string }}) {
    const  title  = params.title
    if (!title) {
        return NextResponse.json("Could not find card with that ID", { status: 404 });
    }

    const card = await prisma.memoryCards.findFirst({
        where: { title: title }
    });

    if (!card) {
        return NextResponse.json("Could not find card with that ID", { status: 404 });
    }

    return NextResponse.json(card, { status: 200 });
}