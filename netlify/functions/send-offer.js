import nodemailer from "nodemailer";

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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { form, variant } = JSON.parse(event.body || "{}");
    if (!form || !variant) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Bad payload" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("MAIL ERROR:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Mail send failed" }),
    };
  }
};
