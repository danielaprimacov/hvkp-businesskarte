import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeEmailHtml(form = {}, variant = "general") {
  const titleMap = {
    general: "Ihre Anfrage",
    transport: "Angebot für Krantransport",
    montage: "Angebot für (De-)Montage",
    repair: "Angebot für Reparatur & Ersatzteile",
  };

  const rows = [
    ["Name", form.name],
    ["Email", form.email],
    ["Telefon", form.phone],
  ];

  if (variant === "general") {
    rows.push(
      ["Höhe (m)", form.heightOfTheConstruction],
      ["Breite (m)", form.widthOfTheConstruction],
      ["Länge (m)", form.lengthOfTheConstruction],
      ["Carport/Garage", form.carport ? "Ja" : "Nein"],
      ["Bäume in der Nähe", form.nearbyTrees ? "Ja" : "Nein"],
      ["Nachricht", form.message]
    );
  } else {
    rows.push(
      ["Kranmodell/Typ", form.craneModel],
      ["Kranhersteller", form.craneManufacturers],
      ["Baujahr", form.constructionYear]
    );
    if (variant === "transport") {
      rows.push(
        ["Abholadresse", form.pickupAddress],
        ["Zieladresse", form.destinationAddress]
      );
    }
    if (variant === "montage" || variant === "repair") {
      rows.push(["Baustellenadresse", form.siteAddress]);
    }
    if (variant === "repair") {
      rows.push(["Problembeschreibung", form.problemDescription]);
    }
    if (form.message) rows.push(["Nachricht (freiwillig)", form.message]);
  }

  const tr = rows
    .map(
      ([k, v]) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600">${escapeHtml(
        k
      )}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(
        v ?? ""
      )}</td>
    </tr>`
    )
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
    <h2 style="margin:0 0 12px 0">${escapeHtml(
      titleMap[variant] || "Neue Anfrage"
    )}</h2>
    <table style="border-collapse:collapse;width:100%;max-width:720px;background:#fff;border:1px solid #eee">
      <tbody>${tr}</tbody>
    </table>
    <p style="margin-top:14px;font-size:12px;color:#666">Gesendet am ${new Date().toLocaleString(
      "de-DE"
    )}</p>
  </div>`;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true", // true для 465
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

transporter
  .verify()
  .then(() => console.log("SMTP OK"))
  .catch((err) => console.error("SMTP ERROR:", err));

app.post("/api/send-offer", async (req, res) => {
  try {
    const { form, variant } = req.body || {};
    if (!form || !variant)
      return res.status(400).json({ ok: false, error: "Bad payload" });

    const subjectMap = {
      general: "Neue Anfrage (Allgemein)",
      transport: "Angebot: Krantransport",
      montage: "Angebot: (De-)Montage",
      repair: "Angebot: Reparatur & Ersatzteile",
    };

    await transporter.sendMail({
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

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Mail send failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
