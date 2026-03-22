"use client";

import { useState } from "react";
import {
  SongRequest,
  GENRES,
  MOODS,
  TEMPOS,
  VOCAL_STYLES,
} from "@/types";
import { FiMusic } from "react-icons/fi";

interface SongFormProps {
  onSubmit: (song: SongRequest) => void;
  isLoading: boolean;
}

export default function SongForm({ onSubmit, isLoading }: SongFormProps) {
  const [form, setForm] = useState<SongRequest>({
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
    if (!form.description.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
        <label className="label-text">Song Theme & Story</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the story, theme, feeling, or message of the song..."
          rows={4}
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
            Generate Lyrics
          </>
        )}
      </button>
    </form>
  );
}
