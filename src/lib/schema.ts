import { pgTable, serial, text, numeric, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  naam: text("naam").notNull(),
  slug: text("slug").notNull().unique(),
  artikelnummer: text("artikelnummer").default(""),
  categorie: text("categorie").notNull(),
  beschrijving: text("beschrijving").default(""),
  kenmerken: jsonb("kenmerken").$type<string[]>().default([]),
  prijsPerDag: numeric("prijs_per_dag", { precision: 10, scale: 2 }).notNull(),
  isKoop: boolean("is_koop").default(false),
  beschikbaar: boolean("beschikbaar").default(true),
  populair: boolean("populair").default(false),
  afbeeldingUrl: text("afbeelding_url").default(""),
  afbeeldingen: jsonb("afbeeldingen").$type<string[]>().default([]),
  videoUrl: text("video_url").default(""),
  volgorde: integer("volgorde").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  naam: text("naam").notNull(),
  email: text("email").notNull(),
  telefoon: text("telefoon").notNull(),
  adres: text("adres").default(""),
  postcode: text("postcode").default(""),
  stad: text("stad").default(""),
  ophaaldatum: text("ophaaldatum").notNull(),
  retourdatum: text("retourdatum").notNull(),
  notities: text("notities").default(""),
  status: text("status").default("nieuw"),
  betaalmethode: text("betaalmethode").default("contant"),
  betaalstatus: text("betaalstatus").default("n.v.t."),
  molliePaymentId: text("mollie_payment_id").default(""),
  factuurnummer: text("factuurnummer").default(""),
  factuurPdf: text("factuur_pdf").default(""),
  totaal: numeric("totaal", { precision: 10, scale: 2 }),
  items: jsonb("items").$type<OrderItem[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const handleidingen = pgTable("handleidingen", {
  id: serial("id").primaryKey(),
  titel: text("titel").notNull(),
  beschrijving: text("beschrijving").default(""),
  categorie: text("categorie").default("Algemeen"),
  bestandUrl: text("bestand_url").default(""),
  // Optionele koppeling aan een product — dan wordt de handleiding ook bij dat artikel getoond.
  productId: integer("product_id"),
  volgorde: integer("volgorde").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Handleiding = typeof handleidingen.$inferSelect;
export type NewHandleiding = typeof handleidingen.$inferInsert;

export type OrderItem = {
  productId: number;
  productNaam: string;
  prijsPerDag: number;
  aantal: number;
  dagen: number;
  subtotaal: number;
  startDatum?: string;
  eindDatum?: string;
};

// Geboekte verhuurperiodes per product. Bij het plaatsen van een bestelling
// wordt voor elk verhuurartikel (geen koop) een verhuring vastgelegd; die
// periode is dan niet meer beschikbaar. Wordt vrijgegeven bij verwijderen van
// de bestelling of bij een mislukte iDEAL-betaling.
export const verhuringen = pgTable("verhuringen", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productNaam: text("product_naam").default(""),
  startDatum: text("start_datum").notNull(),
  eindDatum: text("eind_datum").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Verhuring = typeof verhuringen.$inferSelect;
export type NewVerhuring = typeof verhuringen.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
