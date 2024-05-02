"use client"


import { useState } from "react";
import Home from "../../page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";



export default function Page() {

    const { toast } = useToast()

    const [Card, setCard] = useState({
        image: "",
        title: "",
        isVisible: false
    });


    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        setCard((prevCard) => ({
            ...prevCard,
            [name]: value
        }));
    };

    const createCard = useMutation({
        mutationFn: () => api.createCard(Card),
        onSuccess: () => toast({ title: "Success", description: "Added card to database sucessfully" }),
        onError: () => toast({ variant: "destructive", title: "Error", description: "Error adding card to database, please try again later!" })
    })

    return (
        <Home>
            <div className="w-full md:px-60 justify-center">
                <div className="flex flex-col gap-2 p-12">
                    <h2 className="text-2xl text-center mb-4">Add a Card to the Database</h2>
                    <hr />
                    <Label htmlFor="imageUrl" className="text-xl">Image URL</Label>
                    <Input name="image" placeholder="Image url..." onChange={handleFormChange} value={Card.image} type="text" id="imageUrl" className="text-lg" />
                    <Label htmlFor="title" className="text-xl">Title</Label>
                    <Input name="title" placeholder="Title..." onChange={handleFormChange} value={Card.title} type="text" id="Title" className="text-lg" />
                    <Button className="w-1/2 mx-auto mt-2 text-xl" onClick={() => createCard.mutate()}>Add Card</Button>
                </div>
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Mordekaiser_42.jpg" className="w-60 h-60" />
            </div>
        </Home>
    )
}