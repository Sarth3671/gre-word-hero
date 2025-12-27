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
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <motion.button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        whileHover={canGoPrevious ? { scale: 1.05 } : {}}
        whileTap={canGoPrevious ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={onShuffle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Shuffle className="w-4 h-4" />
        Shuffle
      </motion.button>

      <motion.button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        whileHover={canGoNext ? { scale: 1.05 } : {}}
        whileTap={canGoNext ? { scale: 0.95 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default NavigationButtons;
