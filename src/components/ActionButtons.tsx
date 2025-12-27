import { motion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";

interface ActionButtonsProps {
  onKnown: () => void;
  onNeedPractice: () => void;
  isFlipped: boolean;
}

const ActionButtons = ({ onKnown, onNeedPractice, isFlipped }: ActionButtonsProps) => {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isFlipped ? 1 : 0.4, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={onNeedPractice}
        disabled={!isFlipped}
        className="group relative flex items-center gap-3 px-6 py-4 bg-card rounded-lg card-shadow border border-destructive/20 hover:border-destructive/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isFlipped ? { scale: 1.02 } : {}}
        whileTap={isFlipped ? { scale: 0.98 } : {}}
      >
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
          <RotateCcw className="w-5 h-5 text-destructive" />
        </div>
        <div className="text-left">
          <span className="block text-sm font-semibold text-foreground">Still Learning</span>
          <span className="block text-xs text-muted-foreground">Review again later</span>
        </div>
      </motion.button>

      <motion.button
        onClick={onKnown}
        disabled={!isFlipped}
        className="group relative flex items-center gap-3 px-6 py-4 bg-card rounded-lg card-shadow border border-success/20 hover:border-success/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isFlipped ? { scale: 1.02 } : {}}
        whileTap={isFlipped ? { scale: 0.98 } : {}}
      >
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
          <Check className="w-5 h-5 text-success" />
        </div>
        <div className="text-left">
          <span className="block text-sm font-semibold text-foreground">Got It!</span>
          <span className="block text-xs text-muted-foreground">Mark as known</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default ActionButtons;
