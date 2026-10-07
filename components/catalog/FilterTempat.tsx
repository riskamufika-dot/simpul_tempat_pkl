"use client";
import type { Filter } from "@/types";
import { BIDANG_LIST, JURUSAN_LIST } from "@/types";

interface Props {
  filter?: Filter;
  onChange?: (filter: Filter) => void;
}

const select =
  "w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400";

export default function FilterSection({
  filter = { bidang: "", jurusan: "" },
  onChange = () => {},
}: Props) {
  return (
    <section aria-label="Filter tempat PKL" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="font-semibold text-white">Filter:</span>
      <select
        aria-label="Filter bidang"
        value={filter.bidang}
        onChange={(e) => onChange({ ...filter, bidang: e.target.value })}
        className={select}
      >
        <option value="">Semua Bidang</option>
        {BIDANG_LIST?.map((b) => <option key={b}>{b}</option>)}
      </select>
      <select
        aria-label="Filter jurusan"
        value={filter.jurusan}
        onChange={(e) => onChange({ ...filter, jurusan: e.target.value })}
        className={select}
      >
        <option value="">Semua Jurusan</option>
        {JURUSAN_LIST?.map((j) => <option key={j}>{j}</option>)}
      </select>
    </section>
  );
}