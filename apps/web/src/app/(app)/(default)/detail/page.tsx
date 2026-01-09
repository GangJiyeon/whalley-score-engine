"use client";

import { useMemo, useRef, useState } from "react";

/**
 * Test Page (UI-only, 대충 완성본)
 * - 줄글 입력 + (선택사항) 번호/체크로 빠른 선택
 * - 질문 5개 고정
 * - 페이지 스크롤 X / 패널 내부만 스크롤
 * - 점수 산출 디테일은 "결과 상세"에서 한다는 전제(여긴 프리뷰만)
 */

type AffectsKey = "job" | "cost" | "visa" | "language";

type QuickOption = { id: string; label: string };

type Question = {
  id: string;
  title: string;
  placeholder: string;
  why: string;
  affects: AffectsKey[];
  example?: string;
  quickOptions?: QuickOption[]; // ✅ 1~5개 추천 선택지(선택사항)
};

type AnswerMap = Record<string, string>;

type PreviewItem = {
  regionId: string;
  regionName: string;
  countryName: string;
  countryCode: string;
  score: number;
  reasonLine: string;
  tags?: string[];
};

const glass =
  "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function affectsLabel(k: AffectsKey) {
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

export default function TestPage() {
  const questions: Question[] = useMemo(
    () => [
      {
        id: "goal",
        title: "어떤 워홀/해외생활을 원해?",
        placeholder: "원하는 걸 줄글로 편하게 적어줘 (선택지 체크만 해도 돼)",
        why: "목표/우선순위는 추천 지역의 가중치(무엇을 더 중요하게 볼지)에 영향을 줘.",
        affects: ["job", "cost", "visa", "language"],
        example: "예) 돈이 중요하고, 영어도 늘고 싶어. 너무 외진 곳은 싫어.",
        quickOptions: [
          { id: "money", label: "돈을 많이 벌고 싶어" },
          { id: "english", label: "영어 실력을 늘리고 싶어" },
          { id: "city", label: "대도시 선호" },
          { id: "safe", label: "안전/생활 편함이 중요" },
          { id: "fun", label: "문화/여행/재미가 중요" },
        ],
      },
      {
        id: "english",
        title: "영어는 어느 정도라고 느껴?",
        placeholder: "예: 완전 초보 / 일상대화 가능 / 업무 가능 ...",
        why: "영어는 ‘적응 난이도’와 ‘일자리 접근성’에 크게 반영돼.",
        affects: ["language", "job"],
        example: "예) 주문/길찾기 정도는 가능해. 전화는 어려워.",
        quickOptions: [
          { id: "beginner", label: "완전 초보" },
          { id: "basic", label: "기본 회화 가능" },
          { id: "daily", label: "일상대화 가능" },
          { id: "work", label: "업무 대화 가능" },
          { id: "score", label: "시험 점수 있음" },
        ],
      },
      {
        id: "budget",
        title: "초기 정착 예산은 대략 얼마나 잡고 있어?",
        placeholder: "예: 200~300만원 정도, 최대 400까지 가능",
        why: "예산은 ‘비용 리스크(Cost)’ 점수에 반영돼.",
        affects: ["cost"],
        example: "예) 300만원 있고, 부모님 도움은 없음.",
        quickOptions: [
          { id: "b1", label: "100만원 이하" },
          { id: "b2", label: "100~300만원" },
          { id: "b3", label: "300~600만원" },
          { id: "b4", label: "600만원 이상" },
          { id: "unknown", label: "아직 모르겠어" },
        ],
      },
      {
        id: "city",
        title: "도시 vs 소도시(지역) 중 어떤 쪽이 더 좋아?",
        placeholder: "예: 대도시 선호 / 지역도 괜찮음 / 상관없음",
        why: "도시/지역 성향은 비용/일자리 경쟁/체류 전략 판단에 참고돼.",
        affects: ["job", "cost", "visa"],
        example: "예) 너무 외진 곳만 아니면 지역도 괜찮아.",
        quickOptions: [
          { id: "metro", label: "대도시(메트로) 선호" },
          { id: "regional", label: "소도시/지역도 OK" },
          { id: "any", label: "상관없음" },
          { id: "lowcost", label: "비용 낮은 곳 선호" },
          { id: "infra", label: "인프라/편의가 중요" },
        ],
      },
      {
        id: "work",
        title: "어떤 일을 하고 싶어? (경험 없어도 선호만)",
        placeholder: "예: 카페/레스토랑, 오피스, IT, 아무거나...",
        why: "선호 직군은 ‘일자리 적합도(Job)’ 판단에 참고돼.",
        affects: ["job"],
        example: "예) 서비스업 괜찮은데, 밤근무는 싫어.",
        quickOptions: [
          { id: "service", label: "서비스/매장" },
          { id: "office", label: "오피스/사무" },
          { id: "it", label: "IT/개발" },
          { id: "any", label: "아무거나" },
          { id: "day", label: "낮근무 선호" },
        ],
      },
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [input, setInput] = useState("");

  // ✅ 질문별 quick 선택 상태
  const [selectedQuick, setSelectedQuick] = useState<Record<string, string[]>>({});

  const q = questions[clamp(step, 0, questions.length - 1)];
  const progress = Math.round(((step + 1) / questions.length) * 100);
  const completed = Object.keys(answers).length >= questions.length;

  const leftScrollRef = useRef<HTMLDivElement | null>(null);

  function toggleQuick(qid: string, optId: string) {
    setSelectedQuick((prev) => {
      const curr = new Set(prev[qid] ?? []);
      if (curr.has(optId)) curr.delete(optId);
      else curr.add(optId);
      return { ...prev, [qid]: Array.from(curr) };
    });
  }

  const quickText = useMemo(() => {
    const ids = selectedQuick[q.id] ?? [];
    const map = new Map((q.quickOptions ?? []).map((o) => [o.id, o.label]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .join(", ");
  }, [q, selectedQuick]);

  function resetAll() {
    setStep(0);
    setAnswers({});
    setInput("");
    setSelectedQuick({});
  }

  function goToStep(i: number) {
    setStep(clamp(i, 0, questions.length - 1));
  }

  function submitCurrent() {
    if (!q) return;

    const typed = input.trim();
    const final = [quickText, typed].filter(Boolean).join(" / ").trim();

    if (!final) return;

    setAnswers((prev) => ({ ...prev, [q.id]: final }));
    setInput("");

    // 다음 질문으로 이동
    setStep((s) => {
      const next = s + 1;
      return clamp(next, 0, questions.length - 1);
    });

    // 왼쪽 스크롤 맨 아래로(약간의 “대화 진행 느낌”)
    requestAnimationFrame(() => {
      if (!leftScrollRef.current) return;
      leftScrollRef.current.scrollTop = leftScrollRef.current.scrollHeight;
    });
  }

  const preview: PreviewItem[] = useMemo(() => {
    const base: PreviewItem[] = [
      {
        regionId: "jp-tokyo",
        regionName: "Tokyo",
        countryName: "Japan",
        countryCode: "JP",
        score: 82,
        reasonLine: "영어 부담 낮고, 도시 인프라로 적응 쉬움",
        tags: ["추천", "도시"],
      },
      {
        regionId: "au-sydney",
        regionName: "Sydney",
        countryName: "Australia",
        countryCode: "AU",
        score: 74,
        reasonLine: "영어 환경 좋지만 비용 리스크 있음",
        tags: ["영어환경"],
      },
      {
        regionId: "au-melbourne",
        regionName: "Melbourne",
        countryName: "Australia",
        countryCode: "AU",
        score: 68,
        reasonLine: "생활 만족도/문화 강점, 비용은 중간",
        tags: ["도시"],
      },
      {
        regionId: "jp-osaka",
        regionName: "Osaka",
        countryName: "Japan",
        countryCode: "JP",
        score: 61,
        reasonLine: "안정적인 선택, 생활비 부담 비교적 낮음",
        tags: ["도시"],
      },
    ];

    const all = Object.values(answers).join(" ").toLowerCase();
    let bump = 0;

    if (all.includes("영어") || all.includes("english")) bump += 1;
    if (all.includes("초보") || all.includes("완전")) bump -= 1;
    if (all.includes("돈") || all.includes("벌")) bump += 1;
    if (all.includes("대도시") || all.includes("도시")) bump += 1;
    if (all.includes("지역") || all.includes("소도시")) bump += 1;

    bump = clamp(bump, -2, 3);

    const next = base.map((x) => ({ ...x, score: clamp(x.score + bump, 0, 100) }));
    next.sort((a, b) => b.score - a.score);
    return next.slice(0, 3);
  }, [answers]);

  const canSubmit = Boolean(input.trim() || quickText);

  return (
    <main className="h-dvh w-full overflow-hidden px-4 pt-20 pb-10">
      <div className="mx-auto h-full max-w-5xl">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-fg">Test</h1>
            <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">
              줄글로 입력하거나, 아래 1~5번을 체크해서 빠르게 답할 수 있어.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-xs hover:bg-[rgb(var(--muted))]"
              onClick={resetAll}
            >
              Reset
            </button>
          </div>
        </header>

        {/* Body */}
        <section className="grid h-[calc(100%-84px)] min-h-0 gap-4 md:grid-cols-[1.25fr_0.75fr]">
          {/* LEFT */}
          <article className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))] flex flex-col`}>
            {/* Top Progress */}
            <div className="border-b border-[rgb(var(--border))] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-fg">
                  Step {step + 1}/{questions.length}
                </div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">
                  {progress}%
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-[rgb(var(--muted))]">
                <div
                  className="h-2 rounded-full bg-[rgb(var(--primary))]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Content scroll */}
            <div ref={leftScrollRef} className="min-h-0 flex-1 overflow-auto p-4 space-y-4">
              {/* Previous answers (작게) */}
              {questions.map((qq, idx) => {
                const a = answers[qq.id];
                if (!a) return null;
                return (
                  <div
                    key={qq.id}
                    className="rounded-2xl border border-[rgb(var(--border))] bg-bg px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-fg">
                          Q{idx + 1}. {qq.title}
                        </div>
                        <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))] whitespace-pre-wrap">
                          {a}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-xs text-[rgb(var(--muted-foreground))] hover:underline"
                        onClick={() => goToStep(idx)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Current question card */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-bg px-5 py-5">
                <div className="text-base font-semibold text-fg">{q.title}</div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">영향:</div>
                  {q.affects.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted-foreground))]"
                    >
                      {affectsLabel(k)}
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-sm text-[rgb(var(--muted-foreground))]">
                  <span className="font-medium">왜?</span> {q.why}
                </div>

                {q.example && (
                  <div className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                    <span className="font-medium">예시:</span> {q.example}
                  </div>
                )}

                {/* Quick options */}
                {!!q.quickOptions?.length && (
                  <div className="mt-5">
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">
                      빠른 선택(선택사항) — 클릭하거나 <span className="font-medium">Alt+1~5</span>
                    </div>

                    <div className="mt-2 grid gap-2">
                      {q.quickOptions.slice(0, 5).map((opt, idx) => {
                        const active = (selectedQuick[q.id] ?? []).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleQuick(q.id, opt.id)}
                            className={[
                              "flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                              active
                                ? "border-[rgb(var(--primary))] bg-[rgb(var(--card))] ring-1 ring-[rgb(var(--primary))]"
                                : "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--muted))]",
                            ].join(" ")}
                          >
                            <span className="w-6 text-xs text-[rgb(var(--muted-foreground))]">
                              {idx + 1}.
                            </span>
                            <span className="text-sm text-fg">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quickText && (
                      <div className="mt-2 text-xs text-[rgb(var(--muted-foreground))]">
                        선택됨: <span className="text-fg">{quickText}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Text input */}
                <div className="mt-5">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={q.placeholder}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 text-sm text-fg outline-none placeholder:text-[rgb(var(--muted-foreground))]"
                    onKeyDown={(e) => {
                      // Enter: submit (Shift+Enter newline)
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitCurrent();
                        return;
                      }

                      // Alt + 1~5: quick toggle
                      if (e.altKey) {
                        const n = Number(e.key);
                        if (!Number.isNaN(n) && n >= 1 && n <= 5) {
                          e.preventDefault();
                          const opt = q.quickOptions?.[n - 1];
                          if (opt) toggleQuick(q.id, opt.id);
                        }
                      }
                    }}
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-[11px] text-[rgb(var(--muted-foreground))]">
                      Enter 전송 • Shift+Enter 줄바꿈 • Alt+1~5 빠른선택
                    </div>

                    <button
                      type="button"
                      onClick={submitCurrent}
                      disabled={!canSubmit}
                      className={[
                        "rounded-2xl px-4 py-2 text-sm transition",
                        canSubmit
                          ? "bg-black text-white hover:opacity-90"
                          : "cursor-not-allowed bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]",
                      ].join(" ")}
                    >
                      Next →
                    </button>
                  </div>

                  <div className="mt-2 text-[11px] text-[rgb(var(--muted-foreground))]">
                    * 점수 산출 근거(자세한 설명)는 결과 상세 페이지에서 보여줄게.
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT */}
          <aside className={`${glass} min-h-0 overflow-hidden bg-[rgb(var(--card))] flex flex-col`}>
            <div className="border-b border-[rgb(var(--border))] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-fg">Summary</div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                    입력 요약 & 임시 프리뷰
                  </div>
                </div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">
                  {Object.keys(answers).length}/{questions.length}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-3 space-y-3">
              {/* Answers list */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-bg p-3">
                <div className="text-xs font-medium text-[rgb(var(--muted-foreground))]">
                  Answers
                </div>

                <div className="mt-3 space-y-2">
                  {questions.map((qq, idx) => {
                    const a = answers[qq.id];
                    const filled = Boolean(a);
                    return (
                      <button
                        key={qq.id}
                        type="button"
                        onClick={() => goToStep(idx)}
                        className={[
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          filled
                            ? "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--muted))]"
                            : "border-[rgb(var(--border))] bg-[rgb(var(--card))] opacity-70 hover:bg-[rgb(var(--muted))]",
                        ].join(" ")}
                      >
                        <div className="text-xs font-medium text-fg">
                          Q{idx + 1}. {qq.title}
                        </div>
                        <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))] line-clamp-2">
                          {filled ? a : "— not answered"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-bg p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-[rgb(var(--muted-foreground))]">
                    Preview (Top 3)
                  </div>
                  <div className="text-[10px] text-[rgb(var(--muted-foreground))]">UI only</div>
                </div>

                <div className="mt-3 space-y-2">
                  {preview.map((x, i) => (
                    <div
                      key={x.regionId}
                      className={[
                        "rounded-2xl border p-3",
                        i === 0
                          ? "border-[rgb(var(--primary))] bg-[rgb(var(--card))] ring-1 ring-[rgb(var(--primary))]"
                          : "border-[rgb(var(--border))] bg-[rgb(var(--card))]",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-fg">
                            {x.countryName} · {x.regionName}
                          </div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                            {x.reasonLine}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {(x.tags ?? []).map((t) => (
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
                          <div className="text-sm font-semibold text-[rgb(var(--primary))]">
                            {x.score}
                          </div>
                          <div className="mt-1 text-[10px] text-[rgb(var(--muted-foreground))]">
                            /100
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-[rgb(var(--muted-foreground))]">
                        자세한 산출 근거는 결과 상세에서 확인
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className={[
                        "flex-1 rounded-xl px-3 py-2 text-sm transition",
                        completed
                          ? "bg-black text-white hover:opacity-90"
                          : "cursor-not-allowed bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]",
                      ].join(" ")}
                      disabled={!completed}
                      onClick={() => alert("나중에: 결과 페이지로 라우팅 연결")}
                    >
                      View result
                    </button>

                    <button
                      type="button"
                      className={[
                        "flex-1 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2 text-sm transition",
                        completed ? "hover:bg-[rgb(var(--muted))]" : "opacity-70",
                      ].join(" ")}
                      onClick={() => alert("나중에: 결과 저장(local) 연결")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Tiny helper */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
                <div className="text-xs text-[rgb(var(--muted-foreground))]">
                  UI만 먼저 만들었고, 질문/산출/프리뷰는 나중에 백엔드 붙일 때 갈아끼우면 돼.
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
