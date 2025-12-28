import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import StreakDisplay from "./StreakDisplay";

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  currentStreak: number;
  longestStreak: number;
  hasStudiedToday: boolean;
}

const Header = ({ isDark, onThemeToggle, currentStreak, longestStreak, hasStudiedToday }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-4 relative z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground tracking-tight">
              GRE Vocabulary
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Master high-frequency words</p>
          </div>
        </motion.div>

        {/* Right side - Streak & Theme */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StreakDisplay 
            currentStreak={currentStreak} 
            longestStreak={longestStreak}
            hasStudiedToday={hasStudiedToday}
          />
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
