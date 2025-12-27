export interface VocabularyWord {
  id: number;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
}

export const vocabularyDeck: VocabularyWord[] = [
  {
    id: 1,
    word: "Ephemeral",
    partOfSpeech: "adjective",
    definition: "Lasting for a very short time; transitory",
    example: "The ephemeral beauty of cherry blossoms makes them all the more precious.",
    synonyms: ["fleeting", "transient", "momentary", "brief"]
  },
  {
    id: 2,
    word: "Sycophant",
    partOfSpeech: "noun",
    definition: "A person who acts obsequiously toward someone important to gain advantage",
    example: "The CEO surrounded himself with sycophants who never challenged his decisions.",
    synonyms: ["flatterer", "toady", "bootlicker", "yes-man"]
  },
  {
    id: 3,
    word: "Ubiquitous",
    partOfSpeech: "adjective",
    definition: "Present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society.",
    synonyms: ["omnipresent", "pervasive", "universal", "everywhere"]
  },
  {
    id: 4,
    word: "Taciturn",
    partOfSpeech: "adjective",
    definition: "Reserved or uncommunicative in speech; saying little",
    example: "The taciturn old man rarely spoke more than a few words at a time.",
    synonyms: ["reticent", "reserved", "silent", "uncommunicative"]
  },
  {
    id: 5,
    word: "Pulchritude",
    partOfSpeech: "noun",
    definition: "Beauty, especially of a physical nature",
    example: "The pulchritude of the alpine landscape left the hikers speechless.",
    synonyms: ["beauty", "loveliness", "attractiveness", "comeliness"]
  },
  {
    id: 6,
    word: "Obsequious",
    partOfSpeech: "adjective",
    definition: "Obedient or attentive to an excessive or servile degree",
    example: "His obsequious behavior toward the wealthy clients made his colleagues uncomfortable.",
    synonyms: ["servile", "submissive", "fawning", "sycophantic"]
  },
  {
    id: 7,
    word: "Mendacious",
    partOfSpeech: "adjective",
    definition: "Not telling the truth; lying",
    example: "The politician's mendacious statements were quickly fact-checked by journalists.",
    synonyms: ["untruthful", "deceitful", "dishonest", "lying"]
  },
  {
    id: 8,
    word: "Languid",
    partOfSpeech: "adjective",
    definition: "Displaying or having a disinclination for physical exertion or effort; slow and relaxed",
    example: "She spent a languid afternoon reading by the pool.",
    synonyms: ["leisurely", "unhurried", "relaxed", "slow"]
  },
  {
    id: 9,
    word: "Ineffable",
    partOfSpeech: "adjective",
    definition: "Too great or extreme to be expressed or described in words",
    example: "She felt an ineffable joy upon seeing her newborn child for the first time.",
    synonyms: ["indescribable", "inexpressible", "unspeakable", "unutterable"]
  },
  {
    id: 10,
    word: "Gregarious",
    partOfSpeech: "adjective",
    definition: "Fond of company; sociable",
    example: "His gregarious personality made him the life of every party.",
    synonyms: ["sociable", "outgoing", "friendly", "convivial"]
  },
  {
    id: 11,
    word: "Fastidious",
    partOfSpeech: "adjective",
    definition: "Very attentive to and concerned about accuracy and detail",
    example: "The fastidious editor caught every grammatical error in the manuscript.",
    synonyms: ["meticulous", "particular", "finicky", "scrupulous"]
  },
  {
    id: 12,
    word: "Enervate",
    partOfSpeech: "verb",
    definition: "To cause someone to feel drained of energy or vitality",
    example: "The long hike in the heat enervated even the most experienced climbers.",
    synonyms: ["exhaust", "tire", "fatigue", "weaken"]
  },
  {
    id: 13,
    word: "Dilettante",
    partOfSpeech: "noun",
    definition: "A person who cultivates an area of interest without real commitment or knowledge",
    example: "Critics dismissed him as a dilettante who dabbled in art without true understanding.",
    synonyms: ["amateur", "dabbler", "nonprofessional", "hobbyist"]
  },
  {
    id: 14,
    word: "Capricious",
    partOfSpeech: "adjective",
    definition: "Given to sudden and unaccountable changes of mood or behavior",
    example: "The capricious weather made it difficult to plan outdoor activities.",
    synonyms: ["fickle", "unpredictable", "changeable", "volatile"]
  },
  {
    id: 15,
    word: "Bellicose",
    partOfSpeech: "adjective",
    definition: "Demonstrating aggression and willingness to fight",
    example: "The bellicose rhetoric between the two nations raised fears of war.",
    synonyms: ["aggressive", "hostile", "warlike", "combative"]
  },
  {
    id: 16,
    word: "Ameliorate",
    partOfSpeech: "verb",
    definition: "To make something bad or unsatisfactory better",
    example: "The new policies were designed to ameliorate working conditions.",
    synonyms: ["improve", "better", "enhance", "alleviate"]
  },
  {
    id: 17,
    word: "Vacillate",
    partOfSpeech: "verb",
    definition: "To alternate or waver between different opinions or actions; be indecisive",
    example: "She vacillated between accepting the job offer and staying at her current position.",
    synonyms: ["waver", "hesitate", "oscillate", "fluctuate"]
  },
  {
    id: 18,
    word: "Querulous",
    partOfSpeech: "adjective",
    definition: "Complaining in a petulant or whining manner",
    example: "The querulous customer demanded to speak with the manager again.",
    synonyms: ["complaining", "whining", "peevish", "petulant"]
  },
  {
    id: 19,
    word: "Perfunctory",
    partOfSpeech: "adjective",
    definition: "Carried out with a minimum of effort or reflection",
    example: "He gave the report a perfunctory glance before signing off on it.",
    synonyms: ["cursory", "superficial", "hasty", "token"]
  },
  {
    id: 20,
    word: "Ostentatious",
    partOfSpeech: "adjective",
    definition: "Characterized by vulgar or pretentious display; designed to impress",
    example: "The ostentatious mansion was filled with expensive but tasteless decorations.",
    synonyms: ["showy", "flashy", "pretentious", "flamboyant"]
  }
];
