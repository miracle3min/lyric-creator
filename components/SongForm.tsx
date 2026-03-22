"use client";

import { useState } from "react";
import {
  SongRequest,
  GenerateMode,
  Provider,
  GENRES,
  MOODS,
  TEMPOS,
  VOCAL_STYLES,
  PROVIDER_LABELS,
} from "@/types";
import { FiMusic, FiZap, FiLayers } from "react-icons/fi";

interface SongFormProps {
  onSubmit: (song: SongRequest, mode: GenerateMode, provider?: Provider) => void;
  isLoading: boolean;
}

export default function SongForm({ onSubmit, isLoading }: SongFormProps) {
  const [mode, setMode] = useState<GenerateMode>("multi");
  const [selectedProvider, setSelectedProvider] = useState<Provider>("gemini");

  const [form, setForm] = useState<SongRequest>({
    title: "",
    genre: "Pop",
    mood: "Happy",
    language: "id",
    description: "",
    tempo: "",
    vocalStyle: "",
  });

  const update = (field: keyof SongRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, mode, mode === "single" ? selectedProvider : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMode("multi")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            mode === "multi" ? "tab-active" : "tab-inactive border-white/10"
          }`}
        >
          <FiLayers className="text-lg" />
          Multi AI (Compare)
        </button>
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            mode === "single" ? "tab-active" : "tab-inactive border-white/10"
          }`}
        >
          <FiZap className="text-lg" />
          Single AI
        </button>
      </div>

      {/* Provider Select (single mode) */}
      {mode === "single" && (
        <div>
          <label className="label-text">AI Provider</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedProvider(p)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  selectedProvider === p
                    ? "tab-active"
                    : "tab-inactive border-white/10"
                }`}
              >
                {PROVIDER_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="label-text">Song Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Malam di Kota Tua"
          className="input-field"
          required
        />
      </div>

      {/* Genre & Mood */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text">Genre</label>
          <select
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
            className="select-field"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Mood</label>
          <select
            value={form.mood}
            onChange={(e) => update("mood", e.target.value)}
            className="select-field"
          >
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language & Tempo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text">Language</label>
          <select
            value={form.language}
            onChange={(e) => update("language", e.target.value as "id" | "en")}
            className="select-field"
          >
            <option value="id">🇮🇩 Bahasa Indonesia</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <div>
          <label className="label-text">Tempo (optional)</label>
          <select
            value={form.tempo}
            onChange={(e) => update("tempo", e.target.value)}
            className="select-field"
          >
            <option value="">Auto</option>
            {TEMPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vocal Style */}
      <div>
        <label className="label-text">Vocal Style (optional)</label>
        <select
          value={form.vocalStyle}
          onChange={(e) => update("vocalStyle", e.target.value)}
          className="select-field"
        >
          <option value="">Auto</option>
          {VOCAL_STYLES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="label-text">Song Description / Theme</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the story, theme, or feeling of the song..."
          rows={4}
          className="input-field resize-none"
          required
        />
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating...
          </>
        ) : (
          <>
            <FiMusic className="text-lg" />
            {mode === "multi" ? "Generate with All 3 AI" : `Generate with ${PROVIDER_LABELS[selectedProvider]}`}
          </>
        )}
      </button>
    </form>
  );
}
