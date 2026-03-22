import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, Provider, SongResult } from "@/types";
import { generateWithGemini } from "@/lib/providers/gemini";
import { generateWithGroq } from "@/lib/providers/groq";
import { generateWithMistral } from "@/lib/providers/mistral";

const providerFunctions: Record<
  Provider,
  (song: GenerateRequest["song"]) => Promise<any>
> = {
  gemini: generateWithGemini,
  groq: generateWithGroq,
  mistral: generateWithMistral,
};

async function generateFromProvider(
  provider: Provider,
  song: GenerateRequest["song"]
): Promise<SongResult> {
  const fn = providerFunctions[provider];
  const data = await fn(song);

  return {
    provider,
    lyrics: data.lyrics || "No lyrics generated",
    instruments: data.instruments || "No instrument details generated",
    sunoPrompt: data.sunoPrompt || data.suno_prompt || "No SUNO prompt generated",
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { song, mode, selectedProvider } = body;

    if (!song.title || !song.genre || !song.mood || !song.description) {
      return NextResponse.json(
        { error: "Missing required fields: title, genre, mood, description" },
        { status: 400 }
      );
    }

    let results: SongResult[] = [];

    if (mode === "single") {
      const provider = selectedProvider || "gemini";
      const result = await generateFromProvider(provider, song);
      results = [result];
    } else {
      // Multi mode: call all 3 providers in parallel
      const providers: Provider[] = ["gemini", "groq", "mistral"];
      const promises = providers.map(async (provider) => {
        try {
          return await generateFromProvider(provider, song);
        } catch (error: any) {
          return {
            provider,
            lyrics: `Error: ${error.message}`,
            instruments: `Error: ${error.message}`,
            sunoPrompt: `Error: ${error.message}`,
            generatedAt: new Date().toISOString(),
          } as SongResult;
        }
      });

      results = await Promise.all(promises);
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
