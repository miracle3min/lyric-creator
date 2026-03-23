import { NextRequest, NextResponse } from "next/server";
import { initDb, getGenerations, getGenerationById } from "@/lib/db";
import { logger } from "@/lib/logger";

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized && process.env.DATABASE_URL) {
    await initDb();
    dbInitialized = true;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    await ensureDb();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

    if (id) {
      const record = await getGenerationById(Number(id));
      if (!record) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ record });
    }

    const records = await getGenerations(limit);
    return NextResponse.json({ records, total: records.length });
  } catch (error: any) {
    logger.error(`History API failed: ${error.message}`, "API");
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
