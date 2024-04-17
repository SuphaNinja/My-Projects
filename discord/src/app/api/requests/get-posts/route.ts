import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET (request: NextRequest, ) {
   
    const session = await auth();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true, following: true, followed: true  }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 402 });
    }

    const posts = await prisma.post.findMany({
        include: { user: true, tags: true, likes: true, replies: true},
        orderBy: { 
            created_at: "desc"
        }
    });

    let filteredPosts = [];

    for (let post of posts) {
        let likedPost = { ...post, userHasLiked: false};
        for (const like of post.likes) {
            if (like.userId === user.id) {
                likedPost = { ...post, userHasLiked: true }
                break;
            } else {
                likedPost = { ...post, userHasLiked: false }
            }

        } 
        for (const follow of user.following) {
            if (follow.followedId === post.userId) {
                filteredPosts.push(likedPost)
            }
        }
        
        if (user.id === post.userId) {
            filteredPosts.push(likedPost)
        }
    };


    return NextResponse.json( filteredPosts, { status: 200 });
    
};