"use client"


import Card from "./Card";
import { use, useState } from "react";
import socket from "./socket";
import { useEffect } from "react";
import { useGameSession} from "@/app/contexts/SelectedCardsContext";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import PlayerOneStats from "./PlayerOneStats";
import PlayerTwoStats from "./PlayerTwoStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Home from "@/app/home";
import { useTimer } from 'react-timer-hook';


export default function Page() {
    const { gameSession, setGameSession } = useGameSession();
    const [ clickedCard ,setClickedCard ] = useState(null);
    const { toast } = useToast();
    const [ timeLeft, setTimeLeft ] = useState("0")

    const { data:user } = useSession()

    const [ gameKeyInput, setGameKeyInput ] = useState("")


    const startGame = () => {
        socket.emit("CreateGame", user?.user)
        toast({ variant: "default", title: "Game Has Been Started!", description: `Status: Active` })
    };

    const resetGame = () => {
        if (gameSession) {
            socket.emit("resetGame", gameSession)
            toast({ variant: "default", title: "Game Has Been Reset!", description: `Status: Completed` })
        }
    };


    const joinGame = (user: any, gameKeyInput:String) => {
        socket.emit("JoinGame", user, gameKeyInput)
        setGameKeyInput("");
        toast({ variant: "default", title: "Game Joined!", description: `Status: active` });
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket)
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnected`);
            socket.removeAllListeners();
        });
        socket.on("JoinGame", (data:any) => {
            setGameSession(data);
        })
        

        socket.on("gameReady", (gameData) => {
            setGameSession(gameData);
            toast({ variant: "default", title: "Game started Successfully!", description: `Status: Active` });
            
        });

        socket.on("gameCompleted", (data) => {
            setGameSession(null)
            toast({ variant: "default", title: "Game is completed!", description: `Status: completed` })
        });
        
        socket.on("FoundCard", (message) => {
            toast({ variant: "default", title: message, description: "Player get's another turn!" })
        })

        return () => {
            socket.off("connect");
            socket.off("GetCardData");
            socket.off("gameReady");
            socket.off("disconnect");
            socket.off("JoinGame");
            socket.off("gameCompleted");
            socket.off("FoundCard");
        };

    }, []);

    useEffect(() => {
        if (gameSession && gameSession.status === "completed") {
            setGameSession(null)
        }
        
    }, [gameSession])

    useEffect(() => {
        const emitRequest = () => {
            socket.emit("UpdatingGameData", gameSession);  
        };
        
        emitRequest();
        socket.on("timeExpired", () =>{
            toast({ variant: "default", title: "Time is up",})
        })
        
        const intervalId = setInterval(() => {
            emitRequest();
        }, 100);

        socket.on("UpdatingGameData", (data: any, gameTimer:any) => {
            setGameSession(data);
            setTimeLeft(gameTimer);
        });

        return () => {
            clearInterval(intervalId);
            socket.off("UpdatingGameData");
            socket.off("timeExpired");
        };  
    }, [gameSession]);


    useEffect(() => {
        socket.emit("ChangeCardData", clickedCard, user?.user)
        setTimeout(() => {
            setClickedCard(null)
        }, 100);
    }, [clickedCard])
        
    
    
    
    return (
            <Home>
                <div className="flex ">
                    {gameSession ?
                        <div className="flex items-center mx-4 w-full">
                            <Button className="" onClick={() => resetGame()}>Exit Game!</Button>
                        <Button className="" onClick={() => console.log(timeLeft)}>console.log time </Button>
                            <p className="text-2xl mx-auto border-x-2 px-4 border-black font-bold text-center ">
                                {gameSession.currentTurn % 2 === 0 ? 
                                gameSession?.players[0]?.name : gameSession?.players[1]?.name}'s turn!
                            </p>
                           
                        </div>
                    :
                    <div className="flex items-center mx-4 w-full">
                        <div className="flex gap-2  px-4 py-2">
                            <Input value={gameKeyInput} className="w-64" onChange={(e) => setGameKeyInput(e.target.value)} type="text" placeholder="Add a gameKey and press join!"/>
                            <Button className="" onClick={() => joinGame(user?.user, gameKeyInput)}>Join Game (player 2)</Button>
                        </div>
                        <p className="text-xl mx-auto">Start or join a game to play!</p>
                        
                    </div>
                    }            
                    <p className="ml-auto font-semibold  text-lg ">GameKey: {gameSession?.id ? gameSession.id: "Create a game and the GameKey Will show up here!"}</p>
                </div>
                <div className="w-full border-t-2 grid grid-cols-6 h-screen">
                    <div>
                        {gameSession ? 
                            <PlayerOneStats gameSession={gameSession} />
                        :
                        <p className="text-xl text-center font-semibold">Waiting for player One...</p>
                        }
                    </div>
                    {gameSession && gameSession.gameCards ? 
                        <div className="col-span-4 dark:bg-slate-600 border-x-2 rounded-md bg-slate-300 grid-cols-3 md:lg:grid-cols-5 grid md:lg:p-8">
                            {gameSession.gameCards.map((card: any, index: any) => (
                                <div className="" key={index}>
                                    <Card
                                        card={card}
                                        clickedCard={clickedCard}
                                        setClickedCard={setClickedCard}
                                        gameSession={gameSession}
                                        currentPlayerId={user?.user?.id}
                                    />
                                </div>
                            ))}
                        </div> 
                    :
                    <div className="col-span-4 flex border-x-2 justify-center">
                            <Button className="mt-12 text-2xl py-4 px-8"  onClick={() => startGame()}>Start Game</Button>
                    </div>
                    }
                    <div>
                        {gameSession && gameSession?.players.length > 1 ? 
                            <PlayerTwoStats gameSession={gameSession} />
                        :
                        <p className="text-xl text-center font-semibold">Waiting for player two...</p>
                        }
                    </div>
                </div> 
            </Home>
        )
}



