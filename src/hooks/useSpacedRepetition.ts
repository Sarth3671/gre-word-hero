import { useState, useEffect, useCallback } from "react";
import { VocabularyWord } from "@/data/vocabulary";
import {
  CardState,
  Quality,
  createInitialCardState,
  calculateNextReview,
  isDueForReview,
} from "@/lib/sm2";
import { Deck, getActiveDeck, getActiveDeckId, setActiveDeckId, getAllDecks } from "@/lib/deckManager";

const STORAGE_KEY_PREFIX = "gre-vocab-card-states-";

export interface CardWithState extends VocabularyWord {
  state: CardState;
}

function getStorageKey(deckId: string): string {
  return `${STORAGE_KEY_PREFIX}${deckId}`;
}

export function useSpacedRepetition() {
  const [cardStates, setCardStates] = useState<Map<number, CardState>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);

  // Load decks and active deck
  const refreshDecks = useCallback(() => {
    const allDecks = getAllDecks();
    setDecks(allDecks);
    const active = getActiveDeck();
    setActiveDeck(active);
    return active;
  }, []);

  // Load card states for the active deck
  const loadCardStates = useCallback((deckId: string) => {
    const stored = localStorage.getItem(getStorageKey(deckId));
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CardState[];
        const stateMap = new Map<number, CardState>();
        parsed.forEach((state) => {
          stateMap.set(state.wordId, state);
        });
        setCardStates(stateMap);
      } catch (e) {
        console.error("Failed to parse stored card states:", e);
        setCardStates(new Map());
      }
    } else {
      setCardStates(new Map());
    }
  }, []);

  // Initial load
  useEffect(() => {
    const active = refreshDecks();
    loadCardStates(active.id);
    setIsLoaded(true);
  }, [refreshDecks, loadCardStates]);

  // Save to localStorage whenever states change
  useEffect(() => {
    if (isLoaded && activeDeck) {
      const statesArray = Array.from(cardStates.values());
      localStorage.setItem(getStorageKey(activeDeck.id), JSON.stringify(statesArray));
    }
  }, [cardStates, isLoaded, activeDeck]);

  const switchDeck = useCallback((deckId: string) => {
    setActiveDeckId(deckId);
    const allDecks = getAllDecks();
    const newActive = allDecks.find(d => d.id === deckId) || allDecks[0];
    setDecks(allDecks);
    setActiveDeck(newActive);
    loadCardStates(deckId);
  }, [loadCardStates]);

  const getCardState = useCallback(
    (wordId: number): CardState => {
      return cardStates.get(wordId) || createInitialCardState(wordId);
    },
    [cardStates]
  );

  const reviewCard = useCallback((wordId: number, quality: Quality) => {
    setCardStates((prev) => {
      const newMap = new Map(prev);
      const currentState = newMap.get(wordId) || createInitialCardState(wordId);
      const newState = calculateNextReview(currentState, quality);
      newMap.set(wordId, newState);
      return newMap;
    });
  }, []);

  const getDueCards = useCallback((): CardWithState[] => {
    if (!activeDeck) return [];
    return activeDeck.words
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => isDueForReview(card.state));
  }, [activeDeck, getCardState]);

  const getNewCards = useCallback((): CardWithState[] => {
    if (!activeDeck) return [];
    return activeDeck.words
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => card.state.repetitions === 0 && card.state.interval === 0);
  }, [activeDeck, getCardState]);

  const getLearningCards = useCallback((): CardWithState[] => {
    if (!activeDeck) return [];
    return activeDeck.words
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter(
        (card) =>
          card.state.repetitions > 0 &&
          card.state.interval > 0 &&
          card.state.interval < 21
      );
  }, [activeDeck, getCardState]);

  const getMasteredCards = useCallback((): CardWithState[] => {
    if (!activeDeck) return [];
    return activeDeck.words
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => card.state.interval >= 21);
  }, [activeDeck, getCardState]);

  const getAllCardsWithState = useCallback((): CardWithState[] => {
    if (!activeDeck) return [];
    return activeDeck.words.map((word) => ({
      ...word,
      state: getCardState(word.id),
    }));
  }, [activeDeck, getCardState]);

  const resetProgress = useCallback(() => {
    if (!activeDeck) return;
    setCardStates(new Map());
    localStorage.removeItem(getStorageKey(activeDeck.id));
  }, [activeDeck]);

  const getStats = useCallback(() => {
    if (!activeDeck) {
      return { total: 0, due: 0, new: 0, learning: 0, mastered: 0 };
    }
    
    const allCards = getAllCardsWithState();
    const dueCards = getDueCards();
    const newCards = getNewCards();
    const learningCards = getLearningCards();
    const masteredCards = getMasteredCards();

    return {
      total: allCards.length,
      due: dueCards.length,
      new: newCards.length,
      learning: learningCards.length,
      mastered: masteredCards.length,
    };
  }, [activeDeck, getAllCardsWithState, getDueCards, getNewCards, getLearningCards, getMasteredCards]);

  return {
    isLoaded,
    activeDeck,
    decks,
    switchDeck,
    refreshDecks,
    getCardState,
    reviewCard,
    getDueCards,
    getNewCards,
    getLearningCards,
    getMasteredCards,
    getAllCardsWithState,
    resetProgress,
    getStats,
  };
}
