import { sendOrderEmail } from "../src/lib/email";
import type { Order } from "../src/lib/schema";

async function main() {
  const test: Order = {
    id: 99999,
    naam: "Test Klant",
    email: process.env.ADMIN_EMAIL || "info@citykistverhuurzwolle.nl",
    telefoon: "0612345678",
    adres: "Teststraat 1",
    postcode: "8000AA",
    stad: "Zwolle",
    ophaaldatum: "2026-06-20",
    retourdatum: "2026-06-21",
    notities: "End-to-end test van de mailflow (lokaal)",
    status: "nieuw",
    betaalmethode: "contant",
    betaalstatus: "n.v.t.",
    molliePaymentId: "",
    factuurnummer: "CK-TEST-9999",
    factuurPdf: "",
    kortingCode: "",
    kortingPercentage: 0,
    totaal: "12.10",
    items: [
      {
        productId: 1,
        productNaam: "Testproduct",
        prijsPerDag: 10,
        aantal: 1,
        dagen: 1,
        subtotaal: 10,
      },
    ],
    createdAt: new Date(),
  };

  const start = Date.now();
  await sendOrderEmail(test);
  console.log(`OK — beide mails verzonden in ${Date.now() - start} ms`);
}

main().catch((err) => {
  console.error("FOUT:", err);
  process.exit(1);
});
