import nodemailer from "nodemailer";
import { Order, OrderItem, orders } from "./schema";
import { bedragen } from "./btw";
import { genereerFactuurPdf, factuurnummerVoor } from "./factuur";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Genereert (indien nodig) de PDF-factuur, slaat 'm op bij de bestelling en
// geeft het factuurnummer + de PDF-bytes terug om als bijlage mee te sturen.
async function zorgVoorFactuur(order: Order): Promise<{ factuurnummer: string; pdf: Buffer }> {
  const factuurnummer = factuurnummerVoor(order);

  // Hergebruik een eerder opgeslagen factuur (bv. bij opnieuw versturen).
  if (order.factuurnummer && order.factuurPdf) {
    return { factuurnummer: order.factuurnummer, pdf: Buffer.from(order.factuurPdf, "base64") };
  }

  const pdfBytes = await genereerFactuurPdf({ ...order, factuurnummer });
  const pdf = Buffer.from(pdfBytes);

  await db
    .update(orders)
    .set({ factuurnummer, factuurPdf: pdf.toString("base64") })
    .where(eq(orders.id, order.id));

  return { factuurnummer, pdf };
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT) || 587;
  // Poort 465 gebruikt impliciete TLS (SMTPS); 587/25 doen STARTTLS.
  // SMTP_SECURE kan dit expliciet overschrijven ("true"/"false").
  const secureEnv = process.env.SMTP_SECURE?.toLowerCase();
  const secure = secureEnv === "true" ? true : secureEnv === "false" ? false : port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function buildOrderHtml(order: Order): string {
  const items = (order.items as OrderItem[]) || [];
  // Opbouw incl. BTW reconstrueren uit de regelbedragen (die zijn excl. BTW).
  const inclBtw = bedragen(items.reduce((s, i) => s + i.subtotaal, 0), order.kortingPercentage || 0);
  const itemsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee">${i.productNaam}${
          i.artikelnummer && i.artikelnummer.trim()
            ? `<br><span style="color:#888;font-size:12px">Art.nr. ${i.artikelnummer.trim()}</span>`
            : ""
        }</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.aantal}x</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.dagen} dag(en)</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">€${i.subtotaal.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const betaalRegel =
    order.betaalmethode === "ideal"
      ? `iDEAL — ${order.betaalstatus === "betaald" ? "✅ betaald" : order.betaalstatus === "mislukt" ? "❌ mislukt" : "⏳ wacht op betaling"}`
      : "Contant bij ophalen";

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px">
      <div style="background-color:#0891B2;background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:24px">
        <h1 style="color:white;margin:0;font-size:24px">🎉 Nieuwe Bestelling — CityKist Verhuur</h1>
      </div>
      <div style="background:white;padding:20px;border-radius:8px;margin-bottom:16px">
        <h2 style="color:#333;margin-top:0">Klantgegevens</h2>
        <p><strong>Naam:</strong> ${order.naam}</p>
        <p><strong>E-mail:</strong> ${order.email}</p>
        <p><strong>Telefoon:</strong> ${order.telefoon}</p>
        <p><strong>Adres:</strong> ${order.adres}, ${order.postcode} ${order.stad}</p>
        <p><strong>Betaling:</strong> ${betaalRegel}</p>
      </div>
      <div style="background:white;padding:20px;border-radius:8px;margin-bottom:16px">
        <h2 style="color:#333;margin-top:0">Huurdatums</h2>
        <p><strong>Ophalen:</strong> ${formatDate(order.ophaaldatum)}</p>
        <p><strong>Retour:</strong> ${formatDate(order.retourdatum)}</p>
        ${order.notities ? `<p><strong>Notities:</strong> ${order.notities}</p>` : ""}
      </div>
      <div style="background:white;padding:20px;border-radius:8px;margin-bottom:16px">
        <h2 style="color:#333;margin-top:0">Bestelde artikelen</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px 12px;text-align:left">Artikel</th>
              <th style="padding:8px 12px;text-align:center">Aantal</th>
              <th style="padding:8px 12px;text-align:center">Dagen</th>
              <th style="padding:8px 12px;text-align:right">Subtotaal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:8px 12px;text-align:right;color:#555">Subtotaal (excl. BTW):</td>
              <td style="padding:8px 12px;text-align:right;color:#555">€${inclBtw.excl.toFixed(2)}</td>
            </tr>
            ${
              inclBtw.korting > 0
                ? `<tr>
              <td colspan="3" style="padding:8px 12px;text-align:right;color:#067647">Korting ${order.kortingCode || ""} (${inclBtw.kortingPercentage}%):</td>
              <td style="padding:8px 12px;text-align:right;color:#067647">−€${inclBtw.korting.toFixed(2)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td colspan="3" style="padding:8px 12px;text-align:right;color:#555">BTW 21%:</td>
              <td style="padding:8px 12px;text-align:right;color:#555">€${inclBtw.btw.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding:12px;text-align:right;font-weight:bold">Totaal (incl. BTW):</td>
              <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#0891B2">€${inclBtw.incl.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p style="color:#666;font-size:12px;text-align:center">CityKist Verhuur • info@citykistverhuurzwolle.nl • 06-226 321 07</p>
    </div>`;
}

