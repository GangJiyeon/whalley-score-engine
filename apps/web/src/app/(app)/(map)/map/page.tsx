export default function MapPage(){
    return (
        <div className="h-full w-full">
            <div className="flex h-full w-full">
                <section className="flex-1 bg-neutral-100">
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-xl font-semibold">Map Area1</h1>
                            <p className="mt-2 text-neutral-600">
                                지도 영역
                            </p>
                        </div>
                    </div>
                </section>
                <aside className="hidden md:block w-[360px] border-l bg-white">
                    <div className="h-full p-4 overflow-auto">
                        <h2 className="text-lg font-semibold">Recommendations</h2>
                        <p className="mt-2 text-sm text-neutral-600">
                            점수 높은 나라 목록/필터/정렬
                        </p>
                        <div className="mt-4 space-y-3">
                            {["Australia", "Canada", "New Zealand", "Germany"].map((name) => (
                                <div key={name} className="rounded-xl border p-3 hover:bg-neutral-50">
                                    <div className="font-medium">{name}</div>
                                    <div className="text-sm text-neutral-600">Score: --</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}