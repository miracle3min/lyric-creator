import { GoogleGenerativeAI } from "@google/generative-ai";
import { SongRequest } from "@/types";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";

export async function generateWithGemini(song: SongRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

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

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(song);

  const result = await chat.sendMessage(`${systemPrompt}\n\n${userPrompt}`);
  const text = result.response.text();

  return JSON.parse(text);
}
