import Groq from "groq-sdk";
import { SongRequest } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";

export async function generateWithGroq(song: SongRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(song) },
    ],
    temperature: 0.9,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0]?.message?.content || "";
  return JSON.parse(text);
}
