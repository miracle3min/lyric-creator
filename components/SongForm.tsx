"use client";

import { useState } from "react";
import {
  SongRequest,
  GENRES,
  MOODS,
  TEMPOS,
  VOCAL_STYLES,
  INSTRUMENTS,
} from "@/types";
import { FiMusic, FiChevronDown, FiChevronUp } from "react-icons/fi";

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
    selectedInstruments: [],
    customInstruments: "",
  });

  const [showAllInstruments, setShowAllInstruments] = useState(false);

  const update = (field: keyof SongRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInstrument = (instrument: string) => {
    setForm((prev) => {
      const selected = prev.selectedInstruments.includes(instrument)
        ? prev.selectedInstruments.filter((i) => i !== instrument)
        : [...prev.selectedInstruments, instrument];
      return { ...prev, selectedInstruments: selected };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    onSubmit(form);
  };

  const visibleInstruments = showAllInstruments ? INSTRUMENTS : INSTRUMENTS.slice(0, 12);

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
              <option key={g} value={g}>{g}</option>
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
              <option key={m} value={m}>{m}</option>
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
              <option key={t} value={t}>{t}</option>
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
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Instruments Selection */}
      <div>
        <label className="label-text">
          🎸 Instruments {form.selectedInstruments.length > 0 && (
            <span className="text-brand-400">({form.selectedInstruments.length} selected)</span>
          )}
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
          {visibleInstruments.map((inst) => {
            const isSelected = form.selectedInstruments.includes(inst);
            return (
              <button
                key={inst}
                type="button"
                onClick={() => toggleInstrument(inst)}
                className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
                  isSelected
                    ? "border-brand-500/50 bg-brand-500/20 text-brand-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                {inst}
              </button>
            );
          })}
        </div>
        {INSTRUMENTS.length > 12 && (
          <button
            type="button"
            onClick={() => setShowAllInstruments(!showAllInstruments)}
            className="mt-2 flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 sm:text-xs"
          >
            {showAllInstruments ? <FiChevronUp /> : <FiChevronDown />}
            {showAllInstruments ? "Show Less" : `Show All (${INSTRUMENTS.length})`}
          </button>
        )}

        {/* Custom Instruments */}
        <textarea
          value={form.customInstruments}
          onChange={(e) => update("customInstruments", e.target.value)}
          placeholder="Add custom instruments (e.g., Erhu, Kecapi, Didgeridoo, Kalimba...)"
          rows={2}
          className="input-field mt-2 resize-none text-[11px] sm:text-xs"
          maxLength={500}
        />
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
