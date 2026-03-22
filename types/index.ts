export interface SongRequest {
  genre: string;
  mood: string;
  language: "id" | "en";
  description: string;
  tempo?: string;
  vocalStyle?: string;
  selectedInstruments: string[];
  customInstruments?: string;
}

export interface SongResult {
  title: string;
  lyrics: string;
  instruments: string;
  sunoPrompt: string;
  coverArtPrompt: string;
  generatedAt: string;
}

export interface GenerateRequest {
  song: SongRequest;
}

export interface GenerateResponse {
  result: SongResult;
  error?: string;
}

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

export const INSTRUMENTS = [
  "Acoustic Guitar", "Electric Guitar", "Bass Guitar", "Piano",
  "Keyboard/Synth", "Drums", "Violin", "Cello", "Saxophone",
  "Trumpet", "Flute", "Ukulele", "Harmonica", "Cajon",
  "Tabla", "Gamelan", "Kendang", "Suling", "Angklung",
  "Harp", "Organ", "Banjo", "Mandolin", "Sitar",
];
