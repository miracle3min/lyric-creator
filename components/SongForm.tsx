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

    if (!form.title.trim()) return;
    if (!form.description.trim()) return;

    onSubmit(form, mode, mode === "single" ? selectedProvider : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setMode("multi")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
            mode === "multi" ? "tab-active" : "tab-inactive border-white/10"
          }`}
        >
          <FiLayers className="text-base sm:text-lg" />
          Multi AI
        </button>
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all sm:gap-2 sm:px-4 sm:py-3 sm:text-sm ${
            mode === "single" ? "tab-active" : "tab-inactive border-white/10"
          }`}
        >
          <FiZap className="text-base sm:text-lg" />
          Single AI
        </button>
      </div>

      {/* Provider Select (single mode) */}
      {mode === "single" && (
        <div>
          <label className="label-text">AI Provider</label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedProvider(p)}
                className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:py-2.5 sm:text-sm ${
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
          className="input-field text-sm sm:text-base"
          required
          maxLength={200}
        />
      </div>

      {/* Genre & Mood */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="label-text">Genre</label>
          <select
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
            className="select-field text-sm sm:text-base"
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
            className="select-field text-sm sm:text-base"
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
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="label-text">Language</label>
          <select
            value={form.language}
            onChange={(e) => update("language", e.target.value as "id" | "en")}
            className="select-field text-sm sm:text-base"
          >
            <option value="id">🇮🇩 Indonesia</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <div>
          <label className="label-text">Tempo</label>
          <select
            value={form.tempo}
            onChange={(e) => update("tempo", e.target.value)}
            className="select-field text-sm sm:text-base"
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
        <label className="label-text">Vocal Style</label>
        <select
          value={form.vocalStyle}
          onChange={(e) => update("vocalStyle", e.target.value)}
          className="select-field text-sm sm:text-base"
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
        <label className="label-text">Song Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the story, theme, or feeling..."
          rows={3}
          className="input-field resize-none text-sm sm:text-base"
          required
          maxLength={1000}
        />
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="btn-primary w-full text-sm sm:text-base">
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-5 sm:w-5" />
            Generating...
          </>
        ) : (
          <>
            <FiMusic className="text-base sm:text-lg" />
            {mode === "multi"
              ? "Generate with All 3 AI"
              : `Generate with ${PROVIDER_LABELS[selectedProvider]}`}
          </>
        )}
      </button>
    </form>
  );
}
