// apps/web/src/app/(main)/page.tsx
import Link from "next/link";
import { Montserrat_Alternates } from "next/font/google";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MainPage() {
	return (
		<main className="min-h-screen bg-bg text-fg flex flex-col">
		{/* Top bar */}
		<header className="w-full border-b border-[rgb(var(--border))]">
			<div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3">
			{/* Logo / brand */}
			<div className="flex items-center gap-3">
				<div className="h-9 w-9 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))]" />
				<span
				className={`${montserratAlternates.className} text-lg font-semibold tracking-tight`}
				>
				whalley
				</span>
			</div>

			{/* menu */}
			<div className="flex items-center gap-2">
				<button
				className="rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm transition hover:bg-[rgb(var(--muted))]"
				type="button"
				>
				GitHub
				</button>
				<button
				className="rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm transition hover:bg-[rgb(var(--muted))]"
				type="button"
				>
				login
				</button>
			</div>
			</div>
		</header>

		{/* Center */}
		<section className="mx-auto w-full max-w-5xl px-6 flex-1 flex items-center">
			<div className="w-full px-6 py-12">
			<div className="mx-auto max-w-2xl text-center">
				<p className="text-sm text-[rgb(var(--muted-foreground))]">
				whalley score
				</p>

				<h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
				Find Your Best <br /> Working &amp; Holiday!
				</h1>

				<p className="mt-4 text-sm leading-relaxed text-[rgb(var(--muted-foreground))]">
				간단한 입력으로 나에게 맞는 워캉홀리데이 국가를 추천해요.
				</p>

				{/* keyword chips (유지) */}
				<div className="mt-3 flex flex-wrap justify-center gap-2">
				<span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted-foreground))]">
					추천 국가
				</span>
				<span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted-foreground))]">
					점수 계산
				</span>
				<span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted-foreground))]">
					지도에서 비교
				</span>
				</div>

				{/* CTA */}
				<div className="mt-6 flex flex-col items-center justify-center gap-2">
				<Link
					href="/map"
					className="
					inline-flex items-center justify-center
					rounded-xl bg-[rgb(var(--fg))]
					px-7 py-3 text-sm font-semibold
					text-[rgb(var(--bg))]
					transition
					hover:opacity-90
					"
				>
					GET STARTED
				</Link>

				<p className="text-xs text-[rgb(var(--muted-foreground))]">
					지도에서 추천 국가를 바로 확인해요
				</p>

				{/* ✅ 보조 CTA는 텍스트 링크로만 */}
				<Link
					href="/test"
					className="mt-2 text-xs text-[rgb(var(--muted-foreground))] underline underline-offset-4 transition hover:text-fg"
				>
					내 점수 먼저 확인하기 →
				</Link>
				</div>
			</div>
			</div>
		</section>

		{/* Footer */}
		<footer className="mx-auto max-w-5xl px-6 pb-10 pt-6 text-xs text-[rgb(var(--muted-foreground))]">
			© {new Date().getFullYear()} Whalley Score
		</footer>
		</main>
	);
}
