import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest,{ params }: { params: { postId: string }} ) {
   
    const postId = params.postId;

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
    
    const like = await prisma.like.findFirst({
        where: { postId: postId, userId: requester.id }
    });

    if (like) {
        await prisma.like.delete({
            where: { id: like.id }
        });
        return NextResponse.json({ message: "Unliked post" }, { status: 200 });
    } else {
        await prisma.like.create({
            data: {
                post: { connect: { id: postId } },
                user: { connect: { id: requester.id } }
            }
        });

        if (requester.id !== post.userId) {
            await prisma.notification.create({
            data: {
                user: { connect: { id: post.userId } },
                message: `${requester.name ? requester.name : requester.userName} has liked your post`,
            }
        })};

        return NextResponse.json({ message: "Liked post" }, { status: 200 });
    }

        
    
};