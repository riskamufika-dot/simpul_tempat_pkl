"use client";
import { useState } from "react";
import type { Place, CompareMode } from "@/types";
import { COMPARE_MODES } from "@/types";

interface Props {
  selected: Place[]; // maksimal 2
  onCompare: (mode: CompareMode) => void;
  onCancel: () => void;
}

export default function CompareBar({ selected, onCompare, onCancel }: Props) {
  const [mode, setMode] = useState<CompareMode>("Bandingkan Semua");
  const ready = selected.length === 2;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-3xl flex-wrap items-center gap-3 rounded-xl bg-[#1B2A5E] p-3 text-white shadow-lg">
      <span aria-label={`${selected.length} dari 2 dipilih`} className="rounded-lg border border-white/50 px-3 py-1.5 text-sm font-semibold">
        {selected.length}/2
      </span>
      <select
        aria-label="Pilih yang ingin dibandingkan"
        value={mode}
        onChange={(e) => setMode(e.target.value as CompareMode)}
        className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-blue-900"
      >
        {COMPARE_MODES.map((m) => <option key={m}>{m}</option>)}
      </select>
      <button
        disabled={!ready}
        onClick={() => onCompare(mode)}
        className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-900 disabled:opacity-50"
      >
        Bandingkan
      </button>
      <button onClick={onCancel} className="px-2 text-sm">Batal</button>
      {!ready && <p className="w-full text-xs text-white/80">Pilih satu tempat lagi untuk mulai membandingkan.</p>}
    </div>
  );
}