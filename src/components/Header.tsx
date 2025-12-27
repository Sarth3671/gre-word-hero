import { BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
            GRE Vocabulary
          </h1>
          <p className="text-xs text-muted-foreground">Master high-frequency words</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
