"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type RecommendationItem = {
  id: string;
  country: string;
  score: number;
};

type Props = {
  items: RecommendationItem[];

  /** desktop width */
  desktopWidth: number;
  setDesktopWidth: (w: number) => void;

  /** desktop collapsed (only tab remains) */
  desktopCollapsed: boolean;
  setDesktopCollapsed: (v: boolean) => void;

  /** mobile sheet height (px), 0 means hidden */
  mobileHeight: number;
  setMobileHeight: (h: number) => void;

  /**
   * Optional:
   * If you want the panel to sit below a fixed header.
   * (Default values match your AppShell: top-4 + h-12 + gap)
   */
  headerTopPx?: number; // default 16
  headerHeightPx?: number; // default 48
  gapPx?: number; // default 12
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}

export default function RecommendationsPanel(props: Props) {
  const {
    items,
    desktopWidth,
    setDesktopWidth,
    desktopCollapsed,
    setDesktopCollapsed,
    mobileHeight,
    setMobileHeight,
    headerTopPx = 16,
    headerHeightPx = 48,
    gapPx = 12,
  } = props;

  const isMobile = useIsMobile(768);

  // ----- filters (MVP) -----
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);

  const filtered = useMemo(() => {
    const base = items.filter((x) => x.score >= minScore && x.score <= maxScore);
    base.sort((a, b) => (sort === "desc" ? b.score - a.score : a.score - b.score));
    return base;
  }, [items, minScore, maxScore, sort]);

  // =========================================================
  // Desktop: resizable width
  // =========================================================
  const dragRef = useRef<{ startX: number; startW: number; dragging: boolean } | null>(null);

  function onDesktopPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startW: desktopWidth, dragging: true };
  }
  function onDesktopPointerMove(e: React.PointerEvent) {
    if (!dragRef.current?.dragging) return;
    const dx = dragRef.current.startX - e.clientX; // move left => bigger
    const next = clamp(dragRef.current.startW + dx, 280, 520);
    setDesktopWidth(next);
  }
  function onDesktopPointerUp(e: React.PointerEvent) {
    if (!dragRef.current) return;
    dragRef.current.dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  // =========================================================
  // Mobile: bottom sheet drag + snap
  // =========================================================
  const sheetDragRef = useRef<{ startY: number; startH: number; dragging: boolean } | null>(null);
  const didInitMobile = useRef(false);

  const getSnapHeights = () => {
    const vh = window.innerHeight;
    return {
      min: 0,
      mid: Math.round(vh * 0.45),
      max: Math.round(vh * 0.82),
    };
  };

  // ✅ only first time on mobile -> open mid
  useEffect(() => {
    if (!isMobile) return;
    if (didInitMobile.current) return;
    didInitMobile.current = true;

    if (mobileHeight === 0) {
      const { mid } = getSnapHeights();
      setMobileHeight(Math.min(mid, 420));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  function onSheetPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    sheetDragRef.current = { startY: e.clientY, startH: mobileHeight, dragging: true };
  }
  function onSheetPointerMove(e: React.PointerEvent) {
    if (!sheetDragRef.current?.dragging) return;
    const dy = sheetDragRef.current.startY - e.clientY; // drag up => increase
    const vh = window.innerHeight;
    const next = clamp(sheetDragRef.current.startH + dy, 0, Math.round(vh * 0.9));
    setMobileHeight(next);
  }
  function onSheetPointerUp(e: React.PointerEvent) {
    if (!sheetDragRef.current) return;
    sheetDragRef.current.dragging = false;

    const { min, mid, max } = getSnapHeights();
    const candidates = [min, mid, max];
    const nearest = candidates.reduce((best, cur) =>
      Math.abs(cur - mobileHeight) < Math.abs(best - mobileHeight) ? cur : best
    );
    setMobileHeight(nearest);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  // ----- shared “glass card” classes -----
  const glass =
    "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm";

  // ============================
  // Mobile render
  // ============================
  if (isMobile) {
    const isHidden = mobileHeight <= 0;

    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
        {/* reopen when hidden */}
        {isHidden && (
          <div className="pointer-events-auto mx-auto mb-4 w-fit">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                const { mid } = getSnapHeights();
                setMobileHeight(Math.min(mid, 420));
              }}
              className={`${glass} px-4 py-2 text-sm`}
            >
              추천 열기 ↑
            </button>
          </div>
        )}

        <div
          className={["pointer-events-auto mx-auto w-full max-w-screen-sm", glass].join(" ")}
          style={{ height: mobileHeight }}
        >
          {/* Drag handle area ONLY */}
          <div
            className="flex items-center justify-between px-4 pt-3 pb-2 select-none"
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerUp}
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-10 rounded-full bg-[rgb(var(--border))]" />
              <span className="text-sm font-semibold">Recommendations</span>
            </div>

            {/* ✅ stopPropagation so it won't trigger drag/snap */}
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setMobileHeight(0);
              }}
              className="rounded-lg px-2 py-1 text-sm hover:bg-[rgb(var(--muted))]"
            >
              닫기
            </button>
          </div>

          {/* Filters */}
          <div className="px-4 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                className="rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2 text-sm"
              >
                <option value="desc">점수 높은순</option>
                <option value="asc">점수 낮은순</option>
              </select>

              <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2">
                <span className="text-xs text-[rgb(var(--muted-foreground))]">Min</span>
                <input
                  type="number"
                  value={minScore}
                  onChange={(e) => setMinScore(clamp(Number(e.target.value || 0), 0, 100))}
                  className="w-14 bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2">
                <span className="text-xs text-[rgb(var(--muted-foreground))]">Max</span>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(clamp(Number(e.target.value || 100), 0, 100))}
                  className="w-14 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* List scrolls */}
          <div className="h-[calc(100%-104px)] overflow-auto px-4 pb-4">
            <div className="space-y-3">
              {filtered.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-left transition hover:bg-[rgb(var(--muted))]"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{x.country}</div>
                    <div className="text-sm font-semibold text-[rgb(var(--primary))]">
                      {x.score}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                    Score based on your inputs (placeholder)
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted-foreground))]">
                  조건에 맞는 국가가 없어요. 필터를 조정해보세요.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // Desktop render (fixed overlay)
  // ============================
  const top = `calc(${headerTopPx}px + ${headerHeightPx}px + ${gapPx}px)`;
  const bottom = `16px`;
  const collapsedW = 32; // ✅ clickable width

  return (
    <aside
      className={["fixed right-4 z-30", glass, "overflow-hidden"].join(" ")}
      style={{
        top,
        bottom,
        width: desktopCollapsed ? collapsedW : desktopWidth,
      }}
    >
      {desktopCollapsed ? (
        <div className="flex h-full items-center justify-center">
          <button
            type="button"
            onClick={() => setDesktopCollapsed(false)}
            className="rounded-xl border border-[rgb(var(--border))] bg-bg/70 px-2 py-2 text-sm hover:bg-[rgb(var(--muted))]"
            aria-label="Expand recommendations"
          >
            ←
          </button>
        </div>
      ) : (
        <>
          {/* Drag handle */}
          <div
            className="absolute left-0 top-0 h-full w-2 cursor-col-resize"
            onPointerDown={onDesktopPointerDown}
            onPointerMove={onDesktopPointerMove}
            onPointerUp={onDesktopPointerUp}
            role="separator"
            aria-label="Resize recommendations panel"
          />

          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Recommendations</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">
                  Sort & filter results
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDesktopCollapsed(true)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-[rgb(var(--muted))]"
                aria-label="Collapse recommendations"
              >
                →
              </button>
            </div>

            {/* Filters */}
            <div className="px-4 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                  className="rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2 text-sm"
                >
                  <option value="desc">점수 높은순</option>
                  <option value="asc">점수 낮은순</option>
                </select>

                <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2">
                  <span className="text-xs text-[rgb(var(--muted-foreground))]">Min</span>
                  <input
                    type="number"
                    value={minScore}
                    onChange={(e) => setMinScore(clamp(Number(e.target.value || 0), 0, 100))}
                    className="w-14 bg-transparent text-sm outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-bg px-3 py-2">
                  <span className="text-xs text-[rgb(var(--muted-foreground))]">Max</span>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(clamp(Number(e.target.value || 100), 0, 100))}
                    className="w-14 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto px-4 pb-4">
              <div className="space-y-3">
                {filtered.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-left transition hover:bg-[rgb(var(--muted))]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{x.country}</div>
                      <div className="text-sm font-semibold text-[rgb(var(--primary))]">
                        {x.score}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted-foreground))]">
                      Score based on your inputs (placeholder)
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && (
                  <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted-foreground))]">
                    조건에 맞는 국가가 없어요. 필터를 조정해보세요.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
