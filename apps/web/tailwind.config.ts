import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./src/shared/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "rgb(var(--bg) / <alpha-value>)",
                fg: "rgb(var(--fg) / <alpha-value>)",

                card: "rgb(var(--card) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                border: "rgb(var(--border) / <alpha-value>)",

                primary: "rgb(var(--primary) / <alpha-value>)",
                "primary-foreground":
                "rgb(var(--primary-foreground) / <alpha-value>)",

                "muted-foreground":
                "rgb(var(--muted-foreground) / <alpha-value>)",
            },
            fontFamily: {
                title: ["var(--font-montserrat-alternates)", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
