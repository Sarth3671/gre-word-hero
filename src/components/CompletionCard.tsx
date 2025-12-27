import { motion } from "framer-motion";
import { Trophy, RotateCcw, Sparkles } from "lucide-react";

interface CompletionCardProps {
  known: number;
  needPractice: number;
  total: number;
  onRestart: () => void;
  onReviewMissed: () => void;
}

const CompletionCard = ({
  known,
  needPractice,
  total,
  onRestart,
  onReviewMissed,
}: CompletionCardProps) => {
  const percentage = Math.round((known / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto bg-card rounded-lg card-shadow p-8 md:p-12 text-center"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
        <Trophy className="w-10 h-10 text-accent" />
      </div>

      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
        Session Complete!
      </h2>
      <p className="text-muted-foreground mb-8">
        You've reviewed all {total} words in this deck
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-secondary/50 rounded-lg p-4">
          <span className="block text-3xl font-bold text-foreground">{percentage}%</span>
          <span className="text-sm text-muted-foreground">Accuracy</span>
        </div>
        <div className="bg-success/10 rounded-lg p-4">
          <span className="block text-3xl font-bold text-success">{known}</span>
          <span className="text-sm text-muted-foreground">Known</span>
        </div>
        <div className="bg-destructive/10 rounded-lg p-4">
          <span className="block text-3xl font-bold text-destructive">{needPractice}</span>
          <span className="text-sm text-muted-foreground">To Review</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {needPractice > 0 && (
          <motion.button
            onClick={onReviewMissed}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors btn-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            Review Missed Words
          </motion.button>
        )}
        <motion.button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CompletionCard;
