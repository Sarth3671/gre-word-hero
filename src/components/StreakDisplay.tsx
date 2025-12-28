import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  hasStudiedToday: boolean;
}

const StreakDisplay = ({ currentStreak, longestStreak, hasStudiedToday }: StreakDisplayProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Current Streak */}
      <motion.div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          hasStudiedToday 
            ? "bg-accent/20 text-accent" 
            : "bg-muted text-muted-foreground"
        }`}
        animate={hasStudiedToday ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: hasStudiedToday ? Infinity : 0, repeatDelay: 3 }}
      >
        <Flame className={`w-4 h-4 ${hasStudiedToday ? "text-accent" : ""}`} />
        <span className="text-sm font-semibold">{currentStreak}</span>
        <span className="text-xs hidden sm:inline">day{currentStreak !== 1 ? "s" : ""}</span>
      </motion.div>

      {/* Longest Streak */}
      {longestStreak > 0 && (
        <motion.div
          className="flex items-center gap-1.5 px-2 py-1.5 text-muted-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Trophy className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium">{longestStreak}</span>
        </motion.div>
      )}
    </div>
  );
};

export default StreakDisplay;
