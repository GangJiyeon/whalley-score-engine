import React from "react";

export default function MapLayout({children}: {children: React.ReactNode}){
    return(
        <main
            className="
            w-full
            p-0
            overflow-hidden
            h-[calc(100dvh-56px)]
            "
        >
            {children}
        </main>
    );
}