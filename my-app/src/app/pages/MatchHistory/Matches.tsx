import { Button } from "@/components/ui/button";


export default function Matches( gameSession: any) {

    const player = gameSession.gameSession;



    return (
        <div className="w-full h-full">
            <div className="w-full flex items-center justify-between shadow-2xl px-24 bg-slate-500 h-16">
                <div>
                    <p className="font-semibold text-xl">Player one : {player.gameSession.players[0].name}</p>
                    <p className="text-green-500 ">{player.gameSession.players[0].points > player.gameSession.players[1].points ? "Winner!": null}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-center text-xl font-bold"> VS </p>
                    <p className="font-light">{DateFormatter(player.gameSession.createdAt)}</p>
                </div>
                <div>
                    <p className="font-semibold text-xl">Player Two : {player.gameSession.players[1].name}</p>
                    <p>{player.gameSession.players[1].points > player.gameSession.players[0].points ? "Winner!" : null}</p>
                </div>
            </div>
            <div className="grid h-full bg-slate-600 w-full grid-cols-6">
                <div className="col-span-2 p-4 h-full bg-blue-500">
                    <p>Points: {player.gameSession.players[0].points}</p>
                </div>
                <div className="col-span-1 grid grid-cols-1 md:grid-cols-4 h-full bg-yellow-500">
                    <p className="col-span-4">Found Cards:</p>
                    {player.gameSession.players[0].foundCards.map((card:any, index:any) => (
                        <div key={index}>
                            <div className="relative size-12">
                                <img className="size-12" src={card.image}/>
                                <p className="absolute top-2 left-2">{card.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-span-1 grid grid-cols-1 md:grid-cols-4 h-full bg-yellow-500">
                    <p className="col-span-4">Found Cards:</p>
                    {player.gameSession.players[1].foundCards.map((card: any, index: any) => (
                        <div key={index}>
                            <div className="relative size-12">
                                <img className="size-12" src={card.image} />
                                <p className="absolute top-2 left-2">{card.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-span-2 p-4 h-full bg-cyan-500">
                    <p>Points: {player.gameSession.players[1].points}</p>
                </div>
            </div>
        </div>
    )
}

function DateFormatter(dateString:string) {  
    
    const date = new Date(dateString);

 
    const readableDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric', 
    
    });

    return <div>{readableDate}</div>;
}

