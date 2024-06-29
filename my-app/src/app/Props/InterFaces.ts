export interface CardProps {
  id: string;
  image: string;
  isVisible: boolean;
  title: string;
};

export interface MemoryCard {
  id: string;
  image?: string | null;
  title?: string | null;
  isVisible: boolean;
  gameCards: GameCard[];  
};

export interface GameSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  players: number;
  currentTurn: number;
  status: 'pending' | 'active' | 'completed';  
  gameCards: GameCard[];
};

export interface GameCard {
  id: string;
  gameSessionId: string;
  gameSession: GameSession;
  title: string;
  memoryCardId: string;
  memoryCard: MemoryCard;
  isMatched: boolean;
  isVisible: boolean;
  position: number;
};
