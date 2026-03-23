import { GoogleGenerativeAI } from "@google/generative-ai";
import { SongRequest } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import { logger } from "@/lib/logger";

const MAX_RETRIES = 2;
const REQUIRED_FIELDS = ["title", "lyrics", "instruments", "sunoPrompt", "coverArtPrompt"];

/**
 * Extract valid JSON from AI response text.
 * Handles: raw JSON, markdown code blocks, text before/after JSON.
 */
function extractJSON(raw: string): Record<string, unknown> {
  // 1. Try direct parse first
  try {
    return JSON.parse(raw);
  } catch {
    // continue to cleanup
  }

  // 2. Strip markdown code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // continue
    }
  }

  // 3. Find the first { ... } block (greedy match for nested objects)
  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch {
      // continue
    }
  }

  throw new Error("Failed to extract valid JSON from AI response");
}

/**
 * Validate that the parsed object has all required fields.
 * Returns the object with missing fields filled with defaults.
 */
function validateAndNormalize(data: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const field of REQUIRED_FIELDS) {
    const value = data[field] ?? data[toSnakeCase(field)];
    result[field] = typeof value === "string" && value.trim()
      ? value.trim()
      : `No ${field} generated`;
  }

  return result;
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export async function generateWithGemini(song: SongRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(song);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`Gemini attempt ${attempt}/${MAX_RETRIES}`, "GEMINI");

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are a songwriter AI. Acknowledge." }],
          },
          {
            role: "model",
            parts: [{ text: "Ready to create music." }],
          },
        ],
      });

      const result = await chat.sendMessage(`${systemPrompt}\n\n${userPrompt}`);
      const text = result.response.text();

      logger.info(`Gemini raw response length: ${text.length} chars`, "GEMINI");

      const parsed = extractJSON(text);
      const validated = validateAndNormalize(parsed);

      logger.info(`Gemini parse successful: title="${validated.title}"`, "GEMINI");

      return validated;
    } catch (error: any) {
      lastError = error;
      logger.warn(
        `Gemini attempt ${attempt} failed: ${error.message}`,
        "GEMINI"
      );

      if (attempt < MAX_RETRIES) {
        // Wait before retry (exponential backoff)
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Gemini generation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}
