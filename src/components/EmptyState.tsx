import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { StudyMode } from "./StudyModeSelector";

interface EmptyStateProps {
  mode: StudyMode;
  onSwitchMode: (mode: StudyMode) => void;
  hasDueCards: boolean;
  hasNewCards: boolean;
}

const EmptyState = ({ mode, onSwitchMode, hasDueCards, hasNewCards }: EmptyStateProps) => {
  const getMessage = () => {
    switch (mode) {
      case "due":
        return {
          icon: CheckCircle2,
          title: "All caught up!",
          description: "No cards are due for review right now. Great job staying on top of your studies!",
          suggestion: hasNewCards ? "new" : null,
          suggestionText: "Study new words",
        };
      case "new":
        return {
          icon: Sparkles,
          title: "All cards started!",
          description: "You've begun learning all the words in this deck.",
          suggestion: hasDueCards ? "due" : null,
          suggestionText: "Review due cards",
        };
      case "learning":
        return {
          icon: Clock,
          title: "No cards in learning",
          description: "Start studying new words to build your learning queue.",
          suggestion: hasNewCards ? "new" : hasDueCards ? "due" : null,
          suggestionText: hasNewCards ? "Study new words" : "Review due cards",
        };
      default:
        return {
          icon: CheckCircle2,
          title: "Deck is empty",
          description: "Add some words to get started.",
          suggestion: null,
          suggestionText: "",
        };
    }
  };

  const message = getMessage();
  const Icon = message.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-card rounded-lg card-shadow p-8 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-success" />
      </div>

      <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
        {message.title}
      </h2>
      <p className="text-muted-foreground mb-6">{message.description}</p>

      {message.suggestion && (
        <motion.button
          onClick={() => onSwitchMode(message.suggestion as StudyMode)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {message.suggestionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
