export default function PlayerOneStats (gameSession: any) {
    if (!gameSession.gameSession.players) {
        return (<div>Waiting for players...</div>)
    } 
    if (gameSession.gameSession.players[0]) {
    return (
        <div className="w-full flex flex-col md:px-4 pt-2">
           <div className="flex flex-col text-center">
                <p className="md:text-lg md:font-semibold">Player One:</p>
                <p className="md:text-xl md:font-semibold underline">{gameSession?.gameSession?.players[0]?.name}</p>
           </div>
            <div className="mt-4">
                <p>Points: {gameSession?.gameSession?.players[0]?.points}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="md:text-xl md:font-semibold underline">Found Cards:</p>
                <div className="grid grid-cols-1 md:lg:grid-cols-2">
                    {gameSession.gameSession.players[0].foundCards?.map((card:any, index:any ) => (
                        <div key={index} className="md:size-24 size-12 relative">
                            <img className="size-full relative" src={card.image} />
                            <p className="absolute font-bold top-2 left-2">{card.title}</p>
                        </div>      
                    ))}
                </div>
            </div>
        </div>
    )} 
}