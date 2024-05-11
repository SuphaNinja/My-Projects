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


io.on("connection", async (socket) => {
    console.log(`User ${socket.id} Connected`);
    const count = io.engine.clientsCount;
    console.log("client Count " + count);
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
    });




    // Shuffle Cards
    function shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    }

    // Fetch all memoryCards so they cant be randomized
    async function fetchMemoryCards() {
        return await prisma.memoryCards.findMany({
            where: {}
        });
    }
    
    // Create GameSession function 
    async function createGameSession() {
        return await prisma.gameSession.create({
            data: {
                status: 'pending'
            }
        });
    }

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
    }

    // Create player function 
    async function createPlayer(player: any, sessionId: any ) {
        const playerData = {
            userId: player.id,
            gameSessionId: sessionId,
            name: player.name ? player.name : player.email,
            points: 0
        };
            return await prisma.player.create({
                data: playerData
            })
    }
    
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
        const playerOne = await createPlayer(user, gameSession.id);
        
        // Create game cards
        await createGameCards(gameSession.id, shuffledCards);

        // Find just created game and send to client
        const createdGame = await prisma.gameSession.findUnique({
            where: {id: gameSession.id},
            include: {
                players: {
                    include: {foundCards:true}
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
        })
        socket.emit("gameReady", createdGame);
        } catch (error) {
        console.error("Error starting game:", error);
        socket.emit("error", "Failed to start the game");
        }
  })
  
    //PlayerTwo Joining existing Gamesession by providing sessionId on client
    socket.on("JoinGame", async (player: User, sessionId: string ) =>  {
        const playerTwo = await createPlayer(player, sessionId);
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
        socket.emit("JoinGame", gameData);
    });

    let gameTimer:any = null;
    async function resetTimer(sessionId:any) {
        clearTimeout(gameTimer); 
        gameTimer = setTimeout(() => {
        
        socket.emit("timeExpired","timnes up" )
        performActionAfterTimeout(sessionId);
    }, 30000); 
}


    async function performActionAfterTimeout(sessionId:any) {
        console.log("Performing some action due to timeout...");
        await prisma.gameSession.update({
            where:{ id: sessionId},
            data: {currentTurn: { increment:1 }}
        })
    }
    let selectedCards:any[] = []
    socket.on("ChangeCardData", async (clickedCard, user) => {
        console.log("selected Cards first emit if: ", selectedCards)
        

        try {
            if (!user) {
                throw new Error("User could not be found", user )
            }
            if (clickedCard !== null && selectedCards.length < 1) {
                console.log("clicked card 1st if : ", clickedCard);
                
                await prisma.gameCard.update({
                    where: { id: clickedCard.id, memoryCardId: clickedCard.memoryCardId,  },
                    data: {
                        isVisible: true
                    }
                })
                selectedCards.push(clickedCard);
                console.log("selected Cards 1st if: ", selectedCards)
                resetTimer(clickedCard.gameSessionId)
            }

            if (
                clickedCard !== null && selectedCards.length > 0 
                && clickedCard.memoryCardId !== selectedCards[0].memoryCardId   
                && clickedCard.title !== selectedCards[0].title
            ) {
                console.log("clicked card 2nd if : ", clickedCard);
                console.log("selected Cards 2nd if: ", selectedCards)
                await prisma.gameCard.update({
                        where: { 
                            id: clickedCard.id, 
                            memoryCardId: clickedCard.memoryCardId,
                            gameSessionId: clickedCard.gameSessionId
                        },
                        data: { isVisible: true }
                    })
                    await prisma.gameSession.update({
                        where: { id: clickedCard.gameSessionId },
                        data: { currentTurn: { increment: 1 }}
                    })
                setTimeout(async () => {
                    await prisma.gameCard.update({
                    where: {
                        id: clickedCard.id, 
                        memoryCardId: clickedCard.memoryCardId, 
                        gameSessionId:clickedCard.gameSessionId
                    },
                    data: { isVisible: false }
                })
                    await prisma.gameCard.update({
                        where: { 
                            id: selectedCards[0].id, 
                            memoryCardId: selectedCards[0].memoryCardId, 
                            gameSessionId: selectedCards[0].gameSessionId 
                        },
                        data: { isVisible: false }
                    })
                    selectedCards = [];
                }, 1000);
                resetTimer(clickedCard.gameSessionId)
              
            }


            if (
                clickedCard !== null && selectedCards.length > 0 // checking if stored card in selectedCards array and clickedCard is a match! (they dont have same memoryCardId but the same title)
                && clickedCard.memoryCardId !== selectedCards[0].memoryCardId 
                && clickedCard.title === selectedCards[0].title
            ) {
                console.log("clicked card 3nd if : ", clickedCard);
                console.log("selected Cards 3nd if: ", selectedCards)
                socket.emit("FoundCard", "Card has been found by " + user.name )
                await prisma.player.updateMany({
                    where: { gameSessionId: clickedCard.gameSessionId, userId: user.id },
                    data: {
                        points: { increment: 1 },
                    }
                });

                const player = await prisma.player.findFirst({
                    where: {userId: user.id, gameSessionId: clickedCard.gameSessionId}
                });

                if (!player) {
                    throw new Error("Player not found");
                }
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
                resetTimer(clickedCard.gameSessionId)

                selectedCards = [];
            }
        } catch (error) {
            console.log(error)
        }
        
        
    });
    

    socket.on("UpdatingGameData", async (gameData) => {
        if (gameData && gameData.status !== "completed") {
            const session = await prisma.gameSession.findUnique({
            where: {id: gameData.id},
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
            socket.emit("UpdatingGameData", session, gameTimer)

        } else {
            return;
        }
    })
    
    socket.on("resetGame", async (session) => {
        const completedSession = await prisma.gameSession.update({
            where: {id: session.id},
            data: {
                status: "completed"
            }
        })
            console.log("game session with id: " , session.id , " has been completed!")
            socket.emit ("gameCompleted", completedSession);
        
    }); 
    
});