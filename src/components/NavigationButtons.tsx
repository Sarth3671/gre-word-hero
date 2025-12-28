import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const NavigationButtons = ({
  onPrevious,
  onNext,
  onShuffle,
  canGoPrevious,
  canGoNext,
}: NavigationButtonsProps) => {
  const [shuffleClicked, setShuffleClicked] = useState(false);

  const handleShuffle = () => {
    setShuffleClicked(true);
    setTimeout(() => setShuffleClicked(false), 500);
    onShuffle();
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <motion.button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
        whileHover={canGoPrevious ? { scale: 1.1, x: -2 } : {}}
        whileTap={canGoPrevious ? { scale: 0.9 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={handleShuffle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={shuffleClicked ? {
          rotate: [0, 10, -10, 10, 0],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={shuffleClicked ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shuffle className="w-4 h-4" />
        </motion.div>
        Shuffle
        
        {/* Shimmer effect on click */}
        {shuffleClicked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>

      <motion.button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        whileHover={canGoNext ? { scale: 1.1, x: 2 } : {}}
        whileTap={canGoNext ? { scale: 0.9 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default NavigationButtons;
