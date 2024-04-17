import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest,{ params }: { params: { postId: string }} ) {
   
    const postId = params.postId;
    const postData = await request.json();
    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const requester = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true }
    });

    if(!requester) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    if (!postData.content) {
        return NextResponse.json({ message: "You've left empty fileds" }, { status: 402 });
    }

    await prisma.reply.create({
        data: {
            post: {connect: { id: postId },},
            user: {connect: { id: requester.id },},
            content: postData.content,
        }
    });
    if (requester.id !== post.userId) {
        await prisma.notification.create({
        data: {
            user: { connect: { id: post.userId } },
            message: `${requester.name ? requester.name : requester.userName} has commented on your post`,
        }
    })};
    return NextResponse.json({ message: "Reply added" }, { status: 200 });
    
};