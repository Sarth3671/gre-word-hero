import { BookOpen, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import StreakDisplay from "./StreakDisplay";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  currentStreak: number;
  longestStreak: number;
  hasStudiedToday: boolean;
}

const Header = ({ isDark, onThemeToggle, currentStreak, longestStreak, hasStudiedToday }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-4 relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-3">
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
          </Link>
        </motion.div>

        {/* Right side - Navigation, Streak & Theme */}
        <motion.div 
          className="flex items-center gap-2 sm:gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Dashboard Link */}
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>

          <StreakDisplay 
            currentStreak={currentStreak} 
            longestStreak={longestStreak}
            hasStudiedToday={hasStudiedToday}
          />

          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

          {/* Auth Button */}
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
