import { motion } from "framer-motion";
import { Clock, Sparkles, BookOpen, Library } from "lucide-react";

export type StudyMode = "due" | "new" | "all" | "learning";

interface StudyModeSelectorProps {
  mode: StudyMode;
  onChange: (mode: StudyMode) => void;
  counts: {
    due: number;
    new: number;
    learning: number;
    all: number;
  };
}

const MODES: { id: StudyMode; label: string; icon: typeof Clock }[] = [
  { id: "due", label: "Due", icon: Clock },
  { id: "new", label: "New", icon: Sparkles },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "all", label: "All", icon: Library },
];

const StudyModeSelector = ({ mode, onChange, counts }: StudyModeSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {MODES.map(({ id, label, icon: Icon }) => {
        const isActive = mode === id;
        const count = counts[id];

        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs
              ${isActive 
                ? "bg-primary-foreground/20 text-primary-foreground" 
                : "bg-foreground/10 text-foreground"
              }
            `}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default StudyModeSelector;
