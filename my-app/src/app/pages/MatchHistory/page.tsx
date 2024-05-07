"use client"


import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Matches from "./Matches";
import Home from "@/app/home";


export default function Page() {

    const matchHistory = useQuery({
        queryKey: ["matchHistory"],
        queryFn: () => api.getMatchHistory()
    })



    if (!matchHistory) {
        return <p className="text-center text-6xl underline text-red-500">You are not signed in. Sign in to veiw your Match History!</p>
    }
    if (matchHistory.isLoading) { 
        <p className="text-center text-6xl underline text-red-500">Loading...</p> 
    }

    if (matchHistory.isSuccess) {
        return (
            <Home>
                <Button onClick={() => console.log(matchHistory)}>ttest</Button>
                <div className=" h-screen md:lg:mx-60 pt-12 bg-green-500 flex-flex-col">
                    <h2 className="text-center text-xl md:text-4xl font-semibold ">Your Match History!</h2>
                    <div className="flex gap-2 w-full flex-col">
                        {matchHistory.data.map((session:any, index:any) => (
                            <div key={index} className="h-[300px] w-full bg-red-500">
                                <Matches gameSession={session}/>
                            </div>
                        ))}
                    </div>
                </div>
            </Home>
        )
    }
}