"use client";

import { useMemo, useState } from "react";

type TestHistoryItem = {
  id: string;
  title: string; // e.g. "Whalley Score Test"
  country: string; // e.g. "Australia"
  region?: string; // e.g. "Sydney"
  score: number; // 0~100
  createdAt: string; // e.g. "2026-01-09"
  note?: string; // short memo
};

const glass =
  "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm";

export default function ProfilePage() {
  const items: TestHistoryItem[] = useMemo(
    () => [
      {
        id: "t1",
        title: "Whalley Score Test",
        country: "Japan",
        region: "Tokyo",
        score: 82,
        createdAt: "2026-01-09",
        note: "City-friendly / beginner OK",
      },
      {
        id: "t2",
        title: "Whalley Score Test",
        country: "Australia",
        region: "Sydney",
        score: 74,
        createdAt: "2026-01-08",
        note: "High job demand",
      },
      {
        id: "t3",
        title: "Whalley Score Test",
        country: "Canada",
        region: "Vancouver",
        score: 71,
        createdAt: "2026-01-06",
        note: "Higher cost",
      },
      {
        id: "t4",
        title: "Whalley Score Test",
        country: "Germany",
        region: "Berlin",
        score: 61,
        createdAt: "2026-01-05",
      },
      ...Array.from({ length: 10 }).map((_, i) => ({
        id: `t_more_${i}`,
        title: "Whalley Score Test",
        country: i % 2 === 0 ? "Japan" : "Australia",
        region: i % 2 === 0 ? "Osaka" : "Melbourne",
        score: 50 + ((i * 7) % 45),
        createdAt: `2026-01-${String(4 - (i % 3)).padStart(2, "0")}`,
        note: i % 3 === 0 ? "Saved" : undefined,
      })),
    ],
    []
  );

  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((x) => x.id === selectedId) ?? items[0];

  return (
    <main className="px-4 pb-10 pt-20 h-dvh overflow-hidden">
    <div className="mx-auto h-full max-w-5xl flex flex-col gap-4">

        {/* 상단 헤더만 가볍게 */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-fg">Profile</h1>
            <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
              No login • local history (placeholder)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs hover:bg-[rgb(var(--muted))]"
              onClick={() => alert("나중에: localStorage/쿠키 삭제 연결")}
            >
              Clear history
            </button>
          </div>
        </header>

        {/* ✅ 바깥 큰 박스 제거: 이제 좌/우 카드만 보여 */}
        <section className="grid min-h-0 flex-1 gap-4 md:grid-cols-[1.35fr_0.65fr]">
          {/* LEFT */}
<article className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))] flex flex-col`}>
  {/* ✅ 헤더는 고정 + 높이 조금 줄임 */}
  <div className="flex items-center gap-3 border-b border-[rgb(var(--border))] p-3">
    <div className="h-16 w-16 shrink-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--muted))]" />
    <div className="min-w-0">
      <div className="text-sm font-semibold text-fg">My profile</div>
      <div className="mt-0.5 text-xs text-[rgb(var(--muted-foreground))]">
        Save test results locally and revisit anytime.
      </div>
    </div>
  </div>

  {/* ✅ 본문만 스크롤 (핵심: min-h-0 + overflow-auto) */}
  <div className="min-h-0 flex-1 overflow-auto p-4">
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Name" value="(optional) Ji-yeon" />
      <Field label="Email" value="(optional) - not required" />
      <Field label="Preferred country" value={selected?.country ?? "-"} />
      <Field label="Preferred region" value={selected?.region ?? "-"} />
      <Field label="Last score" value={selected ? String(selected.score) : "-"} />
      <Field label="Last test date" value={selected?.createdAt ?? "-"} />
    </div>

    <div className="mt-4">
      <div className="text-xs font-medium text-[rgb(var(--muted-foreground))]">
        Notes
      </div>
      <div className="mt-2 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-3 text-sm text-fg">
        {selected?.note ?? "No notes yet. Add a memo when you save a test result."}
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
        onClick={() => alert("나중에: '새 테스트 시작' 라우팅 연결")}
      >
        Start new test
      </button>

      <button
        type="button"
        className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm hover:bg-[rgb(var(--muted))]"
        onClick={() => alert("나중에: 선택된 결과 상세 보기 연결")}
      >
        View details
      </button>
    </div>
  </div>
</article>


          {/* RIGHT */}
          <aside className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))]`}>
            <div className="flex items-center justify-between border-b border-[rgb(var(--border))] p-4">
              <div>
                <div className="text-sm font-semibold text-fg">History</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                  Select one to preview
                </div>
              </div>
              <div className="text-xs text-[rgb(var(--muted-foreground))]">
                {items.length} items
              </div>
            </div>

            {/* ✅ 여기만 스크롤 */}
            <div className="h-full overflow-auto p-3">
              <div className="space-y-3">
                {items.map((x) => {
                  const active = x.id === selectedId;

                  return (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => setSelectedId(x.id)}
                      className={[
                        "w-full rounded-2xl border p-3 text-left transition",
                        active
                          ? "border-[rgb(var(--primary))] bg-bg ring-1 ring-[rgb(var(--primary))]"
                          : "border-[rgb(var(--border))] bg-bg hover:bg-[rgb(var(--muted))]",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-fg">
                            {x.country}
                            {x.region ? ` · ${x.region}` : ""}
                          </div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                            {x.title} • {x.createdAt}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold text-[rgb(var(--primary))]">
                            {x.score}
                          </div>
                          <div className="mt-1 text-[10px] text-[rgb(var(--muted-foreground))]">
                            /100
                          </div>
                        </div>
                      </div>

                      {x.note && (
                        <div className="mt-2 line-clamp-1 text-xs text-[rgb(var(--muted-foreground))]">
                          {x.note}
                        </div>
                      )}
                    </button>
                  );
                })}

                {items.length === 0 && (
                  <div className="rounded-xl border border-[rgb(var(--border))] bg-bg p-4 text-sm text-[rgb(var(--muted-foreground))]">
                    No saved tests yet.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-3">
      <div className="text-[11px] text-[rgb(var(--muted-foreground))]">{label}</div>
      <div className="mt-1 text-sm text-fg">{value}</div>
    </div>
  );
}
