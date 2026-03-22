# 🎵 SUNO Lyric Generator

AI-powered song creation tool that generates **lyrics**, **instrument details**, and **SUNO AI prompts** using multiple AI providers for comparison.

## Features

- 🤖 **Multi-AI Comparison** — Generate with Gemini, Groq & Mistral simultaneously
- 🎯 **Single AI Mode** — Pick one provider for faster results
- 🎼 **Complete Output** — Lyrics with structure, instrument details, and SUNO-ready prompts
- 📋 **Copy to Clipboard** — One-click copy for each section
- 🇮🇩 **Bilingual** — Supports Indonesian & English lyrics
- 🎨 **Beautiful UI** — Dark glassmorphism design with Tailwind CSS
- ⚡ **Vercel Ready** — Deploy in one click

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in your API keys:
- **Gemini**: Get from [Google AI Studio](https://aistudio.google.com/apikey)
- **Groq**: Get from [Groq Console](https://console.groq.com/keys)
- **Mistral**: Get from [Mistral Console](https://console.mistral.ai/api-keys)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy! 🚀

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Providers**: Google Gemini, Groq (LLaMA), Mistral AI
- **Toast**: Sonner

## Project Structure

```
├── app/
│   ├── api/generate/route.ts   # API endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── SongForm.tsx             # Input form
│   ├── ResultCard.tsx           # Result display with tabs
│   └── LoadingSkeleton.tsx      # Loading states
├── lib/
│   ├── prompt.ts                # System & user prompt builder
│   └── providers/
│       ├── gemini.ts            # Gemini integration
│       ├── groq.ts              # Groq integration
│       └── mistral.ts           # Mistral integration
└── types/
    └── index.ts                 # TypeScript types & constants
```

## License

MIT
