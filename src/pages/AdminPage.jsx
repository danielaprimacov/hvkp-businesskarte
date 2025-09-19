// src/admin/AdminPage.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useContent } from "../content/content";
import { useAuth } from "../content/auth";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../lib/cloudinaryClient";

/* ========= Utility helpers ========= */
// Formats camelCase / snake_case into spaced header text
const titleize = (k) =>
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .trim();

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const isArrayOfStrings = (a) =>
  Array.isArray(a) && a.every((x) => typeof x === "string");
const isArrayOfObjects = (a) => Array.isArray(a) && a.every((x) => isObj(x));

/* ========= Input field components ========= */
// Text field: switches to textarea for longer content
function TextField({ label, value, onChange }) {
  // heuristic for multiline
  const isMulti = typeof value === "string" && value.length > 80;
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {isMulti ? (
        <textarea
          // responsive height: small on mobile, grows with content
          rows={Math.min(8, Math.max(3, Math.ceil(value.length / 120)))}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                     placeholder-gray-400 resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                     placeholder-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// String array editor (e.g., subtitles)
function StringArrayField({ label, value, onChange }) {
  const updateIdx = (i, v) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };
  const addItem = () => onChange([...(value || []), ""]);
  const removeIdx = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
        >
          + Hinzufügen
        </button>
      </div>
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={v}
              onChange={(e) => updateIdx(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeIdx(i)}
              className="px-3 py-2 rounded border hover:bg-gray-50 cursor-pointer"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Object array editor (e.g., logos with {url, alt})
function ObjectArrayField({ label, value, onChange }) {
  const [busyIdx, setBusyIdx] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const updateItem = (i, k, v) => {
    const next = value.map((obj, idx) =>
      idx === i ? { ...obj, [k]: v } : obj
    );
    onChange(next);
  };
  const addItem = () => onChange([...(value || []), {}]);
  const removeIdx = (i) => onChange(value.filter((_, idx) => idx !== i));

  const handlePickFile = async (i, file) => {
    if (!file) return;
    setErrMsg("");
    setBusyIdx(i);
    try {
      const result = await uploadToCloudinary(file, {
        folder: "hovekamp/logos",
      });
      // result.secure_url / result.public_id
      const next = value.map((obj, idx) =>
        idx === i
          ? {
              ...obj,
              url: result.secure_url,
              publicId: result.public_id,
              // keep alt untouched; admin can type it
            }
          : obj
      );
      onChange(next);
    } catch (e) {
      console.error(e);
      setErrMsg("Upload fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setBusyIdx(null);
    }
  };

  const handleReplace = (i) => (e) => {
    const file = e.target.files?.[0];
    if (file) handlePickFile(i, file);
    e.target.value = ""; // reset so same file can be picked again
  };

  const handleDeleteAsset = async (i) => {
    const obj = value[i] || {};
    // 1) remove from content immediately
    removeIdx(i);
    // 2) optionally delete from Cloudinary if publicId present (best-effort)
    if (obj.publicId) {
      try {
        await deleteFromCloudinary(obj.publicId);
      } catch (e) {
        // not fatal; asset may remain in Cloudinary
        console.warn("Cloudinary delete failed:", e);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
        >
          + Hinzufügen
        </button>
      </div>

      {errMsg && <div className="mb-2 text-sm text-red-600">{errMsg}</div>}

      {/* responsive cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {value.map((obj, i) => (
          <div key={i} className="rounded-2xl border p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold opacity-70">
                Eintrag {i + 1}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAsset(i)}
                className="px-3 py-1.5 rounded border hover:bg-gray-50 text-sm cursor-pointer"
                disabled={busyIdx === i}
              >
                Entfernen
              </button>
            </div>

            {/* Preview */}
            {obj.url ? (
              <div className="mb-3">
                <img
                  src={obj.url}
                  alt={obj.alt || "Logo"}
                  className="h-16 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="mb-3 text-xs text-gray-500">
                Kein Bild hochgeladen.
              </div>
            )}

            {/* Upload / Replace */}
            <div className="mb-3">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <span className="px-3 py-1.5 rounded border hover:bg-gray-50">
                  {obj.url ? "Bild ersetzen" : "Bild hochladen"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReplace(i)}
                  disabled={busyIdx === i}
                />
                {busyIdx === i && (
                  <span className="text-xs text-gray-500">Lade hoch…</span>
                )}
              </label>
            </div>

            {/* Known fields */}
            <TextField
              label="Alt-Text"
              value={obj.alt ?? ""}
              onChange={(v) => updateItem(i, "alt", v)}
            />

            {/* Readonly info */}
            {obj.publicId && (
              <div className="text-[11px] text-gray-500 break-all">
                <div>
                  <b>publicId:</b> {obj.publicId}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========= Recursive form renderer ========= */
// Renders any nested shape: strings, string[], object[], nested objects
function FormRenderer({ node, basePath, update }) {
  if (typeof node === "string") {
    return (
      <TextField
        label={titleize(basePath.split(".").slice(-1)[0])}
        value={node}
        onChange={(v) => update(basePath, v)}
      />
    );
  }

  if (Array.isArray(node)) {
    if (isArrayOfStrings(node)) {
      return (
        <StringArrayField
          label={titleize(basePath.split(".").slice(-1)[0])}
          value={node}
          onChange={(arr) => update(basePath, arr)}
        />
      );
    }
    if (isArrayOfObjects(node)) {
      return (
        <ObjectArrayField
          label={titleize(basePath.split(".").slice(-1)[0])}
          value={node}
          onChange={(arr) => update(basePath, arr)}
        />
      );
    }
    return null;
  }

  if (isObj(node)) {
    // responsive inner layout: single col on mobile, 2 cols on md+
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(node).map(([k, v]) => {
          if (k === "__v") return null;
          const path = `${basePath}.${k}`;
          if (isObj(v) || Array.isArray(v)) {
            return (
              <div key={k} className="md:col-span-2">
                <SectionCard title={titleize(k)}>
                  <FormRenderer node={v} basePath={path} update={update} />
                </SectionCard>
              </div>
            );
          }
          return (
            <FormRenderer key={k} node={v} basePath={path} update={update} />
          );
        })}
      </div>
    );
  }

  return null;
}

/* ========= Collapsible section card ========= */
// Collapsed by default; large touch target; responsive spacing
function SectionCard({ title, children }) {
  // start closed by default (per your request)
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border shadow-sm bg-white">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-4 md:py-3 rounded-2xl cursor-pointer"
      >
        <span className="text-base md:text-lg font-semibold">{title}</span>
        <span className="text-lg md:text-sm opacity-60">
          {open ? "–" : "+"}
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/* ========= Main Admin Page ========= */
export default function AdminPage() {
  const { content, update, reset, saving, conflict } = useContent();

  const { logout } = useAuth();

  // Build tabs from content.pages
  const pages = content?.pages || {};
  const pageKeys = useMemo(() => Object.keys(pages), [pages]);
  const [active, setActive] = useState(pageKeys[0] || "home");

  const ActivePageNode = pages[active];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Fixed top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur bg-white/80 shadow-sm pb-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">
            Admin Inhalte
            <span className="ml-2 text-xs align-middle text-blue-700">
              {saving
                ? "Speichern…"
                : conflict
                ? "Konflikt – neu laden"
                : "Gespeichert"}
            </span>
          </h1>
          {conflict && (
            <div className="mb-3 text-xs text-red-600">
              Inhalte wurden auf dem Server geändert. Bitte Seite neu laden.
            </div>
          )}

          {/* --- Tabs --- */}
          {/* Mobile: vertical stacked buttons */}
          <div className="flex flex-col gap-2 sm:hidden mb-3">
            {pageKeys.map((k) => (
              <button
                key={k}
                onClick={() => setActive(k)}
                className={
                  "px-3 py-2 rounded-full text-sm border transition text-left cursor-pointer " +
                  (active === k
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white hover:bg-blue-50")
                }
              >
                {titleize(k)}
              </button>
            ))}
          </div>

          {/* Desktop: horizontal row */}
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-2">
              {pageKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setActive(k)}
                  className={
                    "px-3 py-1.5 rounded-full text-sm border border-transparent transition cursor-pointer " +
                    (active === k
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white hover:bg-blue-50")
                  }
                >
                  {titleize(k)}
                </button>
              ))}
            </div>

            {/* --- Actions --- */}
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="px-2 text-xs cursor-pointer hover:text-blue-600 transition duration-300 ease-in sm:px-3 sm:py-2 sm:text-sm"
                title="Alle Änderungen zurücksetzen"
              >
                Zurücksetzen
              </button>
              <button
                onClick={logout}
                className="px-2 text-xs cursor-pointer hover:text-blue-600 transition duration-300 ease-in sm:px-3 sm:py-2 sm:text-sm"
                title="Abmelden"
              >
                Abmelden
              </button>
              <Link
                to="/"
                className="px-2 py-1.5 text-xs hover:text-blue-600 sm:px-3 transition duration-300 ease-in sm:py-2 sm:text-sm"
                title="Zurück zur Website"
              >
                Zurück
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add top padding so content is not hidden behind fixed nav */}
      <div className="pt-70 sm:pt-30"></div>

      {/* Active page content area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {!ActivePageNode ? (
          <div className="text-gray-600">
            Keine Daten für Seite <b>{active}</b>.
          </div>
        ) : (
          <div className="grid gap-5">
            {/* outer card for the page schema */}
            <SectionCard title={titleize(active)}>
              <FormRenderer
                node={ActivePageNode}
                basePath={`pages.${active}`}
                update={update}
              />
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
