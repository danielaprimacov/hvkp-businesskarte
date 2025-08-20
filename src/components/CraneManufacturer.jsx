import { useState, useEffect } from "react";

import manufacturerLiebherrLogo from "../assets/images/Liebherr-Logo.png";
import manufacturerPotainLogo from "../assets/images/Potain-Logo.png";

const logos = [
  manufacturerLiebherrLogo,
  manufacturerPotainLogo,
  manufacturerLiebherrLogo,
  manufacturerPotainLogo,
  manufacturerLiebherrLogo,
  manufacturerPotainLogo,
];

function CraneManufacturer() {
  const NORMAL = 60;

  const [duration, setDuration] = useState(NORMAL);

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

  return (
    <div className="pb-15 relative overflow-hidden">
      <h1 className="my-10 sm:my-12 md:my-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        Unsere Kranmarken
      </h1>
      <div className="overflow-hidden px-4 sm:px-0">
        <div
          className="inline-flex items-center min-w-max space-x-6 sm:space-x-10 will-change-transform"
          style={{
            animation: `scroll ${duration}s linear infinite`,
          }}
        >
          {logos.map((src, i) => (
            <div key={`first-${i}`} className="flex-shrink-0">
              <img
                src={src}
                alt="Client logo"
                className="h-14 sm:h-16 md:h-24 w-auto object-contain select-none pointer-events-none"
                draggable="false"
                loading="lazy"
              />
            </div>
          ))}

          {logos.map((src, i) => (
            <div
              key={`second-${i}`}
              className="flex-shrink-0"
              aria-hidden="true"
            >
              <img
                src={src}
                alt="Client logo"
                className="h-14 sm:h-16 md:h-24 w-auto object-contain select-none pointer-events-none"
                draggable="false"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CraneManufacturer;
