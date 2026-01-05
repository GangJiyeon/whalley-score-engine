"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Montserrat_Alternates } from "next/font/google";

type NavItem = { href: string; label: string };

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMap = pathname?.startsWith("/map");

  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/map", label: "Map" },
      { href: "/profile", label: "Profile" },
      { href: "/list", label: "List" },
      { href: "/detail", label: "Detail" },
      { href: "/test", label: "Test" },
    ],
    []
  );

  const Sidebar = () => (
    <aside
      className={[
        "fixed left-4 z-30",
        // 헤더 아래로 정확히 떨어지게: top을 '헤더+여백'로 계산
        "top-[calc(var(--ws-header-top)+var(--ws-header-h)+12px)]",
        collapsed ? "w-16" : "w-40",
        "rounded-2xl border border-[rgb(var(--border))] bg-bg/70 backdrop-blur-md shadow-sm",
        "transition-all",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-3 py-2">
        {!collapsed && <span className="text-sm font-semibold">Menu</span>}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-lg px-2 py-1 text-sm hover:bg-[rgb(var(--muted))]"
          type="button"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-black text-white" : "hover:bg-[rgb(var(--muted))]",
                collapsed ? "justify-center" : "gap-3",
              ].join(" ")}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    // 헤더 위치/높이를 변수로 고정 (여기만 바꾸면 전체 overlay가 같이 맞춰짐)
    <div className="relative min-h-dvh bg-bg text-neutral-900 [--ws-header-top:16px] [--ws-header-h:48px]">
      {/* Header (overlay) */}
      <header className="fixed left-0 right-0 z-40 top-[var(--ws-header-top)]">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="h-[var(--ws-header-h)] flex items-center gap-3 rounded-full border border-[rgb(var(--border))] bg-bg/60 backdrop-blur-md shadow-sm px-4">
            <Link href="/map" className="flex items-center gap-2 font-semibold">
              <div className="h-7 w-7 rounded-xl bg-black" />
              <span className={montserratAlternates.className}>whalley score</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar: 지도 페이지에서만 띄울지, 전체 페이지 띄울지 선택 */}
      {<Sidebar />}

      {/* Content: 패딩 없음! (지도는 헤더 뒤까지 꽉 참) */}
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
