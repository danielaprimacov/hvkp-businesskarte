const API_BASE = import.meta.env.VITE_CMS_API || "/api";
const ADMIN_TOKEN = import.meta.env.VITE_CMS_ADMIN_TOKEN || "";

// GET current content from the server
export async function fetchContentFromServer() {
  const r = await fetch(`${API_BASE}/content`, { credentials: "include" });
  if (!r.ok) throw new Error("Failed to load content");
  return r.json(); // { body, version, updated_at }
}

// Debounced PUT to server with optimistic locking
let t;
export function saveContentToServer(nextBody, version) {
  if (t) clearTimeout(t);
  return new Promise((resolve, reject) => {
    t = setTimeout(async () => {
      try {
        const r = await fetch(`${API_BASE}/content`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ body: nextBody, version }),
        });
        if (r.status === 409) {
          const data = await r.json(); // { error, current: { body, version, ... } }
          return reject({ code: "version_conflict", data });
        }
        if (!r.ok) throw new Error("Save failed");
        resolve(await r.json()); // { body, version, updated_at }
      } catch (e) {
        reject(e);
      }
    }, 400); // debounce
  });
}
