import { Link } from "react-router-dom";

import { useContent, contentDefaults } from "../content/content";

function Services() {
  const { content } = useContent();

  const lb = content?.seiten?.startseite?.leistungsbereich ?? {};
  const title = lb?.titel ?? "Unsere Leistungen";
  const defaultItems =
    contentDefaults.seiten.startseite.leistungsbereich.leistungen;

  const items =
    Array.isArray(lb.leistungen) && lb.leistungen.length > 0
      ? lb.leistungen
      : defaultItems;

  const ROUTES_BY_INDEX = ["/transport", "/de-montage", "/reparatur"];

  return (
    <div className="py-10 sm:py-12 md:py-15">
      <h1 className="mb-8 sm:mb-10 md:mb-15 text-2xl sm:text-3xl md:text-4xl uppercase font-medium text-center tracking-widest">
        {title}
      </h1>
      <div className="flex flex-col md:flex-row md:justify-evenly items-stretch md:items-start gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-10 pb-10 md:pb-15">
        {items.map((l, i) => {
          const to = ROUTES_BY_INDEX[i] || "#";
          const imgUrl = l?.bild?.url || "";
          const imgAlt = l?.bild?.alt || l?.titel || "Leistung";

          return (
            <Link
              key={`${to}-${i}`}
              to={to}
              className="flex flex-1 flex-col h-full border border-gray-200 rounded hover:shadow-sm transition duration-300"
            >
              <div className="flex justify-center items-center">
                <img
                  src={imgUrl}
                  alt={imgAlt}
                  className="w-full h-48 sm:h-56 md:h-70 object-cover rounded-t"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.opacity = "0.35")}
                />
              </div>

              <div className="text-center py-8 sm:py-10 md:py-15">
                <div className="min-h-[3.5rem] md:min-h-[2.75rem] flex items-center justify-center">
                  <h2 className="text-lg sm:text-xl tracking-wider">
                    {l?.titel}
                  </h2>
                </div>
                <p className="pt-2 sm:pt-3 text-black/70">{l?.untertitel}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Services;
