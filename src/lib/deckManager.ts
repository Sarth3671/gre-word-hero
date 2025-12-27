import { VocabularyWord, vocabularyDeck } from "@/data/vocabulary";

export interface Deck {
  id: string;
  name: string;
  description: string;
  words: VocabularyWord[];
  isDefault: boolean;
  createdAt: string;
}

const DECKS_STORAGE_KEY = "gre-vocab-decks";
const ACTIVE_DECK_KEY = "gre-vocab-active-deck";
const DEFAULT_DECK_ID = "default-gre";

export function createDefaultDeck(): Deck {
  return {
    id: DEFAULT_DECK_ID,
    name: "GRE High-Frequency",
    description: "Essential GRE vocabulary words",
    words: vocabularyDeck,
    isDefault: true,
    createdAt: new Date().toISOString(),
  };
}

export function getAllDecks(): Deck[] {
  const stored = localStorage.getItem(DECKS_STORAGE_KEY);
  if (stored) {
    try {
      const decks = JSON.parse(stored) as Deck[];
      // Ensure default deck exists
      if (!decks.find((d) => d.id === DEFAULT_DECK_ID)) {
        decks.unshift(createDefaultDeck());
      }
      return decks;
    } catch (e) {
      console.error("Failed to parse decks:", e);
    }
  }
  return [createDefaultDeck()];
}

export function saveDeck(deck: Deck): void {
  const decks = getAllDecks();
  const existingIndex = decks.findIndex((d) => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = deck;
  } else {
    decks.push(deck);
  }
  
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
}

export function deleteDeck(deckId: string): boolean {
  if (deckId === DEFAULT_DECK_ID) {
    return false; // Cannot delete default deck
  }
  
  const decks = getAllDecks().filter((d) => d.id !== deckId);
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  
  // If active deck was deleted, switch to default
  if (getActiveDeckId() === deckId) {
    setActiveDeckId(DEFAULT_DECK_ID);
  }
  
  return true;
}

export function getActiveDeckId(): string {
  return localStorage.getItem(ACTIVE_DECK_KEY) || DEFAULT_DECK_ID;
}

export function setActiveDeckId(deckId: string): void {
  localStorage.setItem(ACTIVE_DECK_KEY, deckId);
}

export function getActiveDeck(): Deck {
  const activeDeckId = getActiveDeckId();
  const decks = getAllDecks();
  return decks.find((d) => d.id === activeDeckId) || createDefaultDeck();
}

export function generateWordId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function createDeck(name: string, description: string): Deck {
  return {
    id: `deck-${Date.now()}`,
    name,
    description,
    words: [],
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
}

export function addWordToDeck(deckId: string, word: Omit<VocabularyWord, "id">): VocabularyWord {
  const decks = getAllDecks();
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  
  if (deckIndex < 0) {
    throw new Error("Deck not found");
  }
  
  const newWord: VocabularyWord = {
    ...word,
    id: generateWordId(),
  };
  
  decks[deckIndex].words.push(newWord);
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  
  return newWord;
}

export function removeWordFromDeck(deckId: string, wordId: number): void {
  const decks = getAllDecks();
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  
  if (deckIndex >= 0) {
    decks[deckIndex].words = decks[deckIndex].words.filter((w) => w.id !== wordId);
    localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
  }
}

export interface CSVParseResult {
  success: boolean;
  words: VocabularyWord[];
  errors: string[];
}

export function parseCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.trim().split("\n");
  const words: VocabularyWord[] = [];
  const errors: string[] = [];
  
  // Detect if first line is a header
  const firstLine = lines[0]?.toLowerCase() || "";
  const hasHeader = firstLine.includes("word") || firstLine.includes("definition");
  const startIndex = hasHeader ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handles quoted fields)
    const fields = parseCSVLine(line);
    
    if (fields.length < 2) {
      errors.push(`Line ${i + 1}: Not enough fields (need at least word and definition)`);
      continue;
    }
    
    const word = fields[0]?.trim();
    const definition = fields[1]?.trim();
    
    if (!word || !definition) {
      errors.push(`Line ${i + 1}: Missing word or definition`);
      continue;
    }
    
    const partOfSpeech = fields[2]?.trim() || "noun";
    const example = fields[3]?.trim() || `The word "${word}" is commonly used in academic contexts.`;
    const synonymsStr = fields[4]?.trim() || "";
    const synonyms = synonymsStr ? synonymsStr.split(";").map((s) => s.trim()).filter(Boolean) : [];
    
    words.push({
      id: generateWordId() + i,
      word,
      partOfSpeech,
      definition,
      example,
      synonyms,
    });
  }
  
  return {
    success: words.length > 0,
    words,
    errors,
  };
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  fields.push(current);
  return fields;
}

export function exportDeckToCSV(deck: Deck): string {
  const headers = ["word", "definition", "partOfSpeech", "example", "synonyms"];
  const lines = [headers.join(",")];
  
  for (const word of deck.words) {
    const fields = [
      `"${word.word.replace(/"/g, '""')}"`,
      `"${word.definition.replace(/"/g, '""')}"`,
      `"${word.partOfSpeech.replace(/"/g, '""')}"`,
      `"${word.example.replace(/"/g, '""')}"`,
      `"${word.synonyms.join(";").replace(/"/g, '""')}"`,
    ];
    lines.push(fields.join(","));
  }
  
  return lines.join("\n");
}
