import { createContext, useContext, useEffect, useState, useMemo } from "react";

import { fetchContentFromServer, saveContentToServer } from "../lib/cmsApi";

const DEFAULTS_VERSION = 11;

const defaults = {
  __v: DEFAULTS_VERSION,
  seiten: {
    startseite: {
      introbereich: {
        abschnittstitel: "Hovekamp",
        abschnittsuntertitel:
          "Planung, Montage, Logistik – alles aus einer Hand",
      },
      bildergalerie: {
        titel: "Bildergalerie",
        bilder: [
          { url: "/bilder/bild-1.webp", alt: "Turmdrehkrane Bild 1" },
          { url: "/bilder/bild-2.webp", alt: "Turmdrehkrane Bild 2" },
          { url: "/bilder/bild-3.webp", alt: "Turmdrehkrane Bild 3" },
          { url: "/bilder/bild-4.webp", alt: "Turmdrehkrane Bild 4" },
          { url: "/bilder/bild-5.webp", alt: "Turmdrehkrane Bild 5" },
          { url: "/bilder/bild-6.webp", alt: "Turmdrehkrane Bild 6" },
          { url: "/bilder/bild-7.webp", alt: "Turmdrehkrane Bild 7" },
          { url: "/bilder/bild-8.webp", alt: "Turmdrehkrane Bild 8" },
          { url: "/bilder/bild-9.webp", alt: "Turmdrehkrane Bild 9" },
          { url: "/bilder/bild-10.webp", alt: "Turmdrehkrane Bild 10" },
          { url: "/bilder/bild-11.webp", alt: "Turmdrehkrane Bild 11" },
          { url: "/bilder/bild-12.webp", alt: "Turmdrehkrane Bild 12" },
          { url: "/bilder/bild-13.webp", alt: "Turmdrehkrane Bild 13" },
        ],
      },
      leistungsbereich: {
        titel: "Unsere Leistungen",
        leistungen: [
          {
            titel: "Krantransporte",
            untertitel: "sicher und pünktlich",
            bild: {
              url: "/services/transport-crane.webp",
              alt: "Transport Turmdrehkran",
            },
          },
          {
            titel: "Montage und Demontage",
            untertitel: "fachgerecht und termingerecht",
            bild: {
              url: "/services/montage-demontage-crane.webp",
              alt: "Montage oder Demontage Turmdrehkran",
            },
          },
          {
            titel: "Reparatur und Ersatzteile",
            untertitel: "schnell und zuverlässig",
            bild: {
              url: "/services/reparatur-crane.webp",
              alt: "Reparatur Turmdrehkran",
            },
          },
        ],
      },
      kontaktbereich: {
        leistungsbeschreibung:
          "Von Reparatur bis Montagen, wir haben den kompletten Service rund um ihren Turmdrehkran. Sie suchen eine Kran zum Kauf oder zur Miete oder einfach nur Ersatzteile?",
        hinweistext:
          "Fragen Sie bei uns an. Wir haben fast immer das passende Angebot für Sie und können auch kurzfristig helfen.",
        frage: "Sind Sie bereit, Ihr nächstes Projekt zu besprechen?",
      },
    },
    transportSeite: {
      introbereich: {
        titel: "Krantransporte",
        untertitel:
          "Planung, Genehmigungen sowie Transportbegleitung und Absicherung.",
      },
      leistungsbeschreibung:
        "Wir übernehmen Planung, Ausnahmegenehmigungen und Begleitfahrzeuge für Ihren Krantransport",
      hinweistext:
        "Für ein schnelles Angebot senden Sie uns Maße/Gewichte der Komponenten, Abhol- und Zieladresse sowie Ihr Zeitfenster - wir melden uns kurzfristig mit einem Festpreis.",
      hilfebereich: {
        titel: "Benötigen Sie zusätzlich die (De-)Montage?",
        untertitel:
          "Unser Team übernimmt die komplette Montage und Demontage Ihres Turmdrehkrans – von der Planung und Baustellenlogistik über Ballastierung und Elektroanschluss bis zur sicheren Abnahme. Kurzfristige Termine möglich.",
      },
    },
    demontageSeite: {
      introbereich: {
        titel: "Montage & Demontage",
        untertitel:
          "Planung, Demontage und Montage sowie Koordination von Autokranen und Ballastierung.",
      },
      leistungsbeschreibung:
        "Wir übernehmen Planung, (De-)Montage und Abnahme Ihres Turmdrehkrans – fachgerecht und termingerecht.",
      hinweistext:
        "Für ein schnelles Angebot senden Sie uns Kranmodell/Typ, Baustellenadresse, Zugänglichkeit (Autokran-/Stellfläche), ggf. Auslegerlänge/Ballast sowie Ihr Zeitfenster – wir melden uns kurzfristig mit einem Festpreis.",
      hilfebereich: {
        titel: "Benötigen Sie einen Krantransport?",
        untertitel:
          "Planung, Koordination der Fahrzeuge und Begleitfahrzeuge, abgestimmte Zeitfenster und zuverlässige Zustellung – alles aus einer Hand. Kurzfristige Einsätze möglich.",
      },
    },
    reparaturSeite: {
      introbereich: {
        titel: "Reparatur & Ersatzteile",
        untertitel:
          "Fehlersuche, Reparatur und Service sowie Ersatzteilbeschaffung und Funktionsprüfung.",
      },
      leistungsbeschreibung:
        "Wir übernehmen Diagnose, Reparatur und Ersatzteilbeschaffung – schnell und zuverlässig.",
      hinweistext:
        "Für ein schnelles Angebot senden Sie uns Kranmodell/Typ, Seriennummer, Fehlerbild (kurze Beschreibung/Fotos), Standort sowie Ihr Zeitfenster – wir melden uns kurzfristig mit einem Festpreis.",
    },
  },
};

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function deepMerge(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (b === undefined) return a;
    // Prevent empty arrays from wiping defaults
    return Array.isArray(b) && b.length === 0 ? a : b;
  }
  if (isObj(a) && isObj(b)) {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = deepMerge(a?.[k], b[k]);
    return out;
  }
  return b !== undefined ? b : a;
}

