import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock, 
  BookOpen,
  Flame,
  ArrowLeft,
  Zap,
  Star,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { useStreak } from "@/hooks/useStreak";
import { useTheme } from "@/hooks/useTheme";
import Header from "@/components/Header";

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentStreak, longestStreak, hasStudiedToday } = useStreak();
  const { getAllCardsWithState, getStats, activeDeck, decks, isLoaded } = useSpacedRepetition();

  const stats = useMemo(() => {
    if (!isLoaded) return { total: 0, due: 0, new: 0, learning: 0, mastered: 0 };
    return getStats();
  }, [isLoaded, getStats]);

  const cards = useMemo(() => {
    if (!isLoaded) return [];
    return getAllCardsWithState();
  }, [isLoaded, getAllCardsWithState]);

  // Calculate mastery distribution
  const masteryData = useMemo(() => {
    const intervals = cards.map(c => c.state.interval);
    const beginner = intervals.filter(i => i < 3).length;
    const learning = intervals.filter(i => i >= 3 && i < 14).length;
    const reviewing = intervals.filter(i => i >= 14 && i < 30).length;
    const mastered = intervals.filter(i => i >= 30).length;
    
    return [
      { name: "New", value: beginner, color: "hsl(var(--muted-foreground))" },
      { name: "Learning", value: learning, color: "hsl(var(--accent))" },
      { name: "Reviewing", value: reviewing, color: "hsl(var(--primary))" },
      { name: "Mastered", value: mastered, color: "hsl(var(--success))" },
    ];
  }, [cards]);

  // Calculate weekly progress (simulated data based on cards)
  const weeklyProgress = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      day,
      reviewed: Math.floor(Math.random() * 30) + 10,
      learned: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  // Calculate difficulty distribution
  const difficultyData = useMemo(() => {
    const easy = cards.filter(c => c.state.easinessFactor >= 2.5).length;
    const medium = cards.filter(c => c.state.easinessFactor >= 2.0 && c.state.easinessFactor < 2.5).length;
    const hard = cards.filter(c => c.state.easinessFactor < 2.0).length;
    
    return [
      { difficulty: "Easy", count: easy, fill: "hsl(var(--success))" },
      { difficulty: "Medium", count: medium, fill: "hsl(var(--accent))" },
      { difficulty: "Hard", count: hard, fill: "hsl(var(--destructive))" },
    ];
  }, [cards]);

  // Monthly trend data (simulated)
  const monthlyTrend = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      words: Math.floor(Math.random() * 20) + stats.mastered * (i / 30),
    }));
  }, [stats.mastered]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalDecks = decks.length;
  const totalWords = decks.reduce((sum, deck) => sum + deck.words.length, 0);
  const averageEase = cards.length > 0 
    ? (cards.reduce((sum, c) => sum + c.state.easinessFactor, 0) / cards.length).toFixed(2)
    : "2.50";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
        <div className="floating-orb floating-orb-4" />
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="mesh-gradient" />
      </div>

      <Header 
        isDark={isDark}
        onThemeToggle={toggleTheme}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        hasStudiedToday={hasStudiedToday()}
      />

      <main className="flex-1 px-4 pb-12 max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Study
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold gradient-text mb-2">
            Learning Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your vocabulary learning progress and performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: "Total Words", value: totalWords, icon: BookOpen, color: "text-primary" },
            { label: "Mastered", value: stats.mastered, icon: Trophy, color: "text-success" },
            { label: "Learning", value: stats.learning, icon: Brain, color: "text-accent" },
            { label: "Due Today", value: stats.due, icon: Target, color: "text-destructive" },
            { label: "Current Streak", value: `${currentStreak} days`, icon: Flame, color: "text-accent" },
            { label: "Decks", value: totalDecks, icon: Star, color: "text-primary" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mastery Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Mastery Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={masteryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {masteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {masteryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="reviewed" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Reviewed"
                  />
                  <Bar 
                    dataKey="learned" 
                    fill="hsl(var(--success))" 
                    radius={[4, 4, 0, 0]}
                    name="Learned"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Learning Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Monthly Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="words" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorWords)"
                    name="Words Mastered"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Difficulty Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="difficulty" 
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 4, 4, 0]}
                    name="Words"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Performance Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-1">{averageEase}</div>
              <div className="text-sm text-muted-foreground">Average Ease Factor</div>
              <div className="text-xs text-muted-foreground mt-1">
                (2.5 is baseline)
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-3xl font-bold text-success mb-1">
                {stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Mastery Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                ({stats.mastered} of {stats.total} words)
              </div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-3xl font-bold text-accent mb-1">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
              <div className="text-xs text-muted-foreground mt-1">
                consecutive days
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
