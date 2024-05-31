const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
    credentials: true, 
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(fileUpload());
app.use("/images", express.static(__dirname + "/images"));


const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            res.send({error: "Your session has expired or does not exist!"});
            return;
        } else {
            req.userId = decoded.userId;
            next();
        }
    });
};




app.post("/create-new-user", async ( req, res) => {
    const signUpData = req.body;
   
    if (!signUpData.firstName) {
        res.send({ error: "First name field cannot be left empty!"});
        return;
    }
    if (!signUpData.lastName) {
        res.send({ error: "last name field cannot be left empty!" });
        return;
    }
    if (!signUpData.userName) {
        res.send({ error: "Username field cannot be left empty!" });
        return;
    }
    if (!signUpData.email) {
        res.send({ error: "Email field cannot be left empty!" });
        return;
    }
    if (!signUpData.password) {
        res.send({ error: "First name field cannot be left empty!" });
        return;
    }

    const foundUser = await prisma.user.findUnique({
        where: { email: signUpData.email }
    });

    if (foundUser) {
        res.send({ error: "Email is already in use!" });
        return;
    }

    const adminKey = "123admin"

    try {
        const hashedPassword = bcrypt.hashSync(signUpData.password, 10);

        const createdUser = await prisma.user.create({
            data: {
                firstName: signUpData.firstName,
                lastName: signUpData.lastName,
                userName: signUpData.userName,
                email: signUpData.email,
                password: hashedPassword,
                role: signUpData.adminKey === adminKey ? "ADMIN" : "USER"
            }
        })

        res.send({ success: "Created User: " + createdUser.userName + "successfully!"})
    } catch(error) {
        console.log(error)
        return;
    }
});

app.post("/login", async (req,res) => {

    const loginData = req.body;


    if (!loginData.email) {
        res.send({ error: "Email field cannot be left empty!"})
    }

    if (!loginData.password) {
        res.send({ error: "Password field cannot be left empty!" })
    }

    const user = await prisma.user.findUnique({
        where: { email: loginData.email }
    });

    if (!user) {
        res.send({ error: "Password or email is incorrect!"});
        return;
    }

    const passwordValid = await bcrypt.compare(loginData.password, user.password);

    if (!passwordValid) {
        res.send({ error: "Password or email is incorrect!"});
        return;
    };

    const { password, ...userWithoutPass } = user;
    res.send({
        token: jwt.sign({ userId: user.id}, process.env.SECRET_KEY, {expiresIn: "5h"}),
        userWithoutPass
    });
});

app.get("/get-current-user", verifyToken, async (req,res) => {
    const userId = req.userId;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: true,
                comments: true,
                likes: true,
                notifications: true,

            }
        });
        if (!user) {
            res.send({error: "User could not be found!"})
        }

        const { password, ...userWithoutPass } = user;
        res.send({success: userWithoutPass});
    } catch (error) {
        console.log("Error getting current user :", error)
        return;
    }
});

app.get("/get-user", async (req,res) => {
    const userId = req.body;
});


