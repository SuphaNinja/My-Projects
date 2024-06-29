"use client"
import Card from "./Card";
import { useState } from "react";
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
import { ToastAction } from "@/components/ui/toast";

export default function Page() {
    const { gameSession, setGameSession } = useGameSession();
    const [ clickedCard ,setClickedCard ] = useState(null);
    const { toast } = useToast();
    const [ timer, setTimer ] = useState(null);

    const { data:user } = useSession();

    const [ gameKeyInput, setGameKeyInput ] = useState("");

    const friendList = useQuery({
        queryKey: ["friend"],
        queryFn: () => api.getFriendList(),
    });

    const currentUser = useQuery({
        queryKey: ["user"],
        queryFn: () => api.getCurrentUser(),
    });

    const startGame = () => {
        socket.emit("CreateGame", user?.user);
        toast({ variant: "default", title: "Game Has Been Started!", description: `Status: Active` });
    };

    const joinGame = (user: any, gameKeyInput: any) => {
        socket.emit("JoinGame", user, gameKeyInput);
        setGameKeyInput("");
        toast({ variant: "default", title: "Game Joined!", description: `Status: active` });
    };

    const resetGame = () => {
        if (gameSession) {
            setGameSession(null);
            socket.emit("resetGame", gameSession);
            toast({ variant: "default", title: "Game Has Been Reset!", description: `Status: Completed` });
        };
    };

    const sendInvite = (sessionId: any, userName: any, invitedId:any) => {
        if (sessionId && userName && invitedId){
            socket.emit("invitePlayer", sessionId, userName, invitedId)
        };
    };
    

    useEffect(() => {
        const handleConnect = () => {
            console.log(socket);
        };

        const handleDisconnect = () => {
            console.log(`User ${socket.id} disconnected`);
            socket.removeAllListeners();
        };

        const handleJoinGame = (data: any) => {
            setGameSession(data);
        };

        const handleGameReady = (gameData: any) => {
            setGameSession(gameData);
            toast({ variant: "default", title: "Game Created! Waiting for player two!", description: `Status: pending` });
        };

        const handleGameCompleted = (data:any) => {
            setTimeout(() => {
                setGameSession(null);
            }, 5000);
            if (data.players[0].points > data.players[1].points) {
                toast({
                    variant: "default",
                    title: `${data.players[0].name} Won!`,
                    description: "Game will close in 5 seconds!"
                });
            } else if (data.players[0].points < data.players[1].points) {
                toast({
                    variant: "default",
                    title: `${data.players[1].name} Won!`,
                    description: "Game will close in 5 seconds!"
                });
            } else {
                toast({
                    variant: "default",
                    title: `It's a draw!`,
                    description: "Game will close in 5 seconds!"
                });
            };
        };

        const handleFoundCard = (message: any) => {
            toast({
                variant: "default",
                title: `Card has been found by ${message}!`,
                description: `${message} gets another turn!`,
            });
        };

        const handleUpdatingTimer = (data:any) => {
            setTimer(data);
        };

        const handleUpdatingGameData = (data: any) => {
            setGameSession(data);
        };

        const handleAcceptInvite = (data: any) => {
            console.log("acceptinvite", data);
            console.log("currentuser",currentUser)
            toast({
                title: "You have been invited!",
                description: `${data.inviteInfo.userName} has invited you to play!`,
                action: <ToastAction onClick={() => {
                    console.log(currentUser.data ,data.inviteInfo.sessionId)
                    joinGame(data.invitedUser ,data.inviteInfo.sessionId)}
                } altText="Accept">Accept</ToastAction>,
            });
        };

        const handleError = (data:string) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: data,
            });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("JoinGame", handleJoinGame);
        socket.on("gameReady", handleGameReady);
        socket.on("gameCompleted", handleGameCompleted);
        socket.on("updatingTimer", handleUpdatingTimer)
        socket.on("FoundCard", handleFoundCard);
        socket.on("UpdatingGameData", handleUpdatingGameData);
        socket.on("timeExpired", handleUpdatingTimer);
        socket.on("acceptInvite", handleAcceptInvite);
        socket.on("error", handleError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("JoinGame", handleJoinGame);
            socket.off("gameReady", handleGameReady);
            socket.off("gameCompleted", handleGameCompleted);
            socket.off("FoundCard", handleFoundCard);
            socket.off("UpdatingGameData", handleUpdatingGameData);
            socket.off("timeExpired", handleUpdatingTimer);
            socket.off("acceptInvite", handleAcceptInvite);
            socket.off("error", handleError);
        };
    }, [setGameSession]);

    useEffect(() => {
        if (currentUser.data?.id) {
            socket.emit("register", currentUser.data?.id);
        }
    }, [currentUser.isSuccess]);

    useEffect(() => {
        if (
            gameSession && 
            gameSession.players.length === 2 &&
            gameSession.players[0].points + gameSession.players[1].points === 10
        ) {
            socket.emit("resetGame", gameSession)
        };
    }, [gameSession])

    
    useEffect(() => {
        if (gameSession?.currentTime === 0) {
            toast({ 
                variant: "default", 
                title: `Times Up!`, 
                description: `
                ${gameSession.currentTurn % 2 === 0 ? 
                gameSession?.players[0]?.name : gameSession?.players[1]?.name} has lost their turn!` 
            });
        };
    }, [gameSession?.currentTime]);


    useEffect(() => {
        socket.emit("ChangeCardData", clickedCard, user?.user)
        setTimeout(() => {
            setClickedCard(null)
        }, 100);
    }, [clickedCard]);
    
    return (
        <Home>
            <div className="flex ">
            {gameSession ?
                <div className="flex justify-between md:mx-4 w-full">
                    <Button onClick={() => resetGame()}>Exit Game!</Button>
                    <div className="flex flex-col mx-auto justify-center items-center">
                    {gameSession.status === "active" && <p>Time Left: {timer && timer +"s"}</p>}
                        <p className="text-2xl mx-auto font-bold text-center">
                            {gameSession.currentTurn % 2 === 0 ? gameSession?.players[0]?.name : gameSession?.players[1]?.name}'s turn!
                        </p>
                    </div>
                </div>
                :
                <div className="flex flex-col md:flex-row items-center md:mx-4 w-full">
                    <div className="flex flex-col md:flex-row gap-2  md:px-4 py-2">
                        <Input value={gameKeyInput}  onChange={(e) => setGameKeyInput(e.target.value)} type="text" placeholder="Add a gameKey and press join!"/>
                        <Button className="" onClick={() => joinGame(currentUser.data, gameKeyInput)}>Join Game (player 2)</Button>
                    </div>
                    <p className="md:text-xl md:mx-auto">Start or join a game to play!</p>
                </div>
                }            
                    <p className="md:ml-auto md:font-semibold md:text-lg ">GameKey: {gameSession?.id ? gameSession.id: "Create a game and the GameKey Will show up here!"}</p>
            </div>
            <div className="w-full border-t grid grid-cols-6 md:h-screen">
                <div>
                    {gameSession ? 
                        <PlayerOneStats gameSession={gameSession} />
                    :
                        <p className="md:text-xl text-center md:font-semibold">Waiting for player One...</p>
                    }
                </div>
                {gameSession && gameSession.gameCards ? 
                    <div className="flex flex-wrap col-span-4 gap-2 items-center justify-center">
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
                <div className="col-span-4 flex border-x justify-center">
                    <Button  onClick={() => startGame()}>Start Game</Button>
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
                                <p className="md:text-xl text-center font-semibold">Waiting for player two...</p>
                                {friendList.data.friendList.map((friend: any, index: number) => (
                                    <div key={index} className="md:grid flex flex-col w-full md:mx-auto grid-cols-6 gap-2 md:p-2 border items-center justify-center rounded-md">
                                        <div className="col-span-2 border-r md:pr-4 h-20 w-full flex items-center justify-center">
                                            <img src={friend.image} className="size-full object-cover rounded-full" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-2 col-span-2 h-20 w-full">
                                            <p className="md:font-semibold md:text-lg text-center">{friend.name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Button size="sm" onClick={() => sendInvite(gameSession.id, currentUser.data.name, friend.id)} className="">Invite</Button>
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



