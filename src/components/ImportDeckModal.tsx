import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { parseCSV, createDeck, saveDeck, addWordToDeck, CSVParseResult } from "@/lib/deckManager";

interface ImportDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}

type Step = "upload" | "preview" | "success";

const ImportDeckModal = ({ isOpen, onClose, onImported }: ImportDeckModalProps) => {
  const [step, setStep] = useState<Step>("upload");
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseCSV(content);
      setParseResult(result);
      
      // Auto-fill deck name from filename
      const nameFromFile = file.name.replace(".csv", "").replace(/[-_]/g, " ");
      setDeckName(nameFromFile.charAt(0).toUpperCase() + nameFromFile.slice(1));
      
      if (result.success) {
        setStep("preview");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImport = () => {
    if (!parseResult?.success || !deckName.trim()) return;

    const newDeck = createDeck(deckName.trim(), deckDescription.trim());
    saveDeck(newDeck);

    for (const word of parseResult.words) {
      addWordToDeck(newDeck.id, word);
    }

    setStep("success");
    setTimeout(() => {
      onImported();
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep("upload");
    setDeckName("");
    setDeckDescription("");
    setParseResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-xl card-shadow max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Import Vocabulary Deck
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "upload" && (
              <>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors
                    ${isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-1">
                    Drop your CSV file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>

                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    CSV Format
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your CSV should have these columns (in order):
                  </p>
                  <code className="block text-xs bg-background p-2 rounded font-mono text-foreground">
                    word, definition, partOfSpeech, example, synonyms
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Only word and definition are required. Separate synonyms with semicolons.
                  </p>
                </div>
              </>
            )}

            {step === "preview" && parseResult && (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Deck Name *
                    </label>
                    <input
                      type="text"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      placeholder="My Vocabulary Deck"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      value={deckDescription}
                      onChange={(e) => setDeckDescription(e.target.value)}
                      placeholder="A short description of this deck"
                      className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>
                </div>

                <div className="bg-success/10 text-success rounded-lg p-3 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Found {parseResult.words.length} words to import
                  </span>
                </div>

                {parseResult.errors.length > 0 && (
                  <div className="bg-destructive/10 text-destructive rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {parseResult.errors.length} rows skipped
                      </span>
                    </div>
                    <ul className="text-xs space-y-1 ml-7">
                      {parseResult.errors.slice(0, 3).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                      {parseResult.errors.length > 3 && (
                        <li>...and {parseResult.errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-foreground">Word</th>
                        <th className="text-left px-3 py-2 font-medium text-foreground">Definition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.words.slice(0, 10).map((word, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-3 py-2 font-medium text-foreground">{word.word}</td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[200px]">
                            {word.definition}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parseResult.words.length > 10 && (
                    <div className="text-center py-2 text-xs text-muted-foreground bg-secondary">
                      ...and {parseResult.words.length - 10} more words
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("upload")}
                    className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!deckName.trim()}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import {parseResult.words.length} Words
                  </button>
                </div>
              </>
            )}

            {step === "success" && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </motion.div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Deck Imported!
                </h3>
                <p className="text-muted-foreground">
                  Your vocabulary deck is ready to study
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImportDeckModal;
