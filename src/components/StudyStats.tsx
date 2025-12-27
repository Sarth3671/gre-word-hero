import { motion } from "framer-motion";
import { BookOpen, Clock, GraduationCap, Sparkles } from "lucide-react";

interface StudyStatsProps {
  stats: {
    total: number;
    due: number;
    new: number;
    learning: number;
    mastered: number;
  };
}

const StudyStats = ({ stats }: StudyStatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-6"
    >
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card rounded-lg p-3 card-shadow text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <span className="block text-xl font-bold text-foreground">{stats.due}</span>
          <span className="text-xs text-muted-foreground">Due</span>
        </div>

        <div className="bg-card rounded-lg p-3 card-shadow text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="block text-xl font-bold text-foreground">{stats.new}</span>
          <span className="text-xs text-muted-foreground">New</span>
        </div>

        <div className="bg-card rounded-lg p-3 card-shadow text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-amber-500/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <span className="block text-xl font-bold text-foreground">{stats.learning}</span>
          <span className="text-xs text-muted-foreground">Learning</span>
        </div>

        <div className="bg-card rounded-lg p-3 card-shadow text-center">
          <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-success/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-success" />
          </div>
          <span className="block text-xl font-bold text-foreground">{stats.mastered}</span>
          <span className="text-xs text-muted-foreground">Mastered</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyStats;
