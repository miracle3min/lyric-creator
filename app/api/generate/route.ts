import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, Provider, SongResult } from "@/types";
import { generateWithGemini } from "@/lib/providers/gemini";
import { generateWithGroq } from "@/lib/providers/groq";
import { generateWithMistral } from "@/lib/providers/mistral";
import { logger } from "@/lib/logger";

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
  const startTime = Date.now();

  try {
    const fn = providerFunctions[provider];
    const data = await fn(song);
    const duration = Date.now() - startTime;

    logger.info(`Generated in ${duration}ms`, `Provider:${provider}`);

    return {
      provider,
      lyrics: data.lyrics || "No lyrics generated",
      instruments: data.instruments || "No instrument details generated",
      sunoPrompt: data.sunoPrompt || data.suno_prompt || "No SUNO prompt generated",
      coverArtPrompt: data.coverArtPrompt || data.cover_art_prompt || "No cover art prompt generated",
      generatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error(
      `Failed after ${duration}ms: ${error.message}`,
      `Provider:${provider}`,
      { stack: error.stack }
    );
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const body: GenerateRequest = await req.json();
    const { song, mode, selectedProvider } = body;

    logger.info(
      `New request [${requestId}]: mode=${mode}, genre=${song.genre}, mood=${song.mood}`,
      "API"
    );

    if (!song.title || !song.genre || !song.mood || !song.description) {
      logger.warn(`Bad request [${requestId}]: missing required fields`, "API");
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
      const providers: Provider[] = ["gemini", "groq", "mistral"];
      const settled = await Promise.allSettled(
        providers.map((provider) => generateFromProvider(provider, song))
      );

      results = settled.map((result, i) => {
        if (result.status === "fulfilled") {
          return result.value;
        }

        const errorMsg = result.reason?.message || "Unknown error";
        logger.error(
          `Provider ${providers[i]} failed in multi mode [${requestId}]: ${errorMsg}`,
          "API"
        );

        return {
          provider: providers[i],
          lyrics: `Error: ${errorMsg}`,
          instruments: `Error: ${errorMsg}`,
          sunoPrompt: `Error: ${errorMsg}`,
          coverArtPrompt: `Error: ${errorMsg}`,
          generatedAt: new Date().toISOString(),
        } as SongResult;
      });
    }

    const successCount = results.filter(
      (r) => !r.lyrics.startsWith("Error:")
    ).length;
    logger.info(
      `Request [${requestId}] complete: ${successCount}/${results.length} succeeded`,
      "API"
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    logger.error(`Request [${requestId}] fatal: ${error.message}`, "API", {
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
