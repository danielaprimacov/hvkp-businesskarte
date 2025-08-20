import { useState } from "react";

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

  return (
    <div className="pb-15 relative overflow-hidden">
      <h1 className="my-15 text-4xl uppercase font-medium text-center tracking-widest">
        Unsere Kranmarken
      </h1>
      <div className="overflow-hidden">
        <div
          className="inline-flex items-center space-x-10 min-w-max"
          style={{
            animation: `scroll ${duration}s linear infinite`,
          }}
        >
          {logos.map((src, i) => (
            <div key={`first-${i}`} className="flex-shrink-0">
              <img
                src={src}
                alt="Client logo"
                className="h-24 w-50 object-contain"
              />
            </div>
          ))}

          {logos.map((src, i) => (
            <div key={`second-${i}`} className="flex-shrink-0">
              <img
                src={src}
                alt="Client logo"
                className="h-24 w-50 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CraneManufacturer;