export async function sendOrderEmail(order: Order) {
  const transporter = createTransport();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  // Factuur genereren + opslaan bij de bestelling en als bijlage meesturen.
  const { factuurnummer, pdf } = await zorgVoorFactuur(order);
  const bijlage = {
    filename: `factuur-${factuurnummer}.pdf`,
    content: pdf,
    contentType: "application/pdf",
  };

  // Beide mails parallel sturen om de totale doorlooptijd te halveren
  // (in serverless tellen seconden — een seriële SMTP-handshake kost al snel
  // meerdere seconden per mail).
  const klantHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background-color:#0891B2;background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:24px">
          <h1 style="color:white;margin:0">Bedankt voor je aanvraag, ${order.naam}!</h1>
        </div>
        <p>We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op ter bevestiging.</p>
        ${
          order.betaalmethode === "ideal" && order.betaalstatus === "betaald"
            ? `<p style="background:#ecfdf5;color:#065f46;padding:12px;border-radius:6px"><strong>✅ Betaling ontvangen:</strong> €${Number(order.totaal).toFixed(2)} via iDEAL.</p>`
            : `<p style="background:#f3f4f6;padding:12px;border-radius:6px"><strong>Betaling:</strong> contant bij het ophalen (€${Number(order.totaal).toFixed(2)}).</p>`
        }
        <p><strong>Ophalen:</strong> ${formatDate(order.ophaaldatum)}<br>
        <strong>Retour:</strong> ${formatDate(order.retourdatum)}</p>
        <p>📎 Je vindt de factuur (<strong>${factuurnummer}</strong>) als bijlage bij deze e-mail.</p>
        <p>Heb je vragen? Bel ons op <strong>06-226 321 07</strong> of mail naar <a href="mailto:info@citykistverhuurzwolle.nl">info@citykistverhuurzwolle.nl</a></p>
        <p style="color:#999;font-size:12px">CityKist Verhuur • Zwolle</p>
      </div>`;

  await Promise.all([
    transporter.sendMail({
      from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Nieuwe bestelling van ${order.naam} — CityKist (${factuurnummer})`,
      html: buildOrderHtml(order),
      attachments: [bijlage],
    }),
    transporter.sendMail({
      from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
      to: order.email,
      subject: `Je factuur ${factuurnummer} — CityKist Verhuur`,
      html: klantHtml,
      attachments: [bijlage],
    }),
  ]);
}

export type ContactBericht = {
  naam: string;
  email: string;
  telefoon?: string;
  bericht: string;
};

export async function sendContactEmail(data: ContactBericht) {
  const transporter = createTransport();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  // Bericht naar de beheerder
  await transporter.sendMail({
    from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: `"${data.naam}" <${data.email}>`,
    subject: `Contactformulier: bericht van ${data.naam}`,
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px">
      <div style="background-color:#0891B2;background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:20px">
        <h1 style="color:white;margin:0;font-size:22px">📩 Nieuw bericht via contactformulier</h1>
      </div>
      <div style="background:white;padding:20px;border-radius:8px">
        <p><strong>Naam:</strong> ${data.naam}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.telefoon ? `<p><strong>Telefoon:</strong> ${data.telefoon}</p>` : ""}
        <p><strong>Bericht:</strong></p>
        <p style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:6px">${data.bericht}</p>
      </div>
      <p style="color:#666;font-size:12px;text-align:center;margin-top:16px">CityKist Verhuur • Zwolle</p>
    </div>`,
  });

  // Bevestiging naar de afzender
  await transporter.sendMail({
    from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "Bedankt voor je bericht — CityKist Verhuur Zwolle",
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background-color:#0891B2;background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:20px">
        <h1 style="color:white;margin:0">Bedankt voor je bericht, ${data.naam}!</h1>
      </div>
      <p>We hebben je bericht ontvangen en nemen zo snel mogelijk contact met je op.</p>
      <p style="background:#f3f4f6;padding:12px;border-radius:6px;white-space:pre-wrap">${data.bericht}</p>
      <p>Heb je een dringende vraag? Bel ons op <strong>06-226 321 07</strong>.</p>
      <p style="color:#999;font-size:12px">CityKist Verhuur • Zwolle</p>
    </div>`,
  });
}
