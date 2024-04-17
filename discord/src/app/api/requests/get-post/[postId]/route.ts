import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest,{ params }: { params: { postId: string }}  ) {
   
    const session = await auth();
    const postId = params.postId;
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requester = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!requester) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { 
            tags: true, 
            user: true, 
            likes: true,
            replies: {
                include: {
                    user: true,
                },
                orderBy: { 
                    created_at: "desc"
                },  
            },
        }
        
    })

    if (!post) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    let postWithLikes = { ...post, userHasLiked: false};

        for (const like of post.likes) {
            if (like.userId === requester.id) {
                postWithLikes = { ...post, userHasLiked: true }
                break;
            } else {
                postWithLikes = { ...post, userHasLiked: false }
            }

        }


    

    


    return NextResponse.json( postWithLikes, { status: 200 });
    
};