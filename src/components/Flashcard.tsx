import { motion } from "framer-motion";
import { VocabularyWord } from "@/data/vocabulary";

interface FlashcardProps {
  word: VocabularyWord;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard = ({ word, isFlipped, onFlip }: FlashcardProps) => {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div
          className="w-full min-h-[400px] bg-card rounded-lg card-shadow p-8 md:p-12 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
            {word.partOfSpeech}
          </span>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-primary tracking-tight">
            {word.word}
          </h2>
          <p className="mt-8 text-muted-foreground text-sm">
            Click to reveal definition
          </p>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full min-h-[400px] bg-card rounded-lg card-shadow p-8 md:p-12 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-2">
              {word.word}
            </h3>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
              {word.partOfSpeech}
            </span>
            
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
              {word.definition}
            </p>
            
            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <p className="text-muted-foreground italic leading-relaxed">
                "{word.example}"
              </p>
            </div>
            
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2 block">
                Synonyms
              </span>
              <div className="flex flex-wrap gap-2">
                {word.synonyms.map((synonym) => (
                  <span
                    key={synonym}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground text-sm mt-4">
            Click to see word
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
