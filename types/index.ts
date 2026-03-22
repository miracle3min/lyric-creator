export type Provider = "gemini" | "groq" | "mistral";

export type GenerateMode = "single" | "multi";

export interface SongRequest {
  title: string;
  genre: string;
  mood: string;
  language: "id" | "en";
  description: string;
  tempo?: string;
  vocalStyle?: string;
}

export interface SongResult {
  provider: Provider;
  lyrics: string;
  instruments: string;
  sunoPrompt: string;
  generatedAt: string;
}

export interface GenerateRequest {
  song: SongRequest;
  mode: GenerateMode;
  selectedProvider?: Provider;
}

export interface GenerateResponse {
  results: SongResult[];
  error?: string;
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  gemini: "Google Gemini",
  groq: "Groq (LLaMA)",
  mistral: "Mistral AI",
};

export const PROVIDER_COLORS: Record<Provider, string> = {
  gemini: "from-blue-500 to-cyan-500",
  groq: "from-orange-500 to-amber-500",
  mistral: "from-violet-500 to-purple-500",
};

export const GENRES = [
  "Pop", "Rock", "R&B", "Hip-Hop", "Jazz", "Blues", "Country",
  "EDM", "Classical", "Reggae", "Metal", "Folk", "Indie",
  "Funk", "Soul", "Dangdut", "Keroncong", "Campursari",
];

export const MOODS = [
  "Happy", "Sad", "Energetic", "Chill", "Romantic", "Dark",
  "Nostalgic", "Epic", "Dreamy", "Angry", "Hopeful", "Melancholic",
];

export const TEMPOS = [
  "Slow (60-80 BPM)", "Medium (80-120 BPM)", "Fast (120-160 BPM)", "Very Fast (160+ BPM)",
];

export const VOCAL_STYLES = [
  "Male Vocal", "Female Vocal", "Duet", "Choir",
  "Whisper", "Raspy", "Falsetto", "No Vocal (Instrumental)",
];
