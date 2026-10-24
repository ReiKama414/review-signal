export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface SentimentEvidence {
  token: string;
  weight: number;
  type: 'positive_word' | 'negative_word' | 'negation' | 'intensifier';
  explanation: string;
}

export interface SentimentAnalysisResult {
  score: number; // -1.0 to 1.0
  label: SentimentType;
  method: 'rule_lexicon'; // Clearly distinguishes rule-based from ML
  evidence: SentimentEvidence[];
  positiveScore: number;
  negativeScore: number;
  summary: string;
}

export interface Review {
  id: string;
  rating: number; // 1 to 5
  content: string;
  title?: string;
  date: string; // ISO date string YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  author?: string;
  source?: string;
  category: string; // Issue category (e.g., '功能異常', '物流配送')
  sentiment: SentimentAnalysisResult;
  tags: string[]; // Manual researcher tags
  notes?: string; // Researcher annotation notes
  tokens?: string[]; // Tokenized words
  device?: string;
  version?: string;
  helpfulCount?: number;
}

export interface FilterState {
  searchQuery: string;
  ratings: number[]; // e.g. [1, 2]
  sentiment: SentimentType[];
  categories: string[];
  tags: string[];
  dateStart: string | null;
  dateEnd: string | null;
  minWordCount: number;
  hasNotesOnly: boolean;
  selectedToken?: string | null;
  selectedNgram?: string | null;
  sortBy: 'date_desc' | 'date_asc' | 'rating_asc' | 'rating_desc' | 'sentiment_asc' | 'sentiment_desc';
}

export interface TokenStat {
  word: string;
  count: number;
  reviewCount: number; // In how many distinct reviews this appears
  percentage: number;
  avgRating: number;
  sentimentScore: number; // average sentiment when this word appears
  ngramType: 1 | 2 | 3;
}

export interface CategorySummary {
  category: string;
  count: number;
  percentage: number;
  avgRating: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  sampleReviews: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface RatingStats {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  total: number;
  average: number;
  median: number;
  csat: number; // % of 4-5 stars
  npsScore: number; // (% promoters 4-5 - % detractors 1-2)
}

export interface TrendPoint {
  date: string;
  label: string; // Formatted date
  count: number;
  avgRating: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
}

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: string;
  count: number;
  reviews: Omit<Review, 'sentiment' | 'tokens'>[];
}
