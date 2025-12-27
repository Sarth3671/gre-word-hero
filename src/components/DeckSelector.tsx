import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, Download, Library } from "lucide-react";
import { Deck, deleteDeck, exportDeckToCSV } from "@/lib/deckManager";

interface DeckSelectorProps {
  decks: Deck[];
  activeDeck: Deck;
  onSelectDeck: (deckId: string) => void;
  onCreateDeck: () => void;
  onImportDeck: () => void;
  onDeckDeleted: () => void;
}

const DeckSelector = ({
  decks,
  activeDeck,
  onSelectDeck,
  onCreateDeck,
  onImportDeck,
  onDeckDeleted,
}: DeckSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this deck? This cannot be undone.")) {
      deleteDeck(deckId);
      onDeckDeleted();
    }
  };

  const handleExport = (e: React.MouseEvent, deck: Deck) => {
    e.stopPropagation();
    const csv = exportDeckToCSV(deck);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg card-shadow border border-border hover:border-primary/30 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Library className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground max-w-[200px] truncate">
          {activeDeck.name}
        </span>
        <span className="text-xs text-muted-foreground">
          ({activeDeck.words.length} words)
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-80 bg-card rounded-lg card-shadow border border-border z-50 overflow-hidden"
            >
              <div className="p-2 border-b border-border">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCreateDeck();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Deck
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onImportDeck();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Import from CSV
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {decks.map((deck) => (
                  <div
                    key={deck.id}
                    onClick={() => {
                      onSelectDeck(deck.id);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
                      ${deck.id === activeDeck.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary text-foreground"
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{deck.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {deck.words.length} words
                        {deck.isDefault && " • Default"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => handleExport(e, deck)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                        title="Export as CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {!deck.isDefault && (
                        <button
                          onClick={(e) => handleDelete(e, deck.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                          title="Delete deck"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeckSelector;
