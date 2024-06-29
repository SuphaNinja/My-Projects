import cors from "cors";

import express from "express";
import { createServer } from "http";
const app = express();
const api = express.Router();

app.use(
    cors({
        origin: ["http://localhost:3000"],
    })
);

app.use("/api", api);
app.use(express.json());
const server = createServer(app);

const port = 8080;


server.listen(port, () => {
    console.log(`App started on http://localhost:${port}`);
});

// Initializing Socket.io server
import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

const userSocketMap = new Map();

io.on("connection", async (socket) => {
    const count = io.engine.clientsCount;
    console.log(`User ${socket.id} Connected`);
    console.log("Client Count " + count);
   
    socket.on("register", (userId) => {
        console.log("user has been registered userId:",userId,"socketId", socket.id)
        if (userId && socket.id) {
            userSocketMap.set(userId, socket.id);
        };
    });

    socket.on("disconnect", () => {
        for (const [id, sid] of userSocketMap.entries()) {
            if (sid === socket.id) {
                userSocketMap.delete(id);
                break;
            };
        };
    });

    // Shuffle Cards
    function shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    };

    // Fetch all memoryCards so they cant be randomized
    async function fetchMemoryCards() {
        return await prisma.memoryCards.findMany({
            where: {}
        });
    };
    
    // Create GameSession function 
    async function createGameSession() {
        return await prisma.gameSession.create({
            data: {
                status: 'pending'
            }
        });
    };

    // Create gameCards function   
    async function createGameCards(sessionId: string, shuffledCards: any) {
        const gameCardsData = shuffledCards.map((card:any, index:any) => ({
            gameSessionId: sessionId,
            memoryCardId: card.id,
            title: card.title,
            position: index,
            isVisible: false,
            isMatched: false,
            image: card.image
        }));
    

        return await prisma.gameCard.createMany({
            data: gameCardsData
        });
    };

    // Create player function 
    async function createPlayer(player: any, sessionId: any ) {
        console.log("player",player)
        const playerData = {
            userId: player.id,
            gameSessionId: sessionId,
            name: player.name ? player.name : player.email,
            points: 0
        };
            return await prisma.player.create({
                data: playerData
            })
    };
    // Create Game
    socket.on("CreateGame", async (user) => {
        console.log("startrequest:", user);
        try {
        // Fetch and shuffle memory cards
        const memoryCards = await fetchMemoryCards();
        const shuffledCards = shuffle(memoryCards);

        // Create game session
        const gameSession = await createGameSession();

        // Create player 1 for the game session
        await createPlayer(user, gameSession.id);
        
        // Create game cards
        await createGameCards(gameSession.id, shuffledCards);

        // Find just created game and send to client
        const createdGame = await prisma.gameSession.findUnique({
            where: { id: gameSession.id },
            include: {
                players: {
                    include: { foundCards:true }
                },
                gameCards: {
                    include:{
                        memoryCard: true
                    },
                    orderBy: {
                        position: 'asc' 
                    }
                }
            }
        });

        socket.join(gameSession.id);

        io.to(gameSession.id).emit("gameReady", createdGame);

        } catch (error) {
            console.error("Error starting game:", error);
            socket.emit("error", "Failed to start the game");
        };
    });
  
    //PlayerTwo Joining existing Gamesession by providing sessionId on client
    socket.on("JoinGame", async (player: User, sessionId: string ) =>  {
        await createPlayer(player, sessionId);
        const gameData = await prisma.gameSession.update({
            where: { id: sessionId },
            data: { status: "active" },
            include: { 
                players: {
                    include: { foundCards:true }
                },
                gameCards: true
            }
        }); 

        socket.join(sessionId);

        io.to(sessionId).emit("UpdatingGameData", gameData);
        io.to(sessionId).emit("JoinGame", gameData);

        startTimer(sessionId);
    });

    const resetGameTimer = async (sessionId:string) => {
        await prisma.gameSession.update({
            where: { id: sessionId },
            data: {
                currentTime: 30
            }
        });
    };

    let timerInterval: NodeJS.Timeout;
    const startTimer = async (sessionId:string ) => {
        timerInterval = setInterval(async () => {
            try {
                const session = await prisma.gameSession.findUnique({
                    where: { id: sessionId },
                    select: { currentTime: true, currentTurn: true }
                });

                if (session && session.currentTime && session.currentTime > 0) {
                    
                    const updatedSession = await prisma.gameSession.update({
                        where: { id: sessionId },
                        data: { currentTime: { decrement: 1 } }
                    });

                    io.to(sessionId).emit("updatingTimer", updatedSession.currentTime);

                } else {
                    
                    const timeIsUp = await prisma.gameSession.update({
                        where: { id: sessionId },
                        data: { 
                            currentTurn: { increment: 1 },
                            currentTime: 30
                        },
                        include: {
                            players: {
                                include: { foundCards: true }
                            },
                            gameCards: {
                                orderBy: {
                                    position: "asc"
                                },
                                include: { memoryCard: true }
                            }
                        }
                    });
                    resetGameTimer(sessionId)

                    io.to(sessionId).emit("UpdatingGameData", timeIsUp);
                };
            } catch (error) {
                console.error(`Failed to update session ${sessionId}:`, error);
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        };
    };
   
    let selectedCards:any[] = [];
    socket.on("ChangeCardData", async (clickedCard, user) => {
        try {
            if (!user) {
                throw new Error("User could not be found", user );
            };

            if (clickedCard !== null && selectedCards.length < 1) {
                await prisma.gameCard.update({
                    where: { id: clickedCard.id, memoryCardId: clickedCard.memoryCardId},
                    data: {
                        isVisible: true
                    }
                })
                selectedCards.push(clickedCard);

                const session = await prisma.gameSession.findUnique({
                    where: { id: clickedCard.gameSessionId },
                    include: {
                        players: {
                            include: { foundCards: true }
                        },
                        gameCards: {
                            orderBy: {
                                position: "asc"
                            },
                            include: { memoryCard: true }
                        }
                    }
                });
                
                io.to(clickedCard.gameSessionId).emit("UpdatingGameData", session);
            };

            if (
                clickedCard !== null && selectedCards.length > 0 
                && clickedCard.memoryCardId !== selectedCards[0].memoryCardId
                && clickedCard.title !== selectedCards[0].title
            ) {
                resetGameTimer(clickedCard.gameSessionId)

                await prisma.gameCard.update({
                    where: { 
                        id: clickedCard.id, 
                        memoryCardId: clickedCard.memoryCardId,
                        gameSessionId: clickedCard.gameSessionId
                    },
                    data: { isVisible: true }
                });

                const session = await prisma.gameSession.update({
                    where: { id: clickedCard.gameSessionId },
                    data: { currentTurn: { increment: 1 }},
                    include: {
                        players: {
                            include: { foundCards:true }
                        },
                        gameCards: {
                            orderBy: {
                                position: "asc"
                            },
                            include: { memoryCard: true }
                        }
                    }
                });
                
                io.to(clickedCard.gameSessionId).emit("UpdatingGameData", session);

                setTimeout(async () => {
                    await prisma.gameCard.update({
                        where: {
                            id: clickedCard.id, 
                            memoryCardId: clickedCard.memoryCardId, 
                            gameSessionId:clickedCard.gameSessionId
                        },
                        data: { isVisible: false }
                    });

                    await prisma.gameCard.update({
                        where: { 
                            id: selectedCards[0].id, 
                            memoryCardId: selectedCards[0].memoryCardId, 
                            gameSessionId: selectedCards[0].gameSessionId 
                        },
                        data: { isVisible: false }
                    });
                    
                    selectedCards = [];

                    const session = await prisma.gameSession.findUnique({
                        where: {id: clickedCard.gameSessionId},
                        include: {
                            players: {
                                include: { foundCards: true }
                            },
                            gameCards: {
                                orderBy: {
                                    position: "asc"
                                },
                                include: { memoryCard: true }
                            }
                        }
                    });

                    io.to(clickedCard.gameSessionId).emit("UpdatingGameData", session);

                }, 1000);
            };

            if (
                clickedCard !== null && selectedCards.length > 0 // checking if stored card in selectedCards array and clickedCard is a match! (they dont have same memoryCardId but the same title)
                && clickedCard.memoryCardId !== selectedCards[0].memoryCardId
                && clickedCard.title === selectedCards[0].title
            ) {

                io.to(clickedCard.gameSessionId).emit("FoundCard", user.name );

                await prisma.player.updateMany({
                    where: { gameSessionId: clickedCard.gameSessionId, userId: user.id },
                    data: {
                        points: { increment: 1 },
                    }
                });

                resetGameTimer(clickedCard.gameSessionId)

                const player = await prisma.player.findFirst({
                    where: {userId: user.id, gameSessionId: clickedCard.gameSessionId}
                });

                if (!player) {
                    throw new Error("Player not found");
                };

                await prisma.gameCard.update({
                    where: {
                        id:clickedCard.id,
                        gameSessionId: clickedCard.gameSessionId 
                    },
                    data: {
                        isVisible: true,
                        isMatched: true,
                        foundById: player.id 
                    }
                });
                selectedCards = [];

                const session = await prisma.gameSession.findUnique({
                    where: {id: clickedCard.gameSessionId},
                    include: {
                        players: {
                            include: { foundCards:true }
                        },
                        gameCards: {
                            orderBy: {
                                position: "asc"
                            },
                            include: { memoryCard: true, }
                        }
                    }
                });

                io.to(clickedCard.gameSessionId).emit("UpdatingGameData", session);

            };
        } catch (error) {
            console.log(error)
        }
    });
    
    socket.on("resetGame", async (session) => {
        stopTimer();
        const completedSession = await prisma.gameSession.update({
            where: {id: session.id},
            data: {
                status: "completed"
            },
            include: {
                players:true
            }
        });

        io.to(session.id).emit("gameCompleted", completedSession);
    }); 
    
    socket.on("invitePlayer", async (sessionId, userName, invitedId) => {
        console.log("sessionID",sessionId)
        console.log("userName",userName)
        console.log("invitedId",invitedId)
        
        const inviteInfo = {
            sessionId: sessionId,
            inviter: userName,
            invitedId: invitedId
        };

        const invitedUser = await prisma.user.findUnique({
            where: {id: invitedId}
        });

        const invitedSocketId = userSocketMap.get(invitedId);
        if (invitedSocketId && invitedUser) {
            console.log(`User with socketID ${invitedSocketId} is connected.`);
            io.to(invitedSocketId).emit("acceptInvite", {inviteInfo, invitedUser});
        } else {
            console.log(`User with ID ${invitedId} is not connected.`);
            socket.emit("error",`User with ID ${invitedId} is not connected.`)
        };
    });
});