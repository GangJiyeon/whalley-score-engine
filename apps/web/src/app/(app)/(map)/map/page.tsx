"use client";

import { useMemo, useState } from "react";
import RecommendationsPanel, {
  RecommendationItem,
} from "@/shared/components/RecommendationsPanel";

export default function MapPage() {
  // desktop panel state
  const [desktopWidth, setDesktopWidth] = useState(360);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // mobile sheet state (px). 0 = hidden
  const [mobileHeight, setMobileHeight] = useState(0);

  const items: RecommendationItem[] = useMemo(
    () => [
      { id: "au", country: "Australia", score: 82 },
      { id: "ca", country: "Canada", score: 74 },
      { id: "nz", country: "New Zealand", score: 71 },
      { id: "de", country: "Germany", score: 61 },
      { id: "jp", country: "Japan", score: 58 },
    ],
    []
  );

  // Map should be “pushed” on mobile when bottom sheet is open:
  const mapPaddingBottom = Math.max(0, mobileHeight);

  return (
    <div className="relative h-full w-full top-20 right-5">
      {/* Desktop layout: map + right docked panel (pushes map) */}
      <div className="hidden h-full w-full md:flex">
        <section className="relative flex-1 bg-neutral-100">
          <div className="absolute inset-0">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-xl font-semibold">Map Area</h1>
                <p className="mt-2 text-fg">지도 영역</p>
              </div>
            </div>
          </div>
        </section>

        <RecommendationsPanel
          items={items}
          desktopWidth={desktopWidth}
          setDesktopWidth={setDesktopWidth}
          desktopCollapsed={desktopCollapsed}
          setDesktopCollapsed={setDesktopCollapsed}
          mobileHeight={mobileHeight}
          setMobileHeight={setMobileHeight}
        />
      </div>

      {/* Mobile layout: map full + bottom sheet pushes map via padding */}
      <div className="md:hidden h-full w-full">
        <section
          className="relative h-full w-full bg-neutral-100"
          style={{ paddingBottom: mapPaddingBottom }}
        >
          <div className="absolute inset-0">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-xl font-semibold">Map Area</h1>
                <p className="mt-2 text-fg">지도 영역</p>
              </div>
            </div>
          </div>
        </section>

        <RecommendationsPanel
          items={items}
          desktopWidth={desktopWidth}
          setDesktopWidth={setDesktopWidth}
          desktopCollapsed={desktopCollapsed}
          setDesktopCollapsed={setDesktopCollapsed}
          mobileHeight={mobileHeight}
          setMobileHeight={setMobileHeight}
        />
      </div>
    </div>
  );
}
