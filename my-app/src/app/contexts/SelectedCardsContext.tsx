import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CardProps } from '../Props/InterFaces';

interface SelectedCardsContextType {
    selectedCards: CardProps[];
    setSelectedCards: Dispatch<SetStateAction<any[]>>;
}

const SelectedCardsContext = createContext<SelectedCardsContextType | undefined>(undefined);

export const SelectedCardsProvider = ({ children }:any) => {
    const [selectedCards, setSelectedCards] = useState(() => {
        const saved = localStorage.getItem("selectedCards")
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    }, [selectedCards]);

    return (
        <SelectedCardsContext.Provider value={{ selectedCards, setSelectedCards }}>
            {children}
        </SelectedCardsContext.Provider>
    );
};

export const useSelectedCards = () => {
    const context = useContext(SelectedCardsContext);
    if (context === undefined) {
        throw new Error('useSelectedCards must be used within a SelectedCardsProvider');
    }
    return context;
};


interface GameSessionContextType {
    gameSession: any;
    setGameSession: (gameSession: any) => void;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);


export const GameSessionProvider = ({ children }: any) => {
    const [gameSession, setGameSession] = useState<any>(() => {
        const saved = localStorage.getItem("gameSession")
        return saved && JSON.parse(saved);
    });

    useEffect(() => {
        localStorage.setItem('gameSession', JSON.stringify(gameSession));
    }, [gameSession]);

    return (
        <GameSessionContext.Provider value={{ gameSession, setGameSession } as any}>
            {children}
        </GameSessionContext.Provider>
    );
};

export const useGameSession = () => {
    const context = useContext(GameSessionContext);
    if (context === undefined) {
        throw new Error('useGameSession must be used within a GameSessionProvider');
    }
    return context;
};

const JoinSuccessContext = createContext<any>(undefined);

export const JoinSuccessProvider = ({ children }: any) => {
    const [ joinSuccess, setJoinSuccess ] = useState(() => {
        const saved = localStorage.getItem("joinSuccess")
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('joinSuccess', JSON.stringify(joinSuccess));
    }, [joinSuccess]);

    return (
        <JoinSuccessContext.Provider value={{ joinSuccess, setJoinSuccess }}>
            {children}
        </JoinSuccessContext.Provider>
    );
};

export const useJoinSuccess = () => {
    const context = useContext(JoinSuccessContext);
    if (context === undefined) {
        throw new Error('useJoinSuccess must be used within a JoinSuccessProvider');
    }
    return context;
};