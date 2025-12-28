import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Plus } from "lucide-react";
import { Quality } from "@/lib/sm2";
import { useSpacedRepetition, CardWithState } from "@/hooks/useSpacedRepetition";
import { useTheme } from "@/hooks/useTheme";
import { useStreak } from "@/hooks/useStreak";
import Header from "@/components/Header";
import Flashcard from "@/components/Flashcard";
import QualityButtons from "@/components/QualityButtons";
import NavigationButtons from "@/components/NavigationButtons";
import StudyStats from "@/components/StudyStats";
import StudyModeSelector, { StudyMode } from "@/components/StudyModeSelector";
import CardInfo from "@/components/CardInfo";
import EmptyState from "@/components/EmptyState";
import DeckSelector from "@/components/DeckSelector";
import ImportDeckModal from "@/components/ImportDeckModal";
import CreateDeckModal from "@/components/CreateDeckModal";
import AddWordModal from "@/components/AddWordModal";
import StudyTypeToggle, { StudyType } from "@/components/StudyTypeToggle";
import QuizOptions from "@/components/QuizOptions";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentStreak, longestStreak, hasStudiedToday, recordStudySession } = useStreak();
  
  const {
    isLoaded,
    activeDeck,
    decks,
    switchDeck,
    refreshDecks,
    reviewCard,
    getDueCards,
    getNewCards,
    getLearningCards,
    getAllCardsWithState,
    resetProgress,
    getStats,
  } = useSpacedRepetition();

  const [studyMode, setStudyMode] = useState<StudyMode>("due");
  const [studyType, setStudyType] = useState<StudyType>("flashcard");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // Get cards based on study mode
  const cards = useMemo((): CardWithState[] => {
    if (!isLoaded) return [];

    switch (studyMode) {
      case "due":
        return getDueCards();
      case "new":
        return getNewCards();
      case "learning":
        return getLearningCards();
      case "all":
        return getAllCardsWithState();
      default:
        return getDueCards();
    }
  }, [isLoaded, studyMode, getDueCards, getNewCards, getLearningCards, getAllCardsWithState]);

  // Get all words for quiz distractors
  const allWords = useMemo(() => {
    if (!isLoaded) return [];
    return getAllCardsWithState();
  }, [isLoaded, getAllCardsWithState]);

  const stats = useMemo(() => {
    if (!isLoaded) return { total: 0, due: 0, new: 0, learning: 0, mastered: 0 };
    return getStats();
  }, [isLoaded, getStats]);

  const currentCard = cards[currentIndex];

  // Reset index when mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studyMode]);

  // Ensure index is within bounds
  useEffect(() => {
    if (currentIndex >= cards.length && cards.length > 0) {
      setCurrentIndex(cards.length - 1);
    }
  }, [cards.length, currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const goToNextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    } else {
      // Reviewed all cards in this set
      setIsFlipped(false);
      setCurrentIndex(0);
    }
  }, [currentIndex, cards.length]);

  const handleRate = useCallback(
    (quality: Quality) => {
      if (!currentCard) return;
      reviewCard(currentCard.id, quality);
      setSessionReviewed((prev) => prev + 1);
      
      // Record study session for streak
      recordStudySession();

      // Move to next card or reset
      if (currentIndex < cards.length - 1) {
        goToNextCard();
      } else {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex(0);
        }, 200);
      }
    },
    [currentCard, reviewCard, currentIndex, cards.length, goToNextCard, recordStudySession]
  );

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
    if (cards.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * cards.length));
      setIsFlipped(false);
    }
  }, [cards.length]);

  const handleResetProgress = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all progress for this deck? This cannot be undone.")) {
      resetProgress();
      setSessionReviewed(0);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [resetProgress]);

  const handleDeckChange = useCallback((deckId: string) => {
    switchDeck(deckId);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionReviewed(0);
  }, [switchDeck]);

  const handleDeckCreated = useCallback((deckId: string) => {
    refreshDecks();
    switchDeck(deckId);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [refreshDecks, switchDeck]);

  const handleWordAdded = useCallback(() => {
    refreshDecks();
  }, [refreshDecks]);

  // Keyboard navigation (only for flashcard mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (showImportModal || showCreateModal || showAddWordModal) return;
      if (studyType === "quiz") return; // Quiz handles its own keyboard

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
          if (isFlipped) handleRate(1);
          break;
        case "2":
          if (isFlipped) handleRate(2);
          break;
        case "3":
          if (isFlipped) handleRate(3);
          break;
        case "4":
          if (isFlipped) handleRate(4);
          break;
        case "5":
          if (isFlipped) handleRate(5);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCard, isFlipped, handleFlip, handlePrevious, handleNext, handleRate, showImportModal, showCreateModal, showAddWordModal, studyType]);

  if (!isLoaded || !activeDeck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
        <div className="floating-orb floating-orb-4" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>
      
      <Header 
        isDark={isDark}
        onThemeToggle={toggleTheme}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        hasStudiedToday={hasStudiedToday()}
      />

      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        {/* Deck Selector */}
        <div className="w-full max-w-2xl flex items-center justify-between gap-4 mb-6">
          <DeckSelector
            decks={decks}
            activeDeck={activeDeck}
            onSelectDeck={handleDeckChange}
            onCreateDeck={() => setShowCreateModal(true)}
            onImportDeck={() => setShowImportModal(true)}
            onDeckDeleted={refreshDecks}
          />

          <motion.button
            onClick={() => setShowAddWordModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Word</span>
          </motion.button>
        </div>

        <StudyStats stats={stats} />

        {/* Study Type Toggle */}
        <div className="mb-4">
          <StudyTypeToggle type={studyType} onChange={setStudyType} />
        </div>

        <StudyModeSelector
          mode={studyMode}
          onChange={setStudyMode}
          counts={{
            due: stats.due,
            new: stats.new,
            learning: stats.learning,
            all: stats.total,
          }}
        />

        <AnimatePresence mode="wait">
          {cards.length === 0 ? (
            <EmptyState
              key="empty"
              mode={studyMode}
              onSwitchMode={setStudyMode}
              hasDueCards={stats.due > 0}
              hasNewCards={stats.new > 0}
            />
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-muted-foreground">
                  Card {currentIndex + 1} of {cards.length}
                </span>
                <span className="text-muted-foreground">
                  Session: <span className="font-semibold text-foreground">{sessionReviewed}</span> reviewed
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentCard?.id}-${studyType}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentCard && studyType === "flashcard" && (
                    <>
                      <Flashcard
                        word={currentCard}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                      />
                      <CardInfo state={currentCard.state} />
                    </>
                  )}

                  {currentCard && studyType === "quiz" && (
                    <QuizOptions
                      currentWord={currentCard}
                      allWords={allWords}
                      cardState={currentCard.state}
                      onAnswer={handleRate}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {currentCard && studyType === "flashcard" && (
                <QualityButtons
                  cardState={currentCard.state}
                  onRate={handleRate}
                  isFlipped={isFlipped}
                />
              )}

              {studyType === "flashcard" && (
                <>
                  <NavigationButtons
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onShuffle={handleShuffle}
                    canGoPrevious={currentIndex > 0}
                    canGoNext={currentIndex < cards.length - 1}
                  />

                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Press <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">Space</kbd> to flip •
                    <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono ml-1">←</kbd>{" "}
                    <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">→</kbd> to navigate
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset button */}
        <motion.button
          onClick={handleResetProgress}
          className="mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Progress
        </motion.button>
      </main>

      {/* Modals */}
      <ImportDeckModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImported={() => {
          refreshDecks();
          setShowImportModal(false);
        }}
      />

      <CreateDeckModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleDeckCreated}
      />

      <AddWordModal
        isOpen={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        deck={activeDeck}
        onWordAdded={handleWordAdded}
      />
    </div>
  );
};

export default Index;
