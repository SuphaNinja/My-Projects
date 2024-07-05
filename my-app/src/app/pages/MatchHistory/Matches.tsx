export default function Matches( gameSession: any) {
    const player = gameSession.gameSession;

    return (

        <>
        {player.gameSession.players.length === 2 ? (
            <div className="w-full border rounded-md p-4 h-full">
                <div className="w-full flex border-b pb-2 items-center justify-evenly">
                    <div>
                        <p className="font-semibold text-xl">{player.gameSession.players[0].name}</p>
                        <p className="text-green-500 ">{player.gameSession.players[0].points > player.gameSession.players[1].points && "Winner!"}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-center text-xl font-bold"> VS </p>
                        <p className="text-green-500 text-center">{player.gameSession.players[1].points === player.gameSession.players[0].points && "Draw!"}</p>
                        <p className="font-light text-sm">{DateFormatter(player.gameSession.createdAt)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-xl">{player.gameSession.players[1].name}</p>
                        <p className="text-green-500 ">{player.gameSession.players[1].points > player.gameSession.players[0].points && "Winner!"}</p>
                    </div>
                </div>
                <div className="flex justify-evenly">
                    <p>Points: {player.gameSession.players[0].points}</p>
                    <div className="flex gap-1 flex-wrap">
                        <p className="w-full">Found Cards:</p>
                        {player.gameSession.players[0].foundCards.map((card: any, index: any) => (
                            <div key={index}>
                                <div className="relative size-12">
                                    <img className="size-12" src={card.image} />
                                    <p className="absolute text-xs top-2 left-2">{card.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        <p className="w-full">Found Cards:</p>
                        {player.gameSession.players[1].foundCards.map((card: any, index: any) => (
                            <div key={index}>
                                <div className="relative size-12">
                                    <img className="size-12" src={card.image} />
                                    <p className="absolute text-xs top-2 left-2">{card.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p>Points: {player.gameSession.players[1].points}</p>
                </div>
            </div>
        ) : (
                null
            )}
        </>
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

