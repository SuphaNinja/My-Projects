export default function PlayerTwoStats(gameSession: any) {
    if (!gameSession.gameSession.players) {
        return (<div>Waiting for players...</div>)
    } 
    if (gameSession.gameSession.players[1]) {
        return (
            <div className="w-full flex flex-col px-4 pt-2">
                <div className="flex flex-col text-center">
                    <p className="text-lg font-semibold">Player Two:</p>
                    <p className="text-xl font-semibold underline">{gameSession.gameSession.players[1]?.name}</p>
                </div>
                <div className="mt-4">
                    <p>Points: {gameSession.gameSession.players[1]?.points}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-semibold underline">Found Cards:</p>
                    <div className="grid grid-cols-1 md:lg:grid-cols-2">
                        {gameSession.gameSession.players[1]?.foundCards.map((card: any, index: any) => (
                            <div key={index} className="size-24 relative">
                                <img className="size-full relative" src={card.image} />
                                <p className="absolute font-bold top-2 left-2">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    } else {
        return (<p>Waiting for player 2...</p>)
    }
}