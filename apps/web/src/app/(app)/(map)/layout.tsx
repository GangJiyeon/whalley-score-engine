import React from "react";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-dvh w-full overflow-hidden">
      {children}
    </main>
  );
}
