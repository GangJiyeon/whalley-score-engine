export default function DefaultLayout({children}: {children: React.ReactNode}){
    return (
        <main
            className="
                mx-auto
                w-full
                mx-w-screen-xl
                p-4 md:p-6
            "
        >
            {children}
        </main>
    );
}