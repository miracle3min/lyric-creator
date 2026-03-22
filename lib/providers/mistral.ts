import { Mistral } from "@mistralai/mistralai";
import { SongRequest } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";

export async function generateWithMistral(song: SongRequest) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not configured");

  const client = new Mistral({ apiKey });

  const result = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(song) },
    ],
    temperature: 0.9,
    maxTokens: 4096,
    responseFormat: { type: "json_object" },
  });

  const text =
    result.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new Error("Unexpected Mistral response");
  return JSON.parse(text);
}
