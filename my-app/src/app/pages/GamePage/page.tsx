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
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";


export default function Page() {
    const { gameSession, setGameSession } = useGameSession();
    const [ clickedCard ,setClickedCard ] = useState(null);
    const { toast } = useToast();
    const [ test, setTest ] = useState()

    const { data:user } = useSession()

    const [ gameKeyInput, setGameKeyInput ] = useState("")

    const friendList = useQuery({
        queryKey: ["friend"],
        queryFn: () => api.getFriendList(),
    });

    const currentUser = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

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

    const sendInvite = (sessionId:string, userName:string) => {
        if (gameSession) {
            socket.emit("invitePlayer", sessionId, userName)
        }
    }

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
        
        socket.on("acceptInvite", (inviteInfo:any) => {
            
            if (currentUser.isSuccess && inviteInfo.inviter !== currentUser.data.name) {
                toast({ 
                    variant: "default", 
                    title: `You got Invited by ${inviteInfo.inviter}`, 
                    description: `${<Button onClick={() => joinGame(currentUser.data,inviteInfo.sessionId)}>Join!</Button>}` 
                });
                setTest(inviteInfo);
            } else {
                toast({
                    variant: "default",
                    title: `You got Invited by ${inviteInfo.inviter}`,
                    description: `${<Button onClick={() => joinGame(currentUser.data, inviteInfo.sessionId)}>Join!</Button>}`
                });
            }
        })

        socket.on("gameReady", (gameData) => {
            setGameSession(gameData);
            toast({ variant: "default", title: "Game Created! Waiting for player two!", description: `Status: pending` });
            
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
            socket.off("acceptInvite");
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

        socket.on("UpdatingGameData", (data: any) => {
            setGameSession(data);
            
            
        });

        if (gameSession?.players[0].points + gameSession?.players[1]?.points === 10) {
            setTimeout(() => {
                socket.emit("resetGame", gameSession);
            }, 10000);
            if (gameSession.players[0].points > gameSession.players[1].points) {
                toast({
                    variant: "default",
                    title: `${gameSession.players[0].name} Won!`,
                    description: `Game will close in 10 seconds!`
                })
            } else {
                toast({
                    variant: "default",
                    title: `${gameSession.players[1].name} Won!`,
                    description: `Game will close in 10 seconds!`
                })
            }
        }

        return () => {
            clearInterval(intervalId);
            socket.off("UpdatingGameData");
            socket.off("timeExpired");
            
        };  
    }, [gameSession]);
    useEffect(() => {
        if (gameSession?.players?.length === 2) {
            toast({
                variant: "default",
                title: `Game Started!`,
                description: `Status: active`
            })
        }
    }, [gameSession?.players?.length]);
    
    useEffect(() => {
        if (gameSession?.currentTime === 0) {
            toast({ 
                variant: "default", 
                title: `Times Up!`, 
                description: `${gameSession.currentTurn % 2 === 0 ? gameSession?.players[0]?.name : gameSession?.players[1]?.name} has lost their turn!` 
            })
        }
    }, [gameSession?.currentTime])


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
                        <div className="flex justify-between mx-4 w-full">
                            <Button className="" onClick={() => resetGame()}>Exit Game!</Button>
                            <div className="flex flex-col mx-auto justify-center items-center">
                            {gameSession.status === "active" && <p>Time Left: {gameSession.currentTime}s</p>}
                                <p className="text-2xl mx-auto border-x-2 px-4 border-black font-bold text-center ">
                                    {gameSession.currentTurn % 2 === 0 ? gameSession?.players[0]?.name : gameSession?.players[1]?.name}'s turn!
                                </p>
                            </div>
                        </div>
                    :
                    <div className="flex items-center mx-4 w-full">
                        <div className="flex gap-2  px-4 py-2">
                            <Input value={gameKeyInput} className="w-64" onChange={(e) => setGameKeyInput(e.target.value)} type="text" placeholder="Add a gameKey and press join!"/>
                            <Button className="" onClick={() => joinGame(currentUser.data, gameKeyInput)}>Join Game (player 2)</Button>
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
                        <div className="col-span-4 dark:bg-slate-600 border-x-2 rounded-md bg-slate-300 grid-cols-3 md:lg:grid-cols-4 grid md:lg:p-8">
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
                            <PlayerTwoStats gameSession={gameSession}/>
                        :
                        <>
                            {gameSession && gameSession?.players.length ===  1 ? (
                                friendList.isSuccess &&
                                    <div>
                                        <p className="text-xl text-center font-semibold">Waiting for player two...</p>
                                        {friendList.data.friendList.map((friend: any, index: number) => (
                                            <div key={index} className="grid w-full mx-auto grid-cols-6 gap-2 p-2 border-2 items-center bg-slate-200 dark:bg-slate-700 justify-center border-slate-950 rounded-md overflow-hidden">
                                                <div className="col-span-2 border-r-4 pr-4 h-20 w-full flex items-center justify-center ">
                                                    <img src={friend.image} className="size-full object-cover rounded-full" />
                                                </div>
                                                <div className="flex flex-col justify-center gap-2 col-span-2 h-20 w-full">
                                                    <p className="font-semibold text-lg">{friend.name}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <Button onClick={() => console.log(currentUser)} className="">user</Button>
                                                    <Button onClick={() => sendInvite(gameSession.id, currentUser.data.name)} className="">Invite</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ):(
                                    <p>Start a Game to invite players!</p>
                                ) 
                            }
                        </>
                        }
                    </div>
                </div> 
            </Home>
        )
}



