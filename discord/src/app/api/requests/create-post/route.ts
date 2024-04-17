import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST (request: NextRequest, ) {

    const session = await auth();

    const postData = await request.json();
   
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { accounts: true, posts: true, followed: true , following: true}
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!postData.postImage) {
        return NextResponse.json({ message: "Post image is required" }, { status: 402 });
    }
    if (!postData.title) {
        return NextResponse.json({ message: "Post title is required" }, { status: 402 });
    }
    if (!postData.description) {
        return NextResponse.json({ message: "Post description is required" }, { status: 402 });
    }

    const tags = postData.tags;

    await prisma.post.create({
    include: { tags: true },
        data: {
            title: postData.title,
            description: postData.description,
            postImage: postData.postImage,
            user: { connect: { id: user.id }},
            tags: {
                create: tags.split(",").map((tag: string)  => ({ tag })) 
            }
        }
    });

    return NextResponse.json({message: "Successfully created post!" }, { status: 200 });

};