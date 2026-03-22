import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, SongResult } from "@/types";
import { generateWithGemini } from "@/lib/providers/gemini";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const body: GenerateRequest = await req.json();
    const { song } = body;

    logger.info(
      `New request [${requestId}]: genre=${song.genre}, mood=${song.mood}`,
      "API"
    );

    if (!song.genre || !song.mood || !song.description) {
      logger.warn(`Bad request [${requestId}]: missing required fields`, "API");
      return NextResponse.json(
        { error: "Missing required fields: genre, mood, description" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const data = await generateWithGemini(song);
    const duration = Date.now() - startTime;

    logger.info(`Request [${requestId}] completed in ${duration}ms`, "API");

    const result: SongResult = {
      title: data.title || "Untitled",
      lyrics: data.lyrics || "No lyrics generated",
      instruments: data.instruments || "No instrument details generated",
      sunoPrompt: data.sunoPrompt || data.suno_prompt || "No SUNO prompt generated",
      coverArtPrompt: data.coverArtPrompt || data.cover_art_prompt || "No cover art prompt generated",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ result });
  } catch (error: any) {
    logger.error(`Request [${requestId}] failed: ${error.message}`, "API", {
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
