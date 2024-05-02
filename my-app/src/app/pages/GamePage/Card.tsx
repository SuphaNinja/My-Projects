"use client"

import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import socket from "./socket"
import { toast, useToast } from "@/components/ui/use-toast"




export default function Card({ card, clickedCard, setClickedCard, socket  }:any) {

    const { toast } = useToast();

    const handleCardClick = () => {

        if (card.isMatched === true) {
            toast({ variant: "destructive", title: "Error", description: "Card has already been found!" })
            return;
        }
        if (card.isVisible === true) {
            toast({ variant: "destructive", title: "Error", description: "Card has already been clicked!" })
            return;
        }

        setClickedCard(card)
    }


    


    return (
        <div className="">
            {card && card.isVisible === true ? (
                <div>
                    <button onClick={() => console.log(card.isVisble)} className="text-red-500 overflow-hidden rounded-xl hover:brightness-50 transition-all">test</button>
                    <button
                        onClick={() => handleCardClick()}
                        className="size-64 overflow-hidden rounded-xl hover:brightness-50 transition-all"
                    >
                        <div className="relative h-64 w-64 object-cover ">
                            <img src={card.memoryCard?.image} className="w-64 h-64" />
                            <h2 className="absolute top-2 left-2 text-xl ">{card.title}</h2>
                        </div>
                    </button>
                </div>
                )
            : (
                <div>
                    <button onClick={() => console.log(card)} className="size-14 overflow-hidden rounded-xl hover:brightness-50 transition-all">test</button>
                    <button onClick={() => handleCardClick()} className="size-64 overflow-hidden rounded-xl hover:brightness-50 transition-all"
                    >
                        <img className="w-64 h-64 " src="https://howlongtobeat.com/games/5203_League_of_Legends.jpg" />
                    </button>
                </div>
                )
                
            }
        </div>
    )
}