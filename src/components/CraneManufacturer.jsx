import { useState, useEffect, useRef, useLayoutEffect } from "react";

import { useContent } from "../content/content";

function CraneManufacturer() {
  const { content } = useContent();
  const title = content.seiten.startseite.kranhersteller.titel;
  const logos = content.seiten.startseite.kranhersteller.logos || [];

  const NORMAL = 60;
  const [duration, setDuration] = useState(NORMAL);

  // Refs for measuring widths
  const containerRef = useRef(null);
  const groupRef = useRef(null);

  // Width of the first (original) logo group
  const [trackW, setTrackW] = useState(0);
  // How many copies of the group to render (at least 2: original + one clone)
  const [copies, setCopies] = useState(2);

  // slower for users that have small screens
  useEffect(() => {
    const apply = () => {
      const isXS = window.innerWidth < 640; // sm
      setDuration(isXS ? 70 : NORMAL);
    };
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) setDuration(NORMAL * 1.5);

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Measure the width of one full group and ensure we render enough copies
  // so there is no visual gap on very wide screens.
  useLayoutEffect(() => {
    const group = groupRef.current;
    const cont = containerRef.current;
    if (!group || !cont) return;

    const measure = () => {
      const wGroup = group.getBoundingClientRect().width;
      const wCont = cont.getBoundingClientRect().width;

      setTrackW(wGroup || 0);

      if (wGroup > 0 && wGroup < wCont) {
        const needed = Math.max(2, Math.ceil((wCont + wGroup) / wGroup));
        setCopies(needed);
      } else {
        setCopies(2);
      }
    };

    // Observe both container and group for any size changes
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    ro.observe(cont);

    // Also try once after next paint in case images are still decoding
    requestAnimationFrame(measure);

    return () => ro.disconnect();
  }, [logos]);

  // Build the list of groups (original + clones)
  const groups = Array.from({ length: copies }, () => logos);

  const ready = trackW > 0 && logos.length > 0;

  return (
    <div className="pb-15 relative overflow-hidden">
      <h1 className="my-10 sm:my-12 md:my-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        {title}
      </h1>
      <div ref={containerRef} className="overflow-hidden px-4 sm:px-0">
        <div
          key={`${trackW}-${duration}`} // restart animation when width/duration changes
          className="inline-flex items-center min-w-max will-change-transform gap-6 sm:gap-10"
          style={{
            ["--track-w"]: `${trackW}px`,
            animation: ready
              ? `marquee-x ${duration}s linear infinite`
              : "none",
          }}
        >
          {/* Original group (measured for width) */}
          <div
            ref={groupRef}
            className="inline-flex items-center gap-6 sm:gap-10"
          >
            {logos.map((it, i) => (
              <div key={`g0-${i}`} className="flex-shrink-0">
                <img
                  src={it.url}
                  alt={it.alt || "Client logo"}
                  className="h-14 sm:h-16 md:h-24 w-auto object-contain select-none pointer-events-none"
                  draggable="false"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              </div>
            ))}
          </div>

          {/* Clones (hidden from a11y; used to make the loop seamless) */}
          {groups.slice(1).map((group, gi) => (
            <div
              key={`clone-${gi}`}
              className="inline-flex items-center gap-6 sm:gap-10"
              aria-hidden="true"
            >
              {group.map((it, i) => (
                <div key={`g${gi + 1}-${i}`} className="flex-shrink-0">
                  <img
                    src={it.url}
                    alt={it.alt || "Client logo"}
                    className="h-14 sm:h-16 md:h-24 w-auto object-contain select-none pointer-events-none"
                    draggable="false"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CraneManufacturer;
