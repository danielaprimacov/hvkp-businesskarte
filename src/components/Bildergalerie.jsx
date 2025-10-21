import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

import { useContent } from "../content/content";

function Bildergalerie() {
  const { content } = useContent();
  const title = content.seiten.startseite.bildergalerie.titel;
  const bilder = content.seiten.startseite.bildergalerie.bilder || [];

  // Refs
  const scrollerRef = useRef(null); // horizontal scroll container
  const groupRef = useRef(null); // first (measured) group

  // Width of one group & number of copies
  const [groupW, setGroupW] = useState(0);
  const [copies, setCopies] = useState(3);

  // Auto-scroll speed (px/sec) and pause control
  const speedRef = useRef(40);
  const pauseUntilRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  // Speed tuned for phones (16% of vw/sec) with a floor
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const vw = Math.max(window.innerWidth, 320);
      const base = vw * (m?.matches ? 0.04 : 0.08);
      speedRef.current = Math.max(50, base); // min 50 px/sec
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Measure first strip and decide copies
  const measure = useCallback(() => {
    const g = groupRef.current;
    const sc = scrollerRef.current;
    if (!g || !sc) return;

    const wGroup = g.getBoundingClientRect().width || 0;
    const wCont = sc.getBoundingClientRect().width || 0;
    setGroupW(wGroup);

    if (wGroup > 0) {
      // 1 leading + original + trailing clones so there’s always content
      const total = Math.max(3, Math.ceil((wCont * 2) / wGroup) + 1);
      setCopies(total);
    }
  }, []);

  useLayoutEffect(() => {
    const g = groupRef.current;
    const sc = scrollerRef.current;
    if (!g || !sc) return;
    const ro = new ResizeObserver(measure);
    ro.observe(g);
    ro.observe(sc);
    requestAnimationFrame(measure);
    return () => ro.disconnect();
  }, [measure, bilder]);

  const handleImgLoad = () => requestAnimationFrame(measure);

  // Start in the middle strip (after leading clone)
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !groupW) return;
    sc.scrollLeft = groupW;
  }, [groupW]);

  // Keep user in the middle segment for infinite swipe both ways
  const wrapScroll = useCallback(() => {
    const sc = scrollerRef.current;
    if (!sc || !groupW) return;
    if (sc.scrollLeft < 1) sc.scrollLeft += groupW; // jumped before start
    else if (sc.scrollLeft >= 2 * groupW - 1) sc.scrollLeft -= groupW; // past end
  }, [groupW]);

  // Autoplay via scrollLeft (with sub-pixel carry), then wrap
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !groupW || !bilder.length) return;

    let running = true;
    sc._carry = sc._carry || 0;

    const tick = (ts) => {
      if (!running) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const now = performance.now();
      const paused = now < pauseUntilRef.current;

      if (!paused) {
        const dist = speedRef.current * dt + (sc._carry || 0);
        const step = dist | 0; // integer pixels
        sc._carry = dist - step; // keep fractional remainder
        sc.scrollLeft += step;
        wrapScroll();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [groupW, bilder.length, wrapScroll]);

  // Pause on hover (desktop); resume on leave
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const onEnter = () => {
      pauseUntilRef.current = Number.POSITIVE_INFINITY;
    };
    const onLeave = () => {
      pauseUntilRef.current = performance.now() - 1;
      lastTsRef.current = 0;
    };
    sc.addEventListener("mouseenter", onEnter);
    sc.addEventListener("mouseleave", onLeave);
    return () => {
      sc.removeEventListener("mouseenter", onEnter);
      sc.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // When user swipes/wheels, keep wrap and pause autoplay briefly
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const onScroll = () => {
      wrapScroll();
    };
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => sc.removeEventListener("scroll", onScroll);
  }, [wrapScroll]);

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const lightboxOpen = Number.isInteger(lightboxIdx);
  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setLightboxIdx(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen]);

  // Build: 1 leading clone + original + trailing clones
  const total = Math.max(3, copies);
  const leadingGroups = Array.from({ length: 1 }, () => bilder);
  const trailingGroups = Array.from({ length: total - 2 }, () => bilder);
  const ready = groupW > 0 && bilder.length > 0;

  return (
    <section className="pb-15 relative overflow-hidden">
      <h1 className="my-10 sm:my-12 md:my-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        {title}
      </h1>

      <div className="px-4 sm:px-0">
        <div
          ref={scrollerRef}
          className="overflow-x-auto w-full"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* IMPORTANT: no wrapping + track wider than its contents */}
          <div className="flex flex-nowrap items-center min-w-max gap-6 sm:gap-10">
            {/* Leading clone(s) */}
            {ready &&
              leadingGroups.map((group, gi) => (
                <div
                  key={`lead-${gi}`}
                  className="flex flex-nowrap items-center gap-6 sm:gap-10"
                  aria-hidden="true"
                >
                  {group.map((it, i) => (
                    <div key={`L${gi}-${i}`} className="flex-shrink-0">
                      <img
                        src={it.url}
                        alt=""
                        className="h-40 sm:h-56 md:h-72 w-auto object-contain select-none cursor-pointer rounded"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        onClick={() => setLightboxIdx(i)}
                        onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                      />
                    </div>
                  ))}
                </div>
              ))}

            {/* Original strip (measured) */}
            <div
              ref={groupRef}
              className="flex flex-nowrap items-center gap-6 sm:gap-10"
            >
              {bilder.map((it, i) => (
                <div key={`orig-${i}`} className="flex-shrink-0">
                  <img
                    src={it.url}
                    alt={it.alt || "Bild"}
                    className="h-40 sm:h-56 md:h-72 w-auto object-contain select-none cursor-pointer rounded"
                    draggable="false"
                    loading="eager"
                    decoding="async"
                    onLoad={handleImgLoad}
                    onClick={() => setLightboxIdx(i)}
                    onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                  />
                </div>
              ))}
            </div>

            {/* Trailing clone(s) */}
            {ready &&
              trailingGroups.map((group, gi) => (
                <div
                  key={`trail-${gi}`}
                  className="flex flex-nowrap items-center gap-6 sm:gap-10"
                  aria-hidden="true"
                >
                  {group.map((it, i) => (
                    <div key={`T${gi}-${i}`} className="flex-shrink-0">
                      <img
                        src={it.url}
                        alt=""
                        className="h-40 sm:h-56 md:h-72 w-auto object-contain select-none cursor-pointer rounded"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        onClick={() => setLightboxIdx(i)}
                        onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-w-[95vw] max-h-[90vh]">
            <img
              src={bilder[lightboxIdx]?.url}
              alt={bilder[lightboxIdx]?.alt || `Bild ${lightboxIdx + 1}`}
              className="max-w-[95vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              aria-label="Schließen"
              className="absolute top-2 right-2 h-10 w-10 rounded-full bg-black/60 text-white grid place-items-center cursor-pointer"
              onClick={() => setLightboxIdx(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Bildergalerie;
