const API_BASE = import.meta.env.VITE_CMS_API || "/api";
const ADMIN_TOKEN = import.meta.env.VITE_CMS_ADMIN_TOKEN || ""; // only needed for delete

export async function getCloudinarySignature(folder) {
  const r = await fetch(`${API_BASE}/cloudinary/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!r.ok) throw new Error("sign_failed");
  return r.json(); // { cloudName, apiKey, signature, timestamp, folder }
}

export async function uploadToCloudinary(file, opts = {}) {
  const { folder } = opts;
  const sig = await getCloudinarySignature(folder);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  // you can also append eager / transformation here if you matched it in signature

  const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
  const r = await fetch(uploadUrl, { method: "POST", body: form });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`upload_failed: ${t || r.status}`);
  }
  return r.json(); // contains secure_url, public_id, width, height, etc.
}

export async function deleteFromCloudinary(publicId) {
  const r = await fetch(`${API_BASE}/cloudinary/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
    },
    body: JSON.stringify({ publicId }),
  });
  if (!r.ok) throw new Error("delete_failed");
  return r.json();
}
