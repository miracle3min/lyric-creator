import { NextRequest, NextResponse } from "next/server";
import { initDb, getGenerations, getGenerationById } from "@/lib/db";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/auth/server";

let dbInitialized = false;

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Lazy-init DB
    if (!dbInitialized) {
      try {
        await initDb();
        dbInitialized = true;
      } catch (e: any) {
        logger.warn(`DB init skipped: ${e.message}`, "HISTORY");
      }
    }

    // Get current user
    let userId: string | undefined;
    try {
      const { data: session } = await auth.getSession({ headers: req.headers });
      if (session?.user) {
        userId = session.user.id;
      }
    } catch (e) {
      // Non-blocking
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const row = await getGenerationById(Number(id));
      if (!row) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ generation: row });
    }

    const limit = Math.min(Number(searchParams.get("limit") || 20), 100);
    const rows = await getGenerations(limit, userId);

    return NextResponse.json({ generations: rows, count: rows.length });
  } catch (error: any) {
    logger.error(`History error: ${error.message}`, "HISTORY");
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
