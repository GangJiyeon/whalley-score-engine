"use client";

import { useMemo, useState } from "react";

export type Score = {
	total: number; // 0 ~ 100
	breakdown?: {
		job: number;
		cost: number;
		visa: number;
		language: number;
	};
	reason?: string[];
};

export type RegionListItem = {
	regionId: string;
	regionName: string; // Sydney
	countryName: string; // Australia
	countryCode: string; // AU
	score: Score;
	tags?: string[]; // ["추천", "영어초보OK"]
};

export type RegionFilter = {
	minScore?: number;
	maxScore?: number;
	countryCodes?: string[];
	cityTypes?: ("metro" | "regional")[];
};

export type SortOption = "score_desc" | "score_asc";

const glass =
  "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm";

function clamp(n: number, min: number, max: number) {
  	return Math.max(min, Math.min(max, n));
}

export default function ListPage() {
  const regions: RegionListItem[] = useMemo(
    () => [
      {
        regionId: "jp-tokyo",
        regionName: "Tokyo",
        countryName: "Japan",
        countryCode: "JP",
        score: { total: 82 },
        tags: ["추천", "도시"],
      },
      {
        regionId: "au-sydney",
        regionName: "Sydney",
        countryName: "Australia",
        countryCode: "AU",
        score: { total: 74 },
        tags: ["추천", "영어초보OK"],
      },
      {
        regionId: "au-melbourne",
        regionName: "Melbourne",
        countryName: "Australia",
        countryCode: "AU",
        score: { total: 68 },
        tags: ["도시"],
      },
      {
        regionId: "jp-osaka",
        regionName: "Osaka",
        countryName: "Japan",
        countryCode: "JP",
        score: { total: 61 },
        tags: ["도시"],
      },
    ],
    []
  );

  // 검색/태그 UI
  const [q, setQ] = useState("");
  const [chips, setChips] = useState<string[]>(["추천"]);

  // ✅ RegionFilter 상태 (핵심)
  const [filter, setFilter] = useState<RegionFilter>({
    minScore: 0,
    maxScore: 100,
    countryCodes: [], // 비어있으면 전체
  });

  // ✅ sort 상태
  const [sort, setSort] = useState<SortOption>("score_desc");

  // (선택) 퀵 country selector - UI 편의용
  const [location, setLocation] = useState<"Anywhere" | "Japan" | "Australia">(
    "Anywhere"
  );

  function toggleChip(label: string) {
    setChips((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  }

  function removeChip(label: string) {
    setChips((prev) => prev.filter((x) => x !== label));
  }

  function clearChips() {
    setChips([]);
  }

  function toggleCountryCode(code: string) {
    setFilter((prev) => {
      const set = new Set(prev.countryCodes ?? []);
      if (set.has(code)) set.delete(code);
      else set.add(code);
      return { ...prev, countryCodes: Array.from(set) };
    });
  }

  function clearFilter() {
    setFilter({ minScore: 0, maxScore: 100, countryCodes: [] });
    setLocation("Anywhere");
    setChips([]);
    setQ("");
    setSort("score_desc");
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const minScore = filter.minScore ?? 0;
    const maxScore = filter.maxScore ?? 100;
    const codes = filter.countryCodes ?? [];

    const base = regions.filter((r) => {
      // 1) search query
      const hit =
        r.regionName.toLowerCase().includes(query) ||
        r.countryName.toLowerCase().includes(query) ||
        (r.tags ?? []).join(" ").toLowerCase().includes(query);

      // 2) country filter (countryCodes가 비어있으면 all)
      const countryOk = codes.length === 0 ? true : codes.includes(r.countryCode);

      // 3) score range filter
      const scoreOk = r.score.total >= minScore && r.score.total <= maxScore;

      // 4) chips filter (tags)
      const chipsOk =
        chips.length === 0 ? true : chips.every((c) => (r.tags ?? []).includes(c));

      return hit && countryOk && scoreOk && chipsOk;
    });

    // sort
    base.sort((a, b) =>
      sort === "score_desc" ? b.score.total - a.score.total : a.score.total - b.score.total
    );

    return base;
  }, [regions, q, chips, filter, sort]);

  // “location” 셀렉트는 내부적으로 countryCodes를 세팅하는 헬퍼처럼만 사용
  function onChangeLocation(next: "Anywhere" | "Japan" | "Australia") {
    setLocation(next);
    if (next === "Anywhere") {
      setFilter((prev) => ({ ...prev, countryCodes: [] }));
      return;
    }
    const code = next === "Japan" ? "JP" : "AU";
    setFilter((prev) => ({ ...prev, countryCodes: [code] }));
  }

  const selectedCodes = new Set(filter.countryCodes ?? []);

  return (
    <main className="px-4 pb-10 pt-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold text-fg">List</h1>
        <p className="mt-2 text-[rgb(var(--muted-foreground))]">
          Search & filter regions (placeholder)
        </p>

        {/* Toolbar */}
        <div className={`mt-6 ${glass} p-4`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
              <span className="text-sm text-[rgb(var(--muted-foreground))]">⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by region, country, tags"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            {/* Location (quick) */}
            <select
              value={location}
              onChange={(e) => onChangeLocation(e.target.value as any)}
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            >
              <option value="Anywhere">Anywhere</option>
              <option value="Japan">Japan</option>
              <option value="Australia">Australia</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm"
            >
              <option value="score_desc">Score (High)</option>
              <option value="score_asc">Score (Low)</option>
            </select>

            {/* Clear */}
            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]"
              onClick={clearFilter}
            >
              Reset
            </button>
          </div>

          {/* Filter row: Score + CountryCodes */}
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Score range */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
                <span className="text-xs text-[rgb(var(--muted-foreground))]">Min</span>
                <input
                  type="number"
                  value={filter.minScore ?? 0}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      minScore: clamp(Number(e.target.value || 0), 0, 100),
                    }))
                  }
                  className="w-14 bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2">
                <span className="text-xs text-[rgb(var(--muted-foreground))]">Max</span>
                <input
                  type="number"
                  value={filter.maxScore ?? 100}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      maxScore: clamp(Number(e.target.value || 100), 0, 100),
                    }))
                  }
                  className="w-14 bg-transparent text-sm outline-none"
                />
              </div>

              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]"
                onClick={() => toggleChip("추천")}
              >
                Toggle “추천”
              </button>

              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]"
                onClick={() => toggleChip("도시")}
              >
                Toggle “도시”
              </button>
            </div>

            {/* countryCodes multi-select buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleCountryCode("JP")}
                className={[
                  "rounded-full border px-3 py-1 text-xs transition",
                  selectedCodes.has("JP")
                    ? "border-[rgb(var(--primary))] bg-[rgb(var(--muted))] text-fg"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]",
                ].join(" ")}
              >
                JP
              </button>

              <button
                type="button"
                onClick={() => toggleCountryCode("AU")}
                className={[
                  "rounded-full border px-3 py-1 text-xs transition",
                  selectedCodes.has("AU")
                    ? "border-[rgb(var(--primary))] bg-[rgb(var(--muted))] text-fg"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]",
                ].join(" ")}
              >
                AU
              </button>

              <span className="ml-1 text-xs text-[rgb(var(--muted-foreground))]">
                {filter.countryCodes?.length ? `Country: ${filter.countryCodes.join(", ")}` : "Country: All"}
              </span>
            </div>
          </div>

          {/* chips row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => removeChip(c)}
                className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]"
                aria-label={`Remove ${c}`}
              >
                <span>×</span>
                <span>{c}</span>
              </button>
            ))}

            {chips.length > 0 && (
              <button
                type="button"
                onClick={clearChips}
                className="ml-1 text-xs text-[rgb(var(--muted-foreground))] hover:underline"
              >
                Clear Chips
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[rgb(var(--muted-foreground))]">
                We’ve found {filtered.length} regions!
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {filtered.map((region, idx) => (
            <article
              key={region.regionId}
              className={[
                glass,
                "p-4 transition",
                "hover:shadow-md",
                idx === 1 ? "ring-1 ring-[rgb(var(--primary))]" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]" />
                  <div>
                    <div className="text-sm font-semibold text-fg">
                      {region.regionName}
                    </div>
                    <div className="mt-0.5 text-xs text-[rgb(var(--muted-foreground))]">
                      {region.countryName} · {region.countryCode}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(region.tags ?? []).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-2 py-0.5 text-[11px] text-[rgb(var(--muted-foreground))]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-fg">
                    Score:{" "}
                    <span className="text-[rgb(var(--primary))]">
                      {region.score.total}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                    placeholder
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className={`${glass} p-6 text-sm text-[rgb(var(--muted-foreground))]`}>
              No results. Try changing filters or search keywords.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
