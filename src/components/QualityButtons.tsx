import { motion } from "framer-motion";
import { Quality, QUALITY_LABELS, CardState, calculateNextReview, formatInterval } from "@/lib/sm2";

interface QualityButtonsProps {
  cardState: CardState;
  onRate: (quality: Quality) => void;
  isFlipped: boolean;
}

const QUALITY_OPTIONS: Quality[] = [1, 2, 3, 4, 5];

const QUALITY_COLORS: Record<Quality, { bg: string; hover: string; text: string }> = {
  0: { bg: "bg-destructive/10", hover: "hover:bg-destructive/20", text: "text-destructive" },
  1: { bg: "bg-destructive/10", hover: "hover:bg-destructive/20", text: "text-destructive" },
  2: { bg: "bg-orange-500/10", hover: "hover:bg-orange-500/20", text: "text-orange-600" },
  3: { bg: "bg-amber-500/10", hover: "hover:bg-amber-500/20", text: "text-amber-600" },
  4: { bg: "bg-emerald-500/10", hover: "hover:bg-emerald-500/20", text: "text-emerald-600" },
  5: { bg: "bg-success/10", hover: "hover:bg-success/20", text: "text-success" },
};

const QualityButtons = ({ cardState, onRate, isFlipped }: QualityButtonsProps) => {
  const getNextInterval = (quality: Quality): string => {
    const nextState = calculateNextReview(cardState, quality);
    return formatInterval(nextState.interval);
  };

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isFlipped ? 1 : 0.3, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-center text-sm text-muted-foreground mb-4">
        How well did you know this word?
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-2">
        {QUALITY_OPTIONS.map((quality) => {
          const colors = QUALITY_COLORS[quality];
          const label = QUALITY_LABELS[quality];
          const nextInterval = getNextInterval(quality);

          return (
            <motion.button
              key={quality}
              onClick={() => onRate(quality)}
              disabled={!isFlipped}
              className={`
                flex flex-col items-center px-4 py-3 rounded-lg border border-transparent
                ${colors.bg} ${colors.hover} 
                transition-all duration-200 
                disabled:opacity-40 disabled:cursor-not-allowed
                min-w-[80px]
              `}
              whileHover={isFlipped ? { scale: 1.05 } : {}}
              whileTap={isFlipped ? { scale: 0.95 } : {}}
            >
              <span className={`text-sm font-semibold ${colors.text}`}>
                {label.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {nextInterval}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Press <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">1-5</kbd> to rate
      </p>
    </motion.div>
  );
};

export default QualityButtons;
