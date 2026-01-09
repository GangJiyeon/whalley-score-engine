"use client";

import { useMemo, useState } from "react";

/**
 * Result Page (UI-only)
 * - ListPage 리듬: px-4 pt-20 pb-10 max-w-5xl
 * - 페이지 스크롤 X (h-dvh overflow-hidden)
 * - 좌: 결과 요약 + Breakdown + Next steps + CTA
 * - 우: "왜 이렇게 나왔는지" 디테일(섹션별 텍스트) + (선택) 입력 요약
 */

type ScoreBreakdown = {
  job: number;
  cost: number;
  visa: number;
  language: number;
};

type Result = {
  regionId: string;
  regionName: string;
  countryName: string;
  countryCode: string;
  total: number; // 0~100
  breakdown: ScoreBreakdown;
  summaryLine: string; // 한 줄 결론
  reasons: {
    job: string[];
    cost: string[];
    visa: string[];
    language: string[];
  };
  nextSteps: { title: string; desc: string; impact?: string }[];
  tags?: string[];
  createdAt: string; // yyyy-mm-dd
};

const glass =
  "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pct(n: number) {
  return `${clamp(n, 0, 100)}%`;
}

function keyLabel(k: keyof ScoreBreakdown) {
  switch (k) {
    case "job":
      return "Job";
    case "cost":
      return "Cost";
    case "visa":
      return "Visa";
    case "language":
      return "Language";
  }
}

