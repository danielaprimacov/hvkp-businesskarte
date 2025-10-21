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

  // Speed tuning + prefers-reduced-motion
  useEffect(() => {
    const apply = () => {
      const base = window.innerWidth < 640 ? 32 : 40;
      speedRef.current = base;
    };
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) speedRef.current = 22;
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Measure widths & decide how many copies we need for seamless loop
  const measure = useCallback(() => {
    const g = groupRef.current;
    const sc = scrollerRef.current;
    if (!g || !sc) return;

    const wGroup = g.getBoundingClientRect().width || 0;
    const wCont = sc.getBoundingClientRect().width || 0;

    setGroupW(wGroup);
    // Ensure enough content off-screen so looping is seamless while autoplaying or swiping
    if (wGroup > 0) {
      const need = Math.max(3, Math.ceil((wCont * 2) / wGroup) + 1);
      setCopies(need);
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

  // Autoplay marquee via scrollLeft (works on mobile + desktop; user can swipe to interrupt)
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !groupW || !bilder.length) return;

    let running = true;
    const tick = (ts) => {
      if (!running) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts;

      const now = performance.now();
      const paused = now < pauseUntilRef.current;

      if (!paused) {
        sc.scrollLeft += speedRef.current * dt;
        // seamless wrap
        if (sc.scrollLeft >= groupW) sc.scrollLeft = sc.scrollLeft % groupW;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [groupW, bilder.length]);

  // Pause autoplay briefly on user interaction (touch/drag/wheel)
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;

    const onEnter = () => {
      // pause while hovered
      pauseUntilRef.current = Number.POSITIVE_INFINITY;
    };
    const onLeave = () => {
      // resume immediately and restart dt integration
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

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const lightboxOpen = Number.isInteger(lightboxIdx);

  // lock scroll + close on Esc
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

  const groups = Array.from({ length: Math.max(1, copies - 1) }, () => bilder);
  const ready = groupW > 0 && bilder.length > 0;

  return (
    <section className="pb-15 relative overflow-hidden">
      <h1 className="my-10 sm:my-12 md:my-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        {title}
      </h1>

      {/* Horizontal marquee that can be swiped (touch-drag) */}
      <div className="px-4 sm:px-0">
        <div
          ref={scrollerRef}
          className="overflow-x-auto overflow-y-hidden w-full"
          style={{
            WebkitOverflowScrolling: "touch",
            // hide scrollbars
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="inline-flex items-center min-w-max gap-6 sm:gap-10">
            {/* First group (measured) */}
            <div
              ref={groupRef}
              className="flex-none inline-flex items-center gap-6 sm:gap-10"
            >
              {bilder.map((it, i) => (
                <div key={`g0-${i}`} className="flex-shrink-0">
                  <img
                    src={it.url}
                    alt={it.alt || "Bild"}
                    className="h-40 sm:h-54 md:h-68 w-auto object-contain select-none pointer-events-auto cursor-pointer rounded"
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
            {/* Clones for seamless loop */}
            {ready &&
              groups.map((group, gi) => (
                <div
                  key={`clone-${gi}`}
                  className="flex-none inline-flex items-center gap-6 sm:gap-10"
                  aria-hidden="true"
                >
                  {group.map((it, i) => (
                    <div key={`g${gi + 1}-${i}`} className="flex-shrink-0">
                      <img
                        src={it.url}
                        alt=""
                        className="h-40 sm:h-54 md:h-68 w-auto object-contain select-none pointer-events-auto cursor-pointer rounded"
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

      {/* Lightbox (click outside or Esc to close) */}
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
