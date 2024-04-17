    import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest,{ params }: { params: { userId: string }}  ) {
   
    const session = await auth();
    const userId = params.userId;
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }



    const posts = await prisma.post.findMany({
        where: { userId: user.id },
        include: { user: true, tags: true, likes: true, replies: true},
        orderBy: { 
            created_at: "desc"
        }
    });

    let response = [];

    for (const post of posts) {
        let likedPost = { ...post, userHasLiked: false};
        for (const like of post.likes) {
            if (like.userId === user.id) {
                likedPost = { ...post, userHasLiked: true }
                break;
            } 
                
            else {
                likedPost = { ...post, userHasLiked: false }
            }

        }
        response.push(likedPost);
    }

    


    return NextResponse.json( response, { status: 200 });
    
};