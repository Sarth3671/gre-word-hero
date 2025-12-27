import { motion } from "framer-motion";

interface ProgressBarProps {
  known: number;
  needPractice: number;
  total: number;
  currentIndex: number;
}

const ProgressBar = ({ known, needPractice, total, currentIndex }: ProgressBarProps) => {
  const knownPercent = (known / total) * 100;
  const needPracticePercent = (needPractice / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          Card {currentIndex + 1} of {total}
        </span>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="font-medium text-foreground">{known}</span>
            <span className="text-muted-foreground">known</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="font-medium text-foreground">{needPractice}</span>
            <span className="text-muted-foreground">learning</span>
          </span>
        </div>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
        <motion.div
          className="h-full bg-success"
          initial={{ width: 0 }}
          animate={{ width: `${knownPercent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="h-full bg-destructive"
          initial={{ width: 0 }}
          animate={{ width: `${needPracticePercent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
