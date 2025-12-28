import { useState } from "react";
import { motion } from "framer-motion";
import { Quality, QUALITY_LABELS, CardState, calculateNextReview, formatInterval } from "@/lib/sm2";

interface QualityButtonsProps {
  cardState: CardState;
  onRate: (quality: Quality) => void;
  isFlipped: boolean;
}

const QUALITY_OPTIONS: Quality[] = [1, 2, 3, 4, 5];

const QUALITY_COLORS: Record<Quality, { bg: string; hover: string; text: string; glow: string }> = {
  0: { bg: "bg-destructive/10", hover: "hover:bg-destructive/20", text: "text-destructive", glow: "hsl(var(--destructive) / 0.4)" },
  1: { bg: "bg-destructive/10", hover: "hover:bg-destructive/20", text: "text-destructive", glow: "hsl(var(--destructive) / 0.4)" },
  2: { bg: "bg-orange-500/10", hover: "hover:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", glow: "rgba(249, 115, 22, 0.4)" },
  3: { bg: "bg-amber-500/10", hover: "hover:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400", glow: "rgba(245, 158, 11, 0.4)" },
  4: { bg: "bg-emerald-500/10", hover: "hover:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", glow: "rgba(16, 185, 129, 0.4)" },
  5: { bg: "bg-success/10", hover: "hover:bg-success/20", text: "text-success", glow: "hsl(var(--success) / 0.4)" },
};

const QualityButtons = ({ cardState, onRate, isFlipped }: QualityButtonsProps) => {
  const [clickedButton, setClickedButton] = useState<Quality | null>(null);

  const getNextInterval = (quality: Quality): string => {
    const nextState = calculateNextReview(cardState, quality);
    return formatInterval(nextState.interval);
  };

  const handleClick = (quality: Quality) => {
    setClickedButton(quality);
    setTimeout(() => setClickedButton(null), 300);
    onRate(quality);
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
          const isClicked = clickedButton === quality;

          return (
            <motion.button
              key={quality}
              onClick={() => handleClick(quality)}
              disabled={!isFlipped}
              className={`
                flex flex-col items-center px-4 py-3 rounded-lg border border-transparent
                ${colors.bg} ${colors.hover} 
                transition-all duration-200 
                disabled:opacity-40 disabled:cursor-not-allowed
                min-w-[80px] relative overflow-hidden
              `}
              whileHover={isFlipped ? { scale: 1.05, y: -2 } : {}}
              whileTap={isFlipped ? { scale: 0.92 } : {}}
              animate={isClicked ? {
                scale: [1, 1.1, 1],
                boxShadow: [`0 0 0 0 ${colors.glow}`, `0 0 30px 10px ${colors.glow}`, `0 0 0 0 ${colors.glow}`],
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Ripple effect */}
              {isClicked && (
                <motion.div
                  className="absolute inset-0 bg-current opacity-20 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
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
