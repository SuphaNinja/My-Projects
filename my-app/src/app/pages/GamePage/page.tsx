"use client"
import Home from "@/app/page";
import api from "@/lib/axios";
import Card from "./Card";
import { use, useState } from "react";
import socket from "./socket";
import { useEffect } from "react";
import { useSelectedCards, useGameSession } from "@/app/contexts/SelectedCardsContext";
import { toast, useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";



export default function Page() {
    const { selectedCards, setSelectedCards } = useSelectedCards();
    const { gameSession, setGameSession } = useGameSession();
    const [ clickedCard ,setClickedCard ] = useState(null);
    const { toast } = useToast();

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
    useEffect(() => {
        if (gameSession && gameSession.status == "completed") {
            setGameSession(null)
        }
    }, [gameSession]);

    const joinGame = (user: any, gameKeyInput:String) => {
        socket.emit("JoinGame", user, gameKeyInput)
        setGameKeyInput("");
        toast({ variant: "default", title: "Game Joined!", description: `Status: active` });
        window.location.reload();
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket)
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnected`);
            socket.removeAllListeners()
        });
        socket.on("JoinGame", (data:any) => {
            setGameSession(data)
        })
        

        socket.on("gameReady", (gameData) => {
            setGameSession(gameData);
            toast({ variant: "default", title: "Game started Successfully!", description: `Status: Active` })
        });


        return () => {
            socket.off("connect");
            socket.off("GetCardData");
            socket.off("gameReady");
            socket.off("disconnect");
            socket.off("JoinGame");
        };

    }, []);

    useEffect(() => {
        const emitRequest = () => {
            socket.emit("UpdatingGameData", gameSession);  
        };

        emitRequest();

        const intervalId = setInterval(() => {
            emitRequest();
        }, 100);

        socket.on("UpdatingGameData", (data: any) => {
            setGameSession(data);
        });

        return () => {
            clearInterval(intervalId);
            socket.off("UpdatingGameData");
        };  
    }, []);


    useEffect(() => {
        socket.emit("ChangeCardData", clickedCard, user?.user)
        setTimeout(() => {
            setClickedCard(null)
        }, 100);
    }, [clickedCard])
    
        

        return(
            <Home>
                <div className="flex gap-2">
                    <button className="p-4 bg-cyan-500" onClick={() => resetGame()}>Reset Game!</button>
                    <button className="p-4 bg-cyan-500" onClick={() => console.log(gameSession)}>console log gameSession</button>
                    <button className="p-4 bg-cyan-500" onClick={() => console.log(user)}>current user!</button>
                    <button className="p-4 bg-cyan-500" onClick={() => startGame()}>Start Game</button>
                    <div className="flex gap-2 bg-blue-500 px-4 py-2">
                        <input value={gameKeyInput} onChange={(e) => setGameKeyInput(e.target.value)} type="text" placeholder="add gameKey and press join!" className="py-2 px-6 rounded-md bg-red-500 text-white text-lg w-auto" />
                        <button className="p-4 bg-cyan-500" onClick={() => joinGame(user?.user, gameKeyInput)}>Join Game (player 2)</button>
                    </div>
                    <p className="ml-auto bg-green-500">GameKey: {gameSession?.id ? gameSession.id: "Create a game and the GameKey Will show up here!"}</p>
                </div>
                <div className="w-full grid grid-cols-6">
                    <div className="col-span-1 bg-yellow-500"></div>
                    {gameSession && gameSession.gameCards ? 
                        <div className="col-span-4 bg-emerald-500 grid grid-rows-5 gap-4  p-8 grid-cols-4">
                            {gameSession.gameCards.map((card: any, index: any) => (
                                <div className="" key={index}>
                                    <Card
                                        card={card}
                                        clickedCard={clickedCard}
                                        setClickedCard={setClickedCard}
                                        socket={socket}
                                    />
                                </div>
                            ))}
                        </div> 
                    :
                    <div className="col-span-4 bg-emerald-500 grid grid-rows-5 gap-4  p-8 grid-cols-4">
                        <p>Start Game!</p>
                    </div>
                    }
                    <div className="col-span-1  bg-red-500"></div>
                </div> 
            </Home>
        )
}