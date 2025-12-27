import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vocabularyDeck, VocabularyWord } from "@/data/vocabulary";
import Header from "@/components/Header";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import ActionButtons from "@/components/ActionButtons";
import NavigationButtons from "@/components/NavigationButtons";
import CompletionCard from "@/components/CompletionCard";

const Index = () => {
  const [cards, setCards] = useState<VocabularyWord[]>([...vocabularyDeck]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set());
  const [needPracticeIds, setNeedPracticeIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const totalReviewed = knownIds.size + needPracticeIds.size;

  useEffect(() => {
    if (totalReviewed === cards.length && cards.length > 0) {
      setIsComplete(true);
    }
  }, [totalReviewed, cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const goToNextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  }, [currentIndex, cards.length]);

  const handleKnown = useCallback(() => {
    if (!currentCard) return;
    setKnownIds((prev) => new Set([...prev, currentCard.id]));
    setNeedPracticeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    
    if (currentIndex < cards.length - 1) {
      goToNextCard();
    } else {
      setIsComplete(true);
    }
  }, [currentCard, currentIndex, cards.length, goToNextCard]);

  const handleNeedPractice = useCallback(() => {
    if (!currentCard) return;
    setNeedPracticeIds((prev) => new Set([...prev, currentCard.id]));
    setKnownIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    
    if (currentIndex < cards.length - 1) {
      goToNextCard();
    } else {
      setIsComplete(true);
    }
  }, [currentCard, currentIndex, cards.length, goToNextCard]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    goToNextCard();
  }, [goToNextCard]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const handleRestart = useCallback(() => {
    setCards([...vocabularyDeck]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownIds(new Set());
    setNeedPracticeIds(new Set());
    setIsComplete(false);
  }, []);

  const handleReviewMissed = useCallback(() => {
    const missedCards = vocabularyDeck.filter((card) =>
      needPracticeIds.has(card.id)
    );
    if (missedCards.length > 0) {
      setCards(missedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownIds(new Set());
      setNeedPracticeIds(new Set());
      setIsComplete(false);
    }
  }, [needPracticeIds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;
      
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          handleFlip();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "1":
          if (isFlipped) handleNeedPractice();
          break;
        case "2":
          if (isFlipped) handleKnown();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComplete, isFlipped, handleFlip, handlePrevious, handleNext, handleKnown, handleNeedPractice]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <CompletionCard
              key="completion"
              known={knownIds.size}
              needPractice={needPracticeIds.size}
              total={cards.length}
              onRestart={handleRestart}
              onReviewMissed={handleReviewMissed}
            />
          ) : (
            <motion.div
              key="flashcard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <ProgressBar
                known={knownIds.size}
                needPractice={needPracticeIds.size}
                total={cards.length}
                currentIndex={currentIndex}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard?.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentCard && (
                    <Flashcard
                      word={currentCard}
                      isFlipped={isFlipped}
                      onFlip={handleFlip}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <ActionButtons
                onKnown={handleKnown}
                onNeedPractice={handleNeedPractice}
                isFlipped={isFlipped}
              />

              <NavigationButtons
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShuffle={handleShuffle}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex < cards.length - 1}
              />

              <p className="text-center text-xs text-muted-foreground mt-8">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground font-mono">Space</kbd> to flip • 
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground font-mono ml-1">←</kbd> <kbd className="px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground font-mono">→</kbd> to navigate
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
