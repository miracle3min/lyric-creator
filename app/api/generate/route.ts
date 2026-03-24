import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, SongResult } from "@/types";
import { generateWithGemini } from "@/lib/providers/gemini";
import { initDb, saveGeneration } from "@/lib/db";
import { getSession } from "@/lib/auth/server";
import { logger } from "@/lib/logger";


let dbInitialized = false;

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

    // Lazy-init DB tables
    if (!dbInitialized && process.env.DATABASE_URL) {
      try {
        await initDb();
        dbInitialized = true;
      } catch (e: any) {
        logger.warn(`DB init skipped: ${e.message}`, "API");
      }
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

    // Get current user from session
    let user: { id?: string; email?: string } | null = null;
    try {
      const session = await getSession();
      if (session?.user) {
        user = { id: session.user.id, email: session.user.email };
      }
    } catch (e) {
      // Session extraction is non-blocking
    }

    // Save to DB (non-blocking, won't fail the request)
    if (process.env.DATABASE_URL) {
      saveGeneration(song, result, "gemini", user).catch(() => {});
    }

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
