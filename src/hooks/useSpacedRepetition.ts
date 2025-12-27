import { useState, useEffect, useCallback } from "react";
import { vocabularyDeck, VocabularyWord } from "@/data/vocabulary";
import {
  CardState,
  Quality,
  createInitialCardState,
  calculateNextReview,
  isDueForReview,
} from "@/lib/sm2";

const STORAGE_KEY = "gre-vocab-card-states";

export interface CardWithState extends VocabularyWord {
  state: CardState;
}

export function useSpacedRepetition() {
  const [cardStates, setCardStates] = useState<Map<number, CardState>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
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
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever states change
  useEffect(() => {
    if (isLoaded) {
      const statesArray = Array.from(cardStates.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statesArray));
    }
  }, [cardStates, isLoaded]);

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
    return vocabularyDeck
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => isDueForReview(card.state));
  }, [getCardState]);

  const getNewCards = useCallback((): CardWithState[] => {
    return vocabularyDeck
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => card.state.repetitions === 0 && card.state.interval === 0);
  }, [getCardState]);

  const getLearningCards = useCallback((): CardWithState[] => {
    return vocabularyDeck
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
  }, [getCardState]);

  const getMasteredCards = useCallback((): CardWithState[] => {
    return vocabularyDeck
      .map((word) => ({
        ...word,
        state: getCardState(word.id),
      }))
      .filter((card) => card.state.interval >= 21);
  }, [getCardState]);

  const getAllCardsWithState = useCallback((): CardWithState[] => {
    return vocabularyDeck.map((word) => ({
      ...word,
      state: getCardState(word.id),
    }));
  }, [getCardState]);

  const resetProgress = useCallback(() => {
    setCardStates(new Map());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getStats = useCallback(() => {
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
  }, [getAllCardsWithState, getDueCards, getNewCards, getLearningCards, getMasteredCards]);

  return {
    isLoaded,
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
