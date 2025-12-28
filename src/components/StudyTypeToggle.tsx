import { motion } from "framer-motion";
import { BookOpen, ListChecks } from "lucide-react";

export type StudyType = "flashcard" | "quiz";

interface StudyTypeToggleProps {
  type: StudyType;
  onChange: (type: StudyType) => void;
}

const StudyTypeToggle = ({ type, onChange }: StudyTypeToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-secondary rounded-lg">
      <motion.button
        onClick={() => onChange("flashcard")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
          transition-colors duration-200
          ${type === "flashcard" 
            ? "bg-card text-foreground card-shadow" 
            : "text-muted-foreground hover:text-foreground"
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <BookOpen className="w-4 h-4" />
        Flashcard
      </motion.button>

      <motion.button
        onClick={() => onChange("quiz")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
          transition-colors duration-200
          ${type === "quiz" 
            ? "bg-card text-foreground card-shadow" 
            : "text-muted-foreground hover:text-foreground"
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <ListChecks className="w-4 h-4" />
        Quiz
      </motion.button>
    </div>
  );
};

export default StudyTypeToggle;
