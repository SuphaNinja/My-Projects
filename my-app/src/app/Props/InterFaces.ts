

export interface CardProps {
    id: string;        // Unique identifier for the card
    image: string;     // URL or a path to the card's image
    isVisible: boolean; // Visibility status of the card
    title: string;     // Title of the card
}


export interface MemoryCard {
  id: string;
  image?: string | null;
  title?: string | null;
  isVisible: boolean;
  gameCards: GameCard[];  // Referencing an array of GameCard which will be defined next
}

export interface GameSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  players: number;
  currentTurn: number;
  status: 'pending' | 'active' | 'completed';  // Enum-like type for known values
  gameCards: GameCard[];  // An array of GameCard
}

export interface GameCard {
  id: string;
  gameSessionId: string;
  gameSession: GameSession;  // Reference to a GameSession object
  title: string;
  memoryCardId: string;
  memoryCard: MemoryCard;  // Reference to a MemoryCard object
  isMatched: boolean;
  isVisible: boolean;
  position: number;
}
