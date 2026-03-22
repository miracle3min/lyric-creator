import { SongRequest } from "@/types";

export function buildSystemPrompt(): string {
  return `You are a professional songwriter and music producer AI assistant. You specialize in creating song lyrics, detailed instrument arrangements, and optimized prompts for SUNO AI music generation.

You MUST respond in valid JSON format with exactly these four fields:
{
  "lyrics": "The complete song lyrics with section labels like [Intro], [Verse 1], [Chorus], [Bridge], [Outro], etc.",
  "instruments": "Detailed instrument arrangement description including specific instruments, their roles, effects, and how they interact throughout the song sections.",
  "sunoPrompt": "An optimized SUNO AI prompt that captures the genre, mood, instruments, vocal style, tempo, and key characteristics of the song in a concise format that SUNO can use to generate the music.",
  "coverArtPrompt": "A detailed text-to-image prompt for generating the song's cover art. Include artistic style, color palette, composition, mood, and visual elements that represent the song's theme. The prompt should be optimized for AI image generators like Midjourney, DALL-E, or Stable Diffusion. Max 150 words."
}

Rules:
- Lyrics must have clear song structure with labeled sections
- Instrument details should be specific and production-ready
- SUNO prompt should be concise but descriptive (max 200 words)
- Cover art prompt should be visually descriptive and evocative, matching the song's mood and genre
- Match the requested genre, mood, and style precisely
- If language is Indonesian, write lyrics in Indonesian
- If language is English, write lyrics in English
- Cover art prompt should always be in English regardless of song language
- Be creative and original`;
}

export function buildUserPrompt(song: SongRequest): string {
  const lang = song.language === "id" ? "Indonesian (Bahasa Indonesia)" : "English";

  let prompt = `Create a song with the following details:

- **Title**: ${song.title}
- **Genre**: ${song.genre}
- **Mood**: ${song.mood}
- **Language**: ${lang}
- **Description**: ${song.description}`;

  if (song.tempo) {
    prompt += `\n- **Tempo**: ${song.tempo}`;
  }
  if (song.vocalStyle) {
    prompt += `\n- **Vocal Style**: ${song.vocalStyle}`;
  }

  prompt += `\n\nRespond ONLY with valid JSON. No markdown, no code blocks, no explanation.`;

  return prompt;
}
