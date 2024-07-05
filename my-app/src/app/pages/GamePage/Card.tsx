"use client"

import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import socket from "./socket"
import { toast, useToast } from "@/components/ui/use-toast"

export default function Card({ card, clickedCard, setClickedCard, gameSession, currentPlayerId }:any) {

    const { toast } = useToast();

    const [isVisible, setIsVisible] = useState(card?.isVisible);

    useEffect(() => {
        setIsVisible(card?.isVisible);
    }, [card?.isVisible]);


    const handleCardClick = () => {
        if (card.isMatched === true) {
            toast({ variant: "destructive", title: "Error", description: "Card has already been found!" })
            return;
        };

        if (card.isVisible === true) {
            toast({ variant: "destructive", title: "Error", description: "Card has already been clicked!" })
            return;
        };

        if (gameSession.players.length < 2) {
            toast({ variant: "destructive", title: "Wait", description: "No player has joined yet!" });
            return;
        };

        if (gameSession.players[0].userId === currentPlayerId && gameSession.currentTurn % 2 !== 0) {
            toast({ variant: "destructive", title: "Wait", description: "It's not your turn!" });
            return;
        };

        if (gameSession.players[1].userId === currentPlayerId && gameSession.currentTurn % 2 === 0) {
            toast({ variant: "destructive", title: "Wait", description: "It's not your turn!" });
            return;
        };
        
        if (gameSession.players[1].userId !== currentPlayerId && gameSession.players[0].userId !== currentPlayerId) {
            toast({ variant: "destructive", title: "You are in spectator mode", description: "There can only be 2 players playing in one lobby!" });
        };

        setClickedCard(card);
    };

    return (
        <div className="">
            {card && isVisible ? (
                <div>
                    <button
                        onClick={() => handleCardClick()}
                        className={`md:w-32 md:h-32 lg:w-56 lg:h-56 w-24 h-24 overflow-hidden rounded-xl transition-all duration-500 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    >
                        <div className="relative md:size-32 lg:size-56   size-24 object-cover ">
                            <img src={card.memoryCard?.image} className="md:size-32 lg:size-56 size-24" />
                            <h2 className="absolute top-2 left-2 text-xl ">{card.title}</h2>
                        </div>
                    </button>
                </div>
                )
            : (
                <div>
                    <button onClick={() => handleCardClick()} className={`md:w-32 md:h-32 lg:w-56 lg:h-56 w-24 h-24 overflow-hidden rounded-xl transition-all duration-500 transform ${!isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <img className="md:size-32 lg:size-56  size-24 " src="https://howlongtobeat.com/games/5203_League_of_Legends.jpg" />
                    </button>
                </div>
                )
                
            }
        </div>
    )
}