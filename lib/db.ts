import { neon } from "@neondatabase/serverless";
import { logger } from "@/lib/logger";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

/**
 * Initialize database tables if they don't exist.
 */
export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS generations (
      id SERIAL PRIMARY KEY,
      genre VARCHAR(100),
      mood VARCHAR(100),
      language VARCHAR(50),
      tempo VARCHAR(50),
      vocal_style VARCHAR(100),
      instruments_input TEXT,
      description TEXT,
      title TEXT,
      lyrics TEXT,
      instruments_output TEXT,
      suno_prompt TEXT,
      cover_art_prompt TEXT,
      provider VARCHAR(50) DEFAULT 'gemini',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  logger.info("Database initialized", "DB");
}

/**
 * Save a generation result to the database.
 */
export async function saveGeneration(
  request: {
    genre?: string;
    mood?: string;
    language?: string;
    tempo?: string;
    vocalStyle?: string;
    instruments?: string;
    description?: string;
  },
  result: {
    title: string;
    lyrics: string;
    instruments: string;
    sunoPrompt: string;
    coverArtPrompt: string;
  },
  provider: string = "gemini"
) {
  const sql = getDb();

  try {
    const rows = await sql`
      INSERT INTO generations (
        genre, mood, language, tempo, vocal_style,
        instruments_input, description,
        title, lyrics, instruments_output,
        suno_prompt, cover_art_prompt, provider
      ) VALUES (
        ${request.genre ?? null},
        ${request.mood ?? null},
        ${request.language ?? null},
        ${request.tempo ?? null},
        ${request.vocalStyle ?? null},
        ${request.instruments ?? null},
        ${request.description ?? null},
        ${result.title},
        ${result.lyrics},
        ${result.instruments},
        ${result.sunoPrompt},
        ${result.coverArtPrompt},
        ${provider}
      )
      RETURNING id, created_at
    `;

    logger.info(`Generation saved: id=${rows[0].id}`, "DB");
    return rows[0];
  } catch (error: any) {
    logger.error(`Failed to save generation: ${error.message}`, "DB");
    // Don't throw — saving to DB is non-blocking
    return null;
  }
}

/**
 * Get recent generations.
 */
export async function getGenerations(limit: number = 20) {
  const sql = getDb();

  const rows = await sql`
    SELECT * FROM generations
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return rows;
}

/**
 * Get a single generation by ID.
 */
export async function getGenerationById(id: number) {
  const sql = getDb();

  const rows = await sql`
    SELECT * FROM generations WHERE id = ${id}
  `;

  return rows[0] ?? null;
}
