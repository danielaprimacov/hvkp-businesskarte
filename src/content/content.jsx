import { createContext, useContext, useEffect, useState } from "react";

const defaults = {
  heroTitle: "Hovekamp",
  heroSubtitle: "Planung, Montage, Logistik – alles aus einer Hand",
  servicesTitle: "Unsere Leistungen",
  contactLead:
    "Von Reparatur bis Montagen – kompletter Service rund um Ihren Turmdrehkran.",
};

const KEY = "siteContent_v1";
const ContentCtx = createContext(null);

const normalizeObj = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === "string"
        ? v
            .replaceAll("&ndash;", "–")
            .replaceAll("&mdash;", "—")
            .replaceAll("&nbsp;", " ")
        : v,
    ])
  );

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
      return normalizeObj(data);
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(content));
    } catch {}
  }, [content]);

  const update = (patch) => normalizeObj({ ...c, ...patch });
  const reset = () => setContent(defaults);

  return (
    <ContentCtx.Provider value={{ content, update, reset }}>
      {children}
    </ContentCtx.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
