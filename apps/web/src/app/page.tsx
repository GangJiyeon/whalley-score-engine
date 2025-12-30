import Image from "next/image";
import { apiGet } from "@/shared/lib/api";

export default async function Home() {
  const health = await apiGet<{ ok: boolean }>("/health");

  return (
    <div>
      <pre>{JSON.stringify(health, null, 2)}</pre>
      <Image src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
    </div>
  );
}