function normalizeDeep(x) {
  if (typeof x === "string")
    return x
      .replaceAll("&ndash;", "–")
      .replaceAll("&mdash;", "—")
      .replaceAll("&nbsp;", " ");
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
    if (isObj(parent[key]) && Object.keys(parent[key]).length === 0)
      delete parent[key];
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

/* ===== Context backed by the server ===== */
const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  const [serverVersion, setServerVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(null); // contains server snapshot on conflict

  // 1) Initial load from server
  useEffect(() => {
    (async () => {
      try {
        const { body, version } = await fetchContentFromServer();
        const initialOverrides = deepDiff(defaults, normalizeDeep(body)) || {};

        const lb = initial?.seiten?.startseite?.leistungsbereich;
        if (lb) {
          delete lb.abschnittstitel;
          delete lb.abschnittsuntertitel;
        }

        setOverrides(initialOverrides);
        setServerVersion(version);
      } catch (e) {
        console.error("Failed to load content:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // The merged content the app uses
  const content = useMemo(() => deepMerge(defaults, overrides), [overrides]);

  // 2) Auto-save to server when overrides change (debounced in helper)
  useEffect(() => {
    if (loading) return;
    setSaving(true);
    const nextBody = deepMerge(defaults, overrides);
    saveContentToServer(nextBody, serverVersion)
      .then(({ version }) => {
        setServerVersion(version);
        setConflict(null);
      })
      .catch((e) => {
        if (e?.code === "version_conflict") {
          // Somebody else saved first — show a banner, let admin reload/resolve.
          setConflict(e.data); // { current: { body, version, updated_at } }
        } else {
          console.error("Save failed:", e);
        }
      })
      .finally(() => setSaving(false));
  }, [overrides]); // eslint-disable-line react-hooks/exhaustive-deps

  // public API — unchanged for your AdminPage
  const update = (path, value) => {
    if (typeof path === "string") {
      setOverrides((prev) => setAtPath(prev, path, normalizeDeep(value)));
    } else if (path && typeof path === "object") {
      setOverrides((prev) => deepMerge(prev, normalizeDeep(path)));
    }
  };

  const remove = (path) => setOverrides((prev) => delAtPath(prev, path));
  const reset = () => setOverrides({});

  return (
    <ContentCtx.Provider
      value={{ content, update, remove, reset, loading, saving, conflict }}
    >
      {children}
    </ContentCtx.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export const contentDefaults = defaults;