app.post("/create-post", verifyToken, async (req, res) => {
    console.log(req.body)
    const userId = req.userId;

    const postData = req.body;

    

    try {
        const file = req.files ? req.files.file : null;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.send({ error: "User not found!" });
            return;
        }

        if (!postData.title) {
            res.send({error: "Title field cannot be left empty!"});
            return;
        }
        if (!postData.description) {
            res.send({ error: "Description field cannot be left empty!" });
            return;
        }
        if (!postData.imageUrl && !file) {
            res.send({ error: "You must include either a file or an imageUrl to create a post!" });
            return;
        }
       
        const createdPost = await prisma.post.create({
            data: {
                title: postData.title,
                description: postData.description,
                imageUrl: postData.imageUrl ? postData.imageUrl: "",
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
       

        if (createdPost && file) {
            const fileExtension = path.extname(file.name);
            const newFileName = `${createdPost.id}${fileExtension}`;
            const newFilePath = path.join(__dirname, 'images', newFileName);


            file.mv(newFilePath, async (error) => {
                if (error) {
                    res.send({ error })
                    return;
                }
            });
            await prisma.imageUpload.create({
                data: {
                    fileName: newFileName,
                    filePath: "/images/" + newFileName,
                    postId: createdPost.id
                }
            })
        }

        res.send({success: "Post created successfully!"})

    } catch (error) {
        console.log("Error creating post : ", error);
        res.send({error: "Something went wrong, try again later!"})
        return;
    }
});

app.get("/get-posts", async ( req, res ) => {   
    
    try {
        const posts = await prisma.post.findMany({
            where: {},
            include: {
                likes: true,
                comments: true,
                image: true,
                user: { 
                    select: {
                        id:true,
                        firstName:true,
                        lastName:true,
                        userName:true,
                        email:true,
                        role:true,
                        Profilemage:true,
                        posts:true,
                        comments:true,
                        notifications:true,
                        likes:true
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });
        res.send({ posts });
    } catch (error) {
        console.log("Error getting posts : ", error);
        res.send({error: "Error getting posts, try again later!"});
        return;
    }

});

app.post("/get-post", async (req,res) => {
    const { postId } = req.body;
    
    console.log("21331231231231",postId)
    

    try {
        if (!postId) {
            res.send({error: "Post Id is undefined. Cannot get post!"});
            return;
        };

        const post = await prisma.post.findUnique({
            where: {id: postId},
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        userName: true,
                        email: true,
                        role: true,
                        Profilemage: true,
                        posts: true,
                        comments: true,
                        notifications: true,
                        likes: true
                    }
                },
                comments: {
                    orderBy: {created_at: "desc"},
                    include: { user: true, likes:true }
                },
                likes:true,
                image:true
            }
        });

        if (!post) {
            res.send({error: "Could not find post with that postId!"});
            return;
        };

        res.send({ post });

    } catch (error) {
        console.log("error getting post by id: ", error);
        return;
    }
});

app.post("/like-post", verifyToken, async (req, res) => {
    const userId = req.userId;
    const  { post }  = req.body;


    try {
        const foundPost = await prisma.post.findUnique({
            where: { id: post.id}
        });

        if (!foundPost) {
            console.log("heeelellelel")
            res.send({error: "Could not find post with that id!"});
            return;
        };

        const requester = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!requester) {
            res.send({error: "Could not find user with that userId!"});
            return;
        };

        const like = await prisma.like.findFirst({
            where: { postId: foundPost.id, userId: requester.id }
        });

        if (like) {
            await prisma.like.delete({
                where: { id: like.id }
            });
           res.send({success: "Unliked Post!"});
           return;
        } else {
            await prisma.like.create({
                data: {
                    post: { connect: { id: foundPost.id } },
                    user: { connect: { id: requester.id } }
                }
            });
            
            if (requester.id !== foundPost.userId) {
                await prisma.notification.create({
                    data: {
                        user: { connect: { id: foundPost.userId } },
                        message: `${requester.userName} has liked your post`,
                    }
                })
            }
            res.send({ success: "Liked Post!" });
            return;
        }
    } catch (error) {
        console.log("Error liking or unliking post", error)
    }
});

app.post("/edit-post", verifyToken, async (req, res) => {
    
    const userId = req.userId;

    const postData = req.body;

    console.log("updating post with postData, :", postData);



    try {
        const file = req.files ? req.files.file : null;

        const user = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!user) {
            res.send({ error: "User not found!" });
            return;
        };
        
        if (user.role !== "ADMIN") {
            res.send({ error: "Unauthorized edit of post. User not ADMIN!" });
            return;
        };

        const foundPost = await prisma.post.findUnique({
            where: {id: postData.postId}
        });

        if (!foundPost) {
            res.send({ error: "Could not find post to edit!" });
            return;
        }

        if (!postData.imageUrl && !postData.title && !postData.description && !file) {
            res.send({ error: "You must edit atleast one thing!" });
            return;
        };

        const updatedPost = await prisma.post.update({
            where:{id: foundPost.id},
            data: {
                title: postData.title || undefined,
                description: postData.description || undefined,
                imageUrl: postData.imageUrl || undefined,
            }
        });


        if (updatedPost && file) {
            const fileExtension = path.extname(file.name);
            const newFileName = `${updatedPost.id}${fileExtension}`;
            const newFilePath = path.join(__dirname, 'images', newFileName);

            if (fs.existsSync(newFilePath)) {
                res.send({ error: 'File with that name on this post already exists' });
                return;
            }

            file.mv(newFilePath, async (error) => {
                if (error) {
                    res.send({ error })
                    return;
                }
            });
            await prisma.imageUpload.create({
                data: {
                    fileName: newFileName,
                    filePath: "/images/" + newFileName,
                    postId: updatedPost.id
                }
            })
        }

        res.send({ success: "Post updated successfully!" })

    } catch (error) {
        console.log("Error updateding post :", error);
        res.send({ error: "Something went wrong, try again later!" })
        return;
    }
});

app.post("/delete-post", verifyToken, async (req, res) => {
    const userId = req.userId;
    const postId = req.body;
    console.log("userId from delete comment", userId)
    console.log("postId from delete comment", postId.postId)
    try {
        const deleter = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!deleter) {
            res.send({ error: "Could not delete post. User not found!" });
            return;
        };

        if (deleter.role !== "ADMIN") {
            res.send({ error: "User role is not ADMIN, could not delete post!" });
            return;
        };

        const postToDelete = await prisma.post.findUnique({
            where: { id: postId.postId }
        });

        if (!postToDelete) {
            res.send({ error: "Could not find Post to delete!" });
            return;
        };

        await prisma.post.delete({
            where: { id: postId.postId }
        });

        res.send({ success: "Post has been deleted!" });


    } catch (error) {
        console.log("Error deleting Post!", error);
        res.send({ error: "Something went wrong deleting post, try again later!" });
        return;
    }
});

