import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import nodemailer from "nodemailer";

import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

// ---------- Paths / constants ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ""; // Bearer for write API (use proper session in production)
const NODE_ENV = process.env.NODE_ENV || "development";

// CLOUDINARY
const C_CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const C_KEY = process.env.CLOUDINARY_API_KEY;
const C_SECRET = process.env.CLOUDINARY_API_SECRET;
const C_FOLDER = process.env.CLOUDINARY_FOLDER || "hovekamp/logos";

// DB selection: "sqlite" (default) or "postgres"
const DB_CLIENT = (process.env.DB_CLIENT || "sqlite").toLowerCase();

// ---------- Minimal rate-limit (for mail endpoint) ----------
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const rateMap = new Map();
function rateLimit(req, res, next) {
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const rec = rateMap.get(key) || { t: now, n: 0 };
  if (now - rec.t > RATE_WINDOW_MS) {
    rec.t = now;
    rec.n = 0;
  }
  rec.n++;
  rateMap.set(key, rec);
  if (rec.n > RATE_MAX)
    return res.status(429).json({ ok: false, error: "Too many requests" });
  next();
}

// ===========================================================
// 0) EXPRESS APP — ДОЛЖЕН БЫТЬ ДО ОБЪЯВЛЕНИЯ РОУТОВ!
// ===========================================================
const app = express();
app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? false
        : [/localhost:\d+$/, /127\.0\.0\.1:\d+$/],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "5mb" }));

// ===========================================================
// 1) DATABASE LAYER (SQLite default, optional Postgres)
// ===========================================================
let dbReadyPromise;
let getContent;
let updateContent;

