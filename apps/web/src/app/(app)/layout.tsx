import AppShell from "@/shared/ui/app-shell/AppShell";
import React from "react";

export default function AppLayout({ children, }: { children: React.ReactNode}) {
    return <AppShell>{children}</AppShell>;
}