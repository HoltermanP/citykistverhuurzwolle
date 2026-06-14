import nodemailer from "nodemailer";
import { Order, OrderItem } from "./schema";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
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
  const itemsHtml = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee">${i.productNaam}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.aantal}x</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.dagen} dag(en)</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">€${i.subtotaal.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px">
      <div style="background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:24px">
        <h1 style="color:white;margin:0;font-size:24px">🎉 Nieuwe Bestelling — CityKist Verhuur</h1>
      </div>
      <div style="background:white;padding:20px;border-radius:8px;margin-bottom:16px">
        <h2 style="color:#333;margin-top:0">Klantgegevens</h2>
        <p><strong>Naam:</strong> ${order.naam}</p>
        <p><strong>E-mail:</strong> ${order.email}</p>
        <p><strong>Telefoon:</strong> ${order.telefoon}</p>
        <p><strong>Adres:</strong> ${order.adres}, ${order.postcode} ${order.stad}</p>
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
              <td colspan="3" style="padding:12px;text-align:right;font-weight:bold">Totaal (excl. BTW):</td>
              <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#0891B2">€${Number(order.totaal).toFixed(2)}</td>
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

  await transporter.sendMail({
    from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Nieuwe bestelling van ${order.naam} — CityKist`,
    html: buildOrderHtml(order),
  });

  // Bevestiging naar klant
  await transporter.sendMail({
    from: `"CityKist Verhuur" <${process.env.SMTP_USER}>`,
    to: order.email,
    subject: "Bedankt voor je aanvraag — CityKist Verhuur",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0891B2,#65A30D);padding:24px;border-radius:8px;margin-bottom:24px">
          <h1 style="color:white;margin:0">Bedankt voor je aanvraag, ${order.naam}!</h1>
        </div>
        <p>We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op ter bevestiging.</p>
        <p><strong>Ophalen:</strong> ${formatDate(order.ophaaldatum)}<br>
        <strong>Retour:</strong> ${formatDate(order.retourdatum)}</p>
        <p>Heb je vragen? Bel ons op <strong>06-226 321 07</strong> of mail naar <a href="mailto:info@citykistverhuurzwolle.nl">info@citykistverhuurzwolle.nl</a></p>
        <p style="color:#999;font-size:12px">CityKist Verhuur • Zwolle</p>
      </div>`,
  });
}