if (DB_CLIENT === "postgres") {
  dbReadyPromise = (async () => {
    const { Pool } = await import("pg");
    const PG_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!PG_URL)
      throw new Error(
        "POSTGRES_URL (or DATABASE_URL) is required for DB_CLIENT=postgres"
      );
    const pool = new Pool({ connectionString: PG_URL });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        body JSONB NOT NULL,
        version INT NOT NULL DEFAULT 1,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await pool.query(
      `INSERT INTO content (id, body, version)
       VALUES ('site', $1::jsonb, 1)
       ON CONFLICT (id) DO NOTHING;`,
      [JSON.stringify({ __v: 5, pages: {} })]
    );

    getContent = async (id = "site") => {
      const { rows } = await pool.query(
        "SELECT id, body, version, updated_at FROM content WHERE id = $1",
        [id]
      );
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        id: r.id,
        body: r.body,
        version: r.version,
        updated_at: r.updated_at,
      };
    };

    updateContent = async (id, nextBody, expectedVersion) => {
      const { rows } = await pool.query(
        `UPDATE content
         SET body = $1::jsonb, version = version + 1, updated_at = now()
         WHERE id = $2 AND version = $3
         RETURNING id, body, version, updated_at`,
        [JSON.stringify(nextBody), id, expectedVersion]
      );
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        id: r.id,
        body: r.body,
        version: r.version,
        updated_at: r.updated_at,
      };
    };

    return "postgres-ready";
  })();
} else {
  dbReadyPromise = (async () => {
    const { default: Database } = await import("better-sqlite3");
    const DB_PATH =
      process.env.DB_PATH || path.resolve(__dirname, "../content.db");
    const db = new Database(DB_PATH);

    db.exec(`
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        body TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    const seedBody = JSON.stringify({ __v: 5, pages: {} });
    db.prepare(
      `INSERT OR IGNORE INTO content (id, body, version) VALUES ('site', ?, 1)`
    ).run(seedBody);

    getContent = async (id = "site") => {
      const row = db
        .prepare(
          "SELECT id, body, version, updated_at FROM content WHERE id = ?"
        )
        .get(id);
      if (!row) return null;
      return {
        id: row.id,
        body: JSON.parse(row.body),
        version: row.version,
        updated_at: row.updated_at,
      };
    };

    updateContent = async (id, nextBody, expectedVersion) => {
      const stmt = db.prepare(`
        UPDATE content
        SET body = @body, version = version + 1, updated_at = datetime('now')
        WHERE id = @id AND version = @version
      `);
      const res = stmt.run({
        id,
        body: JSON.stringify(nextBody),
        version: expectedVersion,
      });
      if (res.changes === 0) return null;
      return getContent(id);
    };

    return `sqlite-ready (${DB_PATH})`;
  })();
}

// ===========================================================
// 2) CLOUDINARY ROUTES (после app, есть body-parser)
// ===========================================================
if (!C_CLOUD || !C_KEY || !C_SECRET) {
  console.warn(
    "[Cloudinary] Missing env vars CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET"
  );
}

cloudinary.config({
  cloud_name: C_CLOUD,
  api_key: C_KEY,
  api_secret: C_SECRET,
});

// Signed upload signature
app.post("/api/cloudinary/sign", (req, res) => {
  try {
    if (!C_SECRET || !C_KEY || !C_CLOUD) {
      return res.status(500).json({ error: "cloudinary_not_configured" });
    }
    const { folder } = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder: folder || C_FOLDER,
    };

    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + C_SECRET)
      .digest("hex");

    res.json({
      cloudName: C_CLOUD,
      apiKey: C_KEY,
      signature,
      timestamp,
      folder: paramsToSign.folder,
    });
  } catch (e) {
    console.error("[cloudinary/sign] error", e);
    res.status(500).json({ error: "sign_failed" });
  }
});

// Protected delete
app.post("/api/cloudinary/delete", async (req, res) => {
  try {
    const auth = (req.headers.authorization || "").split(" ");
    if (auth[0] !== "Bearer" || auth[1] !== ADMIN_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const { publicId } = req.body || {};
    if (!publicId) return res.status(400).json({ error: "missing_public_id" });

    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ ok: true, result });
  } catch (e) {
    console.error("[cloudinary/delete] error", e);
    res.status(500).json({ error: "delete_failed" });
  }
});

// ===========================================================
// 3) MAIL (Nodemailer)
// ===========================================================
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});
mailer
  .verify()
  .then(() => console.log("[MAIL] SMTP OK"))
  .catch((e) => console.error("[MAIL] SMTP ERROR:", e));

function escapeHtml(s = "") {
  /* ... как у тебя ... */
}
function makeEmailHtml(form = {}, variant = "general") {
  /* ... как у тебя ... */
}

// ===========================================================
// 4) CONTENT API
// ===========================================================
app.get("/api/content", async (_req, res) => {
  try {
    await dbReadyPromise;
    const row = await getContent("site");
    if (!row) return res.status(404).json({ error: "not_found" });
    res.json({
      body: row.body,
      version: row.version,
      updated_at: row.updated_at,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

app.put("/api/content", async (req, res) => {
  try {
    await dbReadyPromise;
    const auth = (req.headers.authorization || "").split(" ");
    if (auth[0] !== "Bearer" || auth[1] !== ADMIN_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const { body, version } = req.body || {};
    if (!body || typeof version !== "number") {
      return res.status(400).json({ error: "invalid_payload" });
    }

    const updated = await updateContent("site", body, version);
    if (!updated) {
      const current = await getContent("site");
      return res.status(409).json({ error: "version_conflict", current });
    }
    res.json({
      body: updated.body,
      version: updated.version,
      updated_at: updated.updated_at,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// ===========================================================
// 5) OFFER MAIL
// ===========================================================
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post("/api/send-offer", rateLimit, async (req, res) => {
  try {
    const { form, variant } = req.body || {};
    if (!form || !variant)
      return res.status(400).json({ ok: false, error: "Bad payload" });
    if (!form.name || !form.email || !emailRe.test(String(form.email))) {
      return res.status(400).json({ ok: false, error: "Invalid name/email" });
    }
    const subjectMap = {
      general: "Neue Anfrage (Allgemein)",
      transport: "Angebot: Krantransport",
      montage: "Angebot: (De-)Montage",
      repair: "Angebot: Reparatur & Ersatzteile",
    };
    const info = await mailer.sendMail({
      from: `${process.env.FROM_NAME || "Webformular"} <${
        process.env.FROM_EMAIL
      }>`,
      to: process.env.TO_EMAIL,
      replyTo: form.email || process.env.FROM_EMAIL,
      subject: subjectMap[variant] || "Neue Anfrage",
      html: makeEmailHtml(form, variant),
      text: Object.entries(form)
        .map(([k, v]) => `${k}: ${v ?? ""}`)
        .join("\n"),
    });
    console.log("[MAIL] sent", info.messageId);
    res.json({ ok: true });
  } catch (e) {
    console.error("[MAIL] send failed", e);
    res.status(500).json({ ok: false, error: "Mail send failed" });
  }
});

// ===========================================================
// 6) STATIC (production)
// ===========================================================
if (NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "../dist");
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) return res.status(404).end();
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    console.warn("[WARN] dist/ not found. Did you run `npm run build`?");
  }
}

// ===========================================================
// 7) START
// ===========================================================
app.listen(PORT, async () => {
  try {
    const ready = await dbReadyPromise;
    console.log(`[DB] ${ready}`);
  } catch (e) {
    console.error("[DB] init failed:", e);
  }
  console.log(`Server running on http://localhost:${PORT} (${DB_CLIENT})`);
});
