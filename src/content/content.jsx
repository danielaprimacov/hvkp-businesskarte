import { createContext, useContext, useEffect, useState, useMemo } from "react";

// const defaults = {
//   heroTitle: "Hovekamp",
//   heroSubtitle: "Planung, Montage, Logistik – alles aus einer Hand",
//   servicesTitle: "Unsere Leistungen",
//   contactLead:
//     "Von Reparatur bis Montagen – kompletter Service rund um Ihren Turmdrehkran.",
// };

const DEFAULTS_VERSION = 3;

const defaults = {
  __v: DEFAULTS_VERSION,
  pages: {
    home: {
      heroSection: {
        title: "Hovekamp",
        subTitle: "Planung, Montage, Logistik – alles aus einer Hand",
      },
      craneManufactures: {
        title: "Unsere Kranmarken",
        logos: [
          { url: "/logos/Liebherr-Logo.png", alt: "Liebherr Logo" },
          { url: "/logos/Potain-Logo.png", alt: "Potain Logo" },
        ],
      },
      servicesSection: {
        title: "Unsere Leistungen",
        serviceTitle: [
          "Krantransporte",
          "Montage und Demontage",
          "Reparatur und Ersatzteile",
        ],
        serviceSubtitle: [
          "sicher und pünktlich",
          "fachgerecht und termingerecht",
          "schnell und zuverlässig",
        ],
      },
      contactSection: {
        text: "Von Reparatur bis Montagen, wir haben den kompletten Service rund um ihren Turmdrehkran. Sie suchen eine Kran zum Kauf oder zur Miete oder einfach nur Ersatzteile?",
        paragraph:
          "Fragen Sie bei uns an. Wir haben fast immer das passende Angebot für Sie und können auch kurzfristig helfen.",
        question: "Sind Sie bereit, Ihr nächstes Projekt zu besprechen?",
      },
    },
    transport: {},
    demontage: {},
    reparatur: {},
    contact: {},
  },
};

/* ========= STORAGE KEYS ========= */
const KEY_OVERRIDES = "siteContent_overrides_v1";
const KEY_OLD_FULL = "siteContent_v1";

/* ========= HELPERS ========= */
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function deepMerge(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return b !== undefined ? b : a;
  }
  if (isObj(a) && isObj(b)) {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = deepMerge(a?.[k], b[k]);
    return out;
  }
  return b !== undefined ? b : a;
}

function normalizeDeep(x) {
  if (typeof x === "string") {
    return x
      .replaceAll("&ndash;", "–")
      .replaceAll("&mdash;", "—")
      .replaceAll("&nbsp;", " ");
  }
  if (Array.isArray(x)) return x.map(normalizeDeep);
  if (isObj(x)) {
    const out = {};
    for (const k in x) out[k] = normalizeDeep(x[k]);
    return out;
  }
  return x;
}

function setAtPath(obj, path, value) {
  const parts = Array.isArray(path) ? path : String(path).split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : isObj(next) ? { ...next } : {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

function delAtPath(obj, path) {
  const parts = Array.isArray(path) ? path : String(path).split(".");
  const stack = [];
  let cur = Array.isArray(obj) ? [...obj] : { ...obj };

  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    stack.push({ parent: cur, key: k });
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : isObj(next) ? { ...next } : {};
    cur = cur[k];
  }
  delete cur[parts[parts.length - 1]];

  for (let i = stack.length - 1; i >= 0; i--) {
    const { parent, key } = stack[i];
    if (isObj(parent[key]) && Object.keys(parent[key]).length === 0) {
      delete parent[key];
    }
  }
  return stack.length ? stack[0].parent : cur;
}

function deepDiff(base, obj) {
  if (Array.isArray(base) || Array.isArray(obj)) {
    const a = JSON.stringify(base);
    const b = JSON.stringify(obj);
    return a === b ? undefined : obj;
  }
  if (isObj(base) && isObj(obj)) {
    const out = {};
    const keys = new Set([
      ...Object.keys(base || {}),
      ...Object.keys(obj || {}),
    ]);
    for (const k of keys) {
      const d = deepDiff(base?.[k], obj?.[k]);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return base !== obj ? obj : undefined;
}

/* ========= MIGRATION (со старого полного контента) ========= */
function loadOverrides() {
  try {
    const raw = localStorage.getItem(KEY_OVERRIDES);
    if (raw) return normalizeDeep(JSON.parse(raw));

    const oldRaw = localStorage.getItem(KEY_OLD_FULL);
    if (oldRaw) {
      const oldFull = normalizeDeep(JSON.parse(oldRaw));
      const overrides = deepDiff(defaults, oldFull) || {};
      localStorage.setItem(KEY_OVERRIDES, JSON.stringify(overrides));
      // delete old key
      localStorage.removeItem(KEY_OLD_FULL);
      return overrides;
    }
  } catch {}
  return {};
}

/* ========= CONTEXT ========= */
const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState(() => loadOverrides());

  const content = useMemo(() => deepMerge(defaults, overrides), [overrides]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_OVERRIDES, JSON.stringify(overrides));
    } catch {}
  }, [overrides]);

  // API
  const update = (path, value) => {
    if (typeof path === "string") {
      setOverrides((prev) => setAtPath(prev, path, normalizeDeep(value)));
    } else if (path && typeof path === "object") {
      setOverrides((prev) => deepMerge(prev, normalizeDeep(path)));
    }
  };

  const remove = (path) => {
    setOverrides((prev) => delAtPath(prev, path));
  };

  const reset = () => setOverrides({});

  return (
    <ContentCtx.Provider value={{ content, update, remove, reset }}>
      {children}
    </ContentCtx.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