app.post("/comment-post", verifyToken, async (req, res) => {
    const userId = req.userId;
    console.log("userId from comment", userId)
    const commentData = req.body;
    console.log("commendata from comment", commentData);

    try {
        if (!userId) {
            res.send({error: "You must be signed in to comment on a post!"});
            return;
        };

        if (commentData.comment.length < 3) {
            res.send({error: "You must write atleast 3 letter in your comment!"});
            return;
        };

        if (!commentData.postId) {
            res.send({error: "Error creating post due to no postId!"});
            return;
        };

        const post = await prisma.post.findUnique({
            where: { id: commentData.postId },
        });

        if (!post) {
            res.send({error: "Cant find post with that postId!"});
            return;
        };

        const requester = await prisma.user.findUnique({
            where: { id: userId },
        });  

        if (!requester) {
            res.send({error: "User not found!"});
            return;
        };

        await prisma.comment.create({
            data: {
                post: { connect: { id: post.id }, },
                user: { connect: { id: requester.id }, },
                content: commentData.comment,
            }
        });

        if (requester.id !== post.userId) {
            await prisma.notification.create({
                data: {
                    user: { connect: { id: post.userId } },
                    message: `${requester.userName ? requester.userName : requester.firstName} has commented on your post`,
                }
            })
        };

        res.send({success: "Comment has been added successfully!"});


    } catch (error) {
        console.log("Error commenting on post!", error); 
        res.send({error: "Something went wrong, try again later!"});
        return;
    }
});

app.post("/like-comment", verifyToken, async (req, res) => {
    const userId = req.userId;
    const { comment } = req.body;
    console.log("logging liking comment : ", comment.comment.id)

    try {
        const foundComment = await prisma.comment.findUnique({
            where: { id: comment.comment.id }
        });

        if (!foundComment) {
            res.send({ error: "Could not find comment with that id!" });
            return;
        };

        const requester = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!requester) {
            res.send({ error: "Could not find user with that userId!" });
            return;
        };

        const like = await prisma.like.findFirst({
            where: { commentId: foundComment.id, userId: requester.id }
        });

        if (like) {
            await prisma.like.delete({
                where: { id: like.id }
            });
            res.send({ success: "Unliked Post!" });
            return;
        } else {
            await prisma.like.create({
                data: {
                    comment: { connect: { id: foundComment.id } },
                    user: { connect: { id: requester.id } }
                }
            });

            if (requester.id !== foundComment.userId) {
                await prisma.notification.create({
                    data: {
                        user: { connect: { id: foundComment.userId } },
                        message: `${requester.userName} has liked your comment`,
                    }
                })
            }
            res.send({ success: "Liked Comment!" });
            return;
        }
    } catch (error) {
        console.log("Error liking or unliking comment", error)
    }
});

app.post("/edit-comment", verifyToken, async (req, res) => {

    const userId = req.userId;

    const commentData = req.body;

    console.log("updating comment with commentData, :", commentData.commentData.commentId);



    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.send({ error: "User not found!" });
            return;
        };

        const foundComment = await prisma.comment.findUnique({
            where: { id: commentData.commentData.commentId }
        });

        if (!foundComment) {
            res.send({ error: "Could not find comment to edit!" });
            return;
        }

        if (commentData.commentData.content === foundComment.content){
            res.send({ error: "No changes to edit!" });
            return;
        }

        const updatedComment = await prisma.comment.update({
            where: { id: foundComment.id },
            data: {
                content: commentData.commentData.content || undefined
            }
        });



        res.send({ success: "Comment updated successfully!" })

    } catch (error) {
        console.log("Error updating comment :", error);
        res.send({ error: "Something went wrong, try again later!" })
        return;
    }
});

app.post("/delete-comment", verifyToken, async (req,res) => {
    const userId = req.userId;
    const commentId = req.body;
    console.log("userId from delete comment", userId)
    console.log("commentId from delete comment", commentId)
    try {
        const deleter = await prisma.user.findUnique({
            where: {id: userId}
        });

        if (!deleter) {
            res.send({error: "Could not delete comment. User not found!"});
            return;
        };

        if (deleter.role !== "ADMIN") {
            res.send({ error: "User role is not ADMIN, could not delete comment!" });
            return;
        };

        const commentToDelete = await prisma.comment.findUnique({
            where: {id: commentId.commentId}
        });

        if (!commentToDelete) {
            res.send({error: "Could not find comment to delete!"});
            return;
        };

        await prisma.comment.delete({
            where: { id: commentId.commentId }
        });

        res.send({success: "Comment has been deleted!"});
        

    } catch (error) {
        console.log("Error deleting comment!", error);
        res.send({error: "Something went wrong deleting comment, try again later!"});
        return;
    }
});

const port = 5050;

app.listen(port, () => {
    console.log("App running on port: ", port)
});