export default function ResultPage() {
  // ✅ UI-only 더미 데이터 (나중에 API 결과로 교체)
  const result: Result = useMemo(
    () => ({
      regionId: "jp-tokyo",
      regionName: "Tokyo",
      countryName: "Japan",
      countryCode: "JP",
      total: 82,
      breakdown: { job: 78, cost: 80, visa: 74, language: 90 },
      summaryLine: "영어 부담이 낮고 도시 인프라가 좋아 ‘확실한 첫 선택’에 가까워.",
      reasons: {
        job: [
          "도시권이라 서비스/매장/단기 일자리 탐색이 비교적 수월한 편",
          "선호 직군(서비스/매장)에 맞는 포지션이 많다고 가정",
        ],
        cost: [
          "초기 예산 범위에서 ‘정착 리스크’가 상대적으로 낮은 축",
          "물가가 높은 지역도 있지만 선택지(주거/식비) 조정 여지가 있음",
        ],
        visa: [
          "워홀/체류 조건이 비교적 명확하다고 가정",
          "지역 전략(대도시/지역)에 따라 체감 난이도 변동 가능",
        ],
        language: [
          "영어 의존도가 낮아 ‘초보’에게 부담이 적은 편",
          "현지어를 조금이라도 준비하면 적응 속도가 더 빨라짐",
        ],
      },
      nextSteps: [
        {
          title: "2주 영어 루틴 만들기",
          desc: "전화/면접 대비용 문장 30개 + 하루 10분 쉐도잉",
          impact: "Language +3~5 (예상)",
        },
        {
          title: "일자리 키워드 정리",
          desc: "희망 직군 3개로 좁히고 검색 키워드/이력서 템플릿 준비",
          impact: "Job +4~6 (예상)",
        },
        {
          title: "예산 방어 전략",
          desc: "첫 달 고정비(숙소/교통) 상한선을 정하고 리스트업",
          impact: "Cost 리스크 ↓",
        },
      ],
      tags: ["추천", "도시", "초보OK"],
      createdAt: "2026-01-09",
    }),
    []
  );

  const [activeTab, setActiveTab] = useState<"details" | "answers">("details");
  const [open, setOpen] = useState<Record<string, boolean>>({
    job: true,
    cost: false,
    visa: false,
    language: false,
  });

  // ✅ UI-only 입력 요약(나중에 test answers로 교체)
  const answers = useMemo(
    () => [
      { q: "목표/우선순위", a: "돈도 중요하고, 영어도 늘고 싶어. 대도시 선호" },
      { q: "영어", a: "기본 회화 가능 (전화는 어려움)" },
      { q: "예산", a: "200~300만원 정도" },
      { q: "도시/지역", a: "대도시 선호" },
      { q: "일 스타일", a: "서비스/매장 괜찮음" },
    ],
    []
  );

  const breakdownEntries = Object.entries(result.breakdown) as Array<
    [keyof ScoreBreakdown, number]
  >;

  return (
    <main className="h-dvh w-full overflow-hidden px-4 pt-20 pb-10">
      <div className="mx-auto h-full max-w-5xl">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-fg">Result</h1>
            <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
              점수 산출 근거는 아래에서 섹션별로 확인할 수 있어.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs hover:bg-[rgb(var(--muted))]"
              onClick={() => alert("나중에: Test 페이지로 돌아가기")}
            >
              Retake test
            </button>
            <button
              type="button"
              className="rounded-xl bg-black px-3 py-2 text-xs text-white hover:opacity-90"
              onClick={() => alert("나중에: 결과 저장(localStorage)")}
            >
              Save
            </button>
          </div>
        </header>

        {/* Body */}
        <section className="grid h-[calc(100%-84px)] min-h-0 gap-4 md:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT: Summary */}
          <article className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))] flex flex-col`}>
            {/* Top summary */}
            <div className="border-b border-[rgb(var(--border))] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-fg">
                    {result.countryName} · {result.regionName}{" "}
                    <span className="text-[rgb(var(--muted-foreground))]">
                      ({result.countryCode})
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                    Created at {result.createdAt} • UI only
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(result.tags ?? []).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[rgb(var(--border))] bg-bg px-2 py-0.5 text-[11px] text-[rgb(var(--muted-foreground))]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">
                    Total score
                  </div>
                  <div className="mt-1 text-3xl font-semibold text-[rgb(var(--primary))]">
                    {result.total}
                  </div>
                  <div className="mt-1 text-[11px] text-[rgb(var(--muted-foreground))]">
                    /100
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-bg px-4 py-3">
                <div className="text-sm font-semibold text-fg">Summary</div>
                <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                  {result.summaryLine}
                </div>
              </div>
            </div>

            {/* Scroll area */}
            <div className="min-h-0 flex-1 overflow-auto p-4 space-y-4">
              {/* Breakdown */}
              <section className="rounded-2xl border border-[rgb(var(--border))] bg-bg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-fg">Breakdown</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">
                    (숫자는 최소만 표시)
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {breakdownEntries.map(([k, v]) => (
                    <div key={k}>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-fg">{keyLabel(k)}</div>
                        <div className="text-xs text-[rgb(var(--muted-foreground))]">
                          {v}/100
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-[rgb(var(--muted))]">
                        <div
                          className="h-2 rounded-full bg-[rgb(var(--primary))]"
                          style={{ width: pct(v) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next steps */}
              <section className="rounded-2xl border border-[rgb(var(--border))] bg-bg p-4">
                <div className="text-sm font-semibold text-fg">Next steps</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                  점수를 올리는 “행동”만 간단히 정리했어.
                </div>

                <div className="mt-4 space-y-3">
                  {result.nextSteps.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-fg">{s.title}</div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                            {s.desc}
                          </div>
                        </div>
                        {s.impact && (
                          <div className="shrink-0 rounded-full border border-[rgb(var(--border))] bg-bg px-2 py-1 text-[11px] text-[rgb(var(--muted-foreground))]">
                            {s.impact}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                    onClick={() => alert("나중에: 지역 리스트/지도 페이지로 연결")}
                  >
                    Explore regions
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm hover:bg-[rgb(var(--muted))]"
                    onClick={() => alert("나중에: 결과 상세(이 페이지의 디테일 섹션으로 스크롤)")}
                  >
                    See why
                  </button>
                </div>
              </section>

              {/* “Confidence” callout */}
              <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <div className="text-sm font-semibold text-fg">Confidence</div>
                <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                  이 결과는 “정답”이라기보다, 지금 네 조건에서 선택지를 좁혀주는 용도야.
                  디테일을 보고 마음에 드는 옵션만 남겨서 비교해봐.
                </div>
              </section>
            </div>
          </article>

          {/* RIGHT: Details / Answers */}
          <aside className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))] flex flex-col`}>
            {/* Tabs */}
            <div className="border-b border-[rgb(var(--border))] p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={[
                    "rounded-xl px-3 py-2 text-sm transition",
                    activeTab === "details"
                      ? "bg-bg text-fg border border-[rgb(var(--border))]"
                      : "text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]",
                  ].join(" ")}
                >
                  Details (Why)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("answers")}
                  className={[
                    "rounded-xl px-3 py-2 text-sm transition",
                    activeTab === "answers"
                      ? "bg-bg text-fg border border-[rgb(var(--border))]"
                      : "text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]",
                  ].join(" ")}
                >
                  Your answers
                </button>

                <div className="ml-auto text-xs text-[rgb(var(--muted-foreground))]">
                  UI only
                </div>
              </div>
            </div>

            {/* Scroll area */}
            <div className="min-h-0 flex-1 overflow-auto p-3 space-y-3">
              {activeTab === "details" ? (
                <>
                  {/* Sections (accordion-ish) */}
                  {(
                    [
                      ["job", "Job score — 일자리/적합도"],
                      ["cost", "Cost score — 비용/리스크"],
                      ["visa", "Visa score — 비자/체류"],
                      ["language", "Language score — 언어/적응"],
                    ] as Array<[keyof ScoreBreakdown, string]>
                  ).map(([k, title]) => {
                    const isOpen = open[k];

                    return (
                      <div
                        key={k}
                        className="rounded-2xl border border-[rgb(var(--border))] bg-bg"
                      >
                        <button
                          type="button"
                          onClick={() => setOpen((prev) => ({ ...prev, [k]: !prev[k] }))}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-fg">{title}</div>
                            <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                              {result.breakdown[k]}/100 • 핵심 근거 요약
                            </div>
                          </div>
                          <div className="shrink-0 text-xs text-[rgb(var(--muted-foreground))]">
                            {isOpen ? "Hide" : "Show"}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-[rgb(var(--border))] px-4 py-3">
                            <ul className="space-y-2">
                              {result.reasons[k].map((line, idx) => (
                                <li
                                  key={idx}
                                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm text-[rgb(var(--muted-foreground))]"
                                >
                                  {line}
                                </li>
                              ))}
                            </ul>

                            <div className="mt-3 text-[11px] text-[rgb(var(--muted-foreground))]">
                              * 숫자/가중치 등 자세한 계산식은 나중에 더 투명하게 확장 가능
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Small note */}
                  <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">
                      여기서는 “문장 기반 근거”만 보여줘. 사용자는 납득하고, 너는 포폴에서
                      “설명 가능한 스코어링(Explainable)”을 강조할 수 있어.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Answers */}
                  <div className="rounded-2xl border border-[rgb(var(--border))] bg-bg p-3">
                    <div className="text-sm font-semibold text-fg">Your answers</div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                      테스트에서 입력한 내용(placeholder)
                    </div>

                    <div className="mt-3 space-y-2">
                      {answers.map((x, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2"
                        >
                          <div className="text-xs font-medium text-fg">{x.q}</div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                            {x.a}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="flex-1 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]"
                        onClick={() => alert("나중에: Test로 돌아가서 수정")}
                      >
                        Edit answers
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-xl bg-black px-3 py-2 text-sm text-white hover:opacity-90"
                        onClick={() => alert("나중에: 결과 재계산/새 결과 생성")}
                      >
                        Recalculate
                      </button>
                    </div>
                  </div>

                  {/* Compare stub */}
                  <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
                    <div className="text-sm font-semibold text-fg">Compare</div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                      나중에: 상위 3개 지역을 한 화면에서 비교하는 카드 추가하면 포폴 맛이 확 나.
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
