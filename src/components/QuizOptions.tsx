import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { VocabularyWord } from "@/data/vocabulary";
import { CardState, Quality } from "@/lib/sm2";

interface QuizOptionsProps {
  currentWord: VocabularyWord;
  allWords: VocabularyWord[];
  cardState: CardState;
  onAnswer: (quality: Quality) => void;
}

interface Option {
  definition: string;
  isCorrect: boolean;
  word: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateOptions(currentWord: VocabularyWord, allWords: VocabularyWord[]): Option[] {
  // Get wrong options from other words
  const otherWords = allWords.filter((w) => w.id !== currentWord.id);
  const shuffledOthers = shuffleArray(otherWords).slice(0, 3);

  const options: Option[] = [
    { definition: currentWord.definition, isCorrect: true, word: currentWord.word },
    ...shuffledOthers.map((w) => ({
      definition: w.definition,
      isCorrect: false,
      word: w.word,
    })),
  ];

  return shuffleArray(options);
}

const QuizOptions = ({ currentWord, allWords, cardState, onAnswer }: QuizOptionsProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Generate new options when word changes
  useEffect(() => {
    setOptions(generateOptions(currentWord, allWords));
    setSelectedIndex(null);
    setShowResult(false);
  }, [currentWord.id, allWords]);

  const handleSelect = useCallback(
    (index: number) => {
      if (showResult) return;

      setSelectedIndex(index);
      setShowResult(true);

      const isCorrect = options[index].isCorrect;

      // Delay before moving to next card
      setTimeout(() => {
        // Map to SM-2 quality: correct = 5 (Perfect), wrong = 1 (Wrong)
        onAnswer(isCorrect ? 5 : 1);
      }, 1500);
    },
    [options, showResult, onAnswer]
  );

  // Keyboard shortcuts (1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) return;
      
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 4 && keyNum <= options.length) {
        handleSelect(keyNum - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, showResult, handleSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Word Display */}
      <div className="bg-card rounded-lg card-shadow p-8 md:p-12 mb-6">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4 block text-center">
          {currentWord.partOfSpeech}
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary tracking-tight text-center">
          {currentWord.word}
        </h2>
        <p className="mt-6 text-center text-muted-foreground">
          Choose the correct definition
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = option.isCorrect;

          let bgClass = "bg-card hover:bg-secondary/50";
          let borderClass = "border-transparent";
          let iconElement = null;
          let animationClass = "";

          if (showResult) {
            if (isCorrectOption) {
              bgClass = "bg-success/10";
              borderClass = "border-success";
              iconElement = <Check className="w-5 h-5 text-success" />;
              animationClass = "animate-success-ripple";
            } else if (isSelected && !isCorrectOption) {
              bgClass = "bg-destructive/10";
              borderClass = "border-destructive";
              iconElement = <X className="w-5 h-5 text-destructive" />;
              animationClass = "animate-error-shake";
            }
          }

          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${bgClass} ${borderClass} ${animationClass}
                ${!showResult ? "cursor-pointer" : "cursor-default"}
                card-shadow
              `}
              whileHover={!showResult ? { scale: 1.01, x: 4 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <motion.span 
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {index + 1}
                </motion.span>
                <p className="flex-1 text-foreground leading-relaxed">
                  {option.definition}
                </p>
                <AnimatePresence>
                  {showResult && iconElement && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="flex-shrink-0"
                    >
                      {iconElement}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center"
          >
            {options[selectedIndex!]?.isCorrect ? (
              <p className="text-success font-medium">Correct! Moving to next word...</p>
            ) : (
              <p className="text-destructive font-medium">
                Incorrect. The right answer was highlighted.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {!showResult && (
        <p className="text-center text-xs text-muted-foreground mt-6">
          Press <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">1-4</kbd> to select
        </p>
      )}
    </motion.div>
  );
};

export default QuizOptions;
