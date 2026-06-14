export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Koppel slug → afbeeldingsbestand (extensie automatisch bepaald)
const SLUG_IMAGES: Record<string, string> = {
  "beamer-huren": "jpg",
  "beamer-set-compleet": "jpg",
  "beamer-set-laptop": "jpg",
  "beamer-weekend": "jpg",
  "beamertafel": "jpg",
  "professionele-hd-beamer": "jpg",
  "projectiescherm-groot": "jpg",
  "projectiescherm-standaard": "jpg",
  "projectiescherm-mobiel": "jpg",
  "laptop-dell": "jpg",
  "presenter-draadloos": "jpg",
  "kabel-haspel-10m": "jpg",
  "speaker-600w": "jpg",
  "speaker-800w-actief": "jpg",
  "speaker-800w": "jpg",
  "speaker-set-2800w": "jpg",
  "speaker-1400w": "jpg",
  "speaker-set-1600w": "jpg",
  "speaker-set-1200w": "jpg",
  "microfoon-instrument": "jpg",
  "microfoon-zang": "jpg",
  "speaker-standaard": "jpg",
  "speaker-statief": "jpg",
  "karaoke-digitaal": "jpg",
  "karaoke-set-compleet": "jpg",
  "karaoke-feestje": "gif",
  "alien-disco-verlichting": "jpg",
  "laser-disco-verlichting": "jpg",
  "licht-spin-spot": "jpg",
  "licht-spot-par64": "jpg",
  "licht-spot-set-par64": "jpg",
  "mini-moon-led": "jpg",
  "mini-star-led": "jpg",
  "moving-head": "jpg",
  "multitrix-disco": "jpg",
  "party-disco-set": "jpg",
  "revo-lichteffect": "jpg",
  "terminator-laser": "jpg",
  "stroboscoop": "jpg",
  "bellenblaas-machine": "png",
  "bellenblaas-vloeistof": "jpg",
  "bellenblaas-machine-pro": "jpg",
  "rook-vloeistof": "jpg",
  "rookmachine-verlichting": "png",
};

export async function POST() {
  try {
    let updated = 0;
    for (const [slug, ext] of Object.entries(SLUG_IMAGES)) {
      const url = `/images/producten/${slug}.${ext}`;
      await db.update(products).set({ afbeeldingUrl: url }).where(eq(products.slug, slug));
      updated++;
    }
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update mislukt" }, { status: 500 });
  }
}
