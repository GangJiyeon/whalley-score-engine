"use client";

/**
 * AppShell = (app) common layout
 * - Header: fixed top
 * - Sidebar: 데스크톱 좌측 고정 + 접기 가능
 * - Mobile Drawer: 모바일에서 햄버거로 열기
 * - children: 각 페이지(page.tsx)가 이 자리로 들어온다
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type NavItem = { href: string; label: string };

export default function AppShell({ children }: { children: React.ReactNode }) {
  	const pathname = usePathname();

  	// desktop sidebar
  	const [collapsed, setCollapsed] = useState(false);

 	// mobile drawer
 	const [mobileOpen, setMobileOpen] = useState(false);

  	// sidebar menu
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

  	// sidebar UI (reuse in desktop/mobile)
	const Sidebar = ({ mode }: { mode: "desktop" | "mobile" }) => (
		<nav className="h-full p-2">
			<div className="space-y-1">
				{navItems.map((item) => {
					const active =
						pathname === item.href || pathname?.startsWith(item.href + "/");
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => mode === "mobile" && setMobileOpen(false)} 
							className={[
								"flex items-center rounded-xl px-3 py-2 text-sm transition",
								active
								? "bg-black text-white"
								: "text-neutral-800 hover:bg-neutral-100 bg-bg",
								collapsed && mode === "desktop" ? "justify-center px-2" : "gap-3",
							].join(" ")}
							aria-current={active ? "page" : undefined}>
							{/* icon */}
							<span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
							{/* hide */}
							{!(collapsed && mode === "desktop") && <span>{item.label}</span>}
						</Link>
					);
				})}
     		</div>
    	</nav>
  	);

	return (
		<div className="min-h-dvh bg-bg text-neutral-900">
		{/* Header */}
		<header className="sticky top-0 z-40 h-14 border-b bg-bg/80 backdrop-blur">
			<div className="mx-auto flex h-full max-w-screen-2xl items-center gap-3 px-4">
				{/* mobile menu */}
				<button
					className="md:hidden rounded-lg px-3 py-2 hover:bg-neutral-100"
					onClick={() => setMobileOpen(true)}
					aria-label="Open navigation">
					☰
				</button>
				{/* logo and title */}
				<Link href="/map" className="flex items-center gap-2 font-semibold">
					<div className="h-7 w-7 rounded-xl bg-black" aria-hidden />
					<span className="hidden sm:inline">Whalley Score</span>
				</Link>
          	<div className="flex-1" />

				{/* close desktop sidebar */}
				<button
					className="hidden md:inline-flex rounded-lg px-3 py-2 hover:bg-neutral-100"
					onClick={() => setCollapsed((v) => !v)}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
					{collapsed ? "→" : "←"}
				</button>
        	</div>
     	</header>

		{/* Mobile Drawer */}
		{mobileOpen && (
			<div className="fixed inset-0 z-50 md:hidden">
			<div
				className="absolute inset-0 bg-black/40"
				onClick={() => setMobileOpen(false)}
			/>
			<aside className="absolute left-0 top-0 h-full w-72 bg-bg border-r">
				<div className="h-14 border-b px-4 flex items-center justify-between">
				<span className="font-semibold">Whalley Score</span>
				<button
					className="rounded-lg px-3 py-2 hover:bg-neutral-100"
					onClick={() => setMobileOpen(false)}
					aria-label="Close navigation"
				>
					✕
				</button>
				</div>
				<Sidebar mode="mobile" />
			</aside>
			</div>
		)}

		{/* Desktop: Sidebar + Content */}
		<div className="mx-auto grid max-w-screen-2xl md:grid-cols-[auto_1fr]">
			{/* desktop sidebar */}
			<aside
			className={[
				"hidden md:block border-r bg-bg",
				collapsed ? "w-16" : "w-64",
			].join(" ")}
			>
			<Sidebar mode="desktop" />
			</aside>
			<div className="min-h-[calc(100dvh-56px)] w-full">{children}</div>
		</div>
		</div>
	);
}
