export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ADMIN_COOKIE, generateAdminToken, verifyAdminPassword } from "@/lib/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dagen

function isSafeRedirect(target: string | undefined): target is string {
  if (!target) return false;
  // Alleen interne paden toestaan (geen externe redirects).
  return target.startsWith("/") && !target.startsWith("//");
}

export async function POST(req: Request) {
  let wachtwoord = "";
  let redirect: string | undefined;

  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      wachtwoord = String(body.wachtwoord ?? body.password ?? "");
      redirect = body.redirect;
    } else {
      const form = await req.formData();
      wachtwoord = String(form.get("wachtwoord") ?? form.get("password") ?? "");
      const r = form.get("redirect");
      if (typeof r === "string") redirect = r;
    }
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  if (!wachtwoord) {
    return NextResponse.json({ error: "Wachtwoord ontbreekt" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Admin-login is niet geconfigureerd op de server" },
      { status: 503 }
    );
  }

  const ok = await verifyAdminPassword(wachtwoord);
  if (!ok) {
    return NextResponse.json({ error: "Onjuist wachtwoord" }, { status: 401 });
  }

  const token = await generateAdminToken();
  const dest = isSafeRedirect(redirect) ? redirect : "/admin";
  const res = NextResponse.json({ success: true, redirect: dest });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
