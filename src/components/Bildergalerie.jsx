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
  const logos = content.seiten.startseite.bildergalerie.bilder || [];

  const NORMAL = 80;
  const [duration, setDuration] = useState(NORMAL);

  // Refs for measuring widths
  const containerRef = useRef(null);
  const groupRef = useRef(null);

  // width of ONE strip (original group)
  const [trackW, setTrackW] = useState(0);

  useEffect(() => {
    const apply = () => {
      const isXS = window.innerWidth < 640;
      setDuration(isXS ? 70 : NORMAL);
    };
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) setDuration(NORMAL * 1.5);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const measure = useCallback(() => {
    const group = groupRef.current;
    if (!group) return;
    const wGroup = group.getBoundingClientRect().width || 0;
    setTrackW(wGroup);
  }, []);

  useLayoutEffect(() => {
    const group = groupRef.current;
    const cont = containerRef.current;
    if (!group || !cont) return;

    const ro = new ResizeObserver(measure);
    ro.observe(group);
    ro.observe(cont);

    requestAnimationFrame(measure);
    return () => ro.disconnect();
  }, [measure, logos]);

  const handleImgLoad = () => requestAnimationFrame(measure);

  const ready = trackW > 0 && logos.length > 0;

  return (
    <section className="pb-15 relative overflow-hidden">
      <h1 className="my-10 sm:my-12 md:my-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        {title}
      </h1>

      <div ref={containerRef} className="overflow-hidden px-4 sm:px-0">
        <div
          key={`${trackW}-${duration}-${logos.length}`}
          className="inline-flex items-center min-w-max will-change-transform gap-6 sm:gap-10"
          style={{
            // travel exactly one strip width, then the clone takes over seamlessly
            ["--track-w"]: `${trackW}px`,
            animation: ready
              ? `marquee-x ${duration}s linear infinite`
              : "none",
          }}
        >
          {/* ORIGINAL STRIP (measured for width) */}
          <div
            ref={groupRef}
            className="inline-flex items-center gap-6 sm:gap-10"
          >
            {logos.map((it, i) => (
              <div key={`orig-${i}`} className="flex-shrink-0">
                <img
                  src={it.url}
                  alt={it.alt || "Bild"}
                  className="h-40 sm:h-54 md:h-68 w-auto object-contain select-none pointer-events-none rounded"
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  onLoad={handleImgLoad}
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              </div>
            ))}
          </div>

          {/* ONE CLONE for seamless wrap */}
          <div
            className="inline-flex items-center gap-6 sm:gap-10"
            aria-hidden="true"
          >
            {logos.map((it, i) => (
              <div key={`clone-${i}`} className="flex-shrink-0">
                <img
                  src={it.url}
                  alt=""
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain select-none pointer-events-none"
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                  onLoad={handleImgLoad}
                  onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Bildergalerie;
