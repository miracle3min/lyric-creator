import { NextRequest, NextResponse } from "next/server";
import { initDb, getGenerations, getGenerationById } from "@/lib/db";
import { getSession } from "@/lib/auth/server";

let dbInitialized = false;

export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Get current user
    let userId: string | undefined;
    try {
      const session = await getSession();
      userId = session?.user?.id;
    } catch {
      // Continue without user filter
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (id) {
      const row = await getGenerationById(parseInt(id, 10));
      if (!row) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ generation: row });
    }

    const rows = await getGenerations(limit, userId);
    return NextResponse.json({ generations: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
