// Lichte cookie-gebaseerde admin-authenticatie (geen DB, geen library).
// De cookiewaarde is een HMAC over het admin-wachtwoord met een server-secret;
// zonder ADMIN_AUTH_SECRET kan een aanvaller de cookie niet vervalsen.
// Gebruikt Web Crypto zodat dezelfde code in Edge (middleware) én Node draait.

export const ADMIN_COOKIE = "ck_admin_session";

function utf8(str: string): BufferSource {
  // `as BufferSource` werkt rond de strakke TS-typing waarbij `TextEncoder.encode`
  // sinds TS 5.7 een `Uint8Array<ArrayBufferLike>` teruggeeft die niet één-op-één
  // matcht met `BufferSource` (vereist `ArrayBuffer`, geen `SharedArrayBuffer`).
  return new TextEncoder().encode(str) as unknown as BufferSource;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    utf8(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, utf8(message));
  return toHex(sig);
}

// Genereert de unieke session-token die in de cookie wordt gezet bij login.
// De token bevat geen geheime gegevens, alleen een HMAC van een vast bericht
// met het admin-wachtwoord + secret — dezelfde input geeft dezelfde output.
export async function generateAdminToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!password || !secret) {
    throw new Error(
      "ADMIN_PASSWORD en ADMIN_AUTH_SECRET moeten in de omgeving staan"
    );
  }
  return hmacSha256(secret, `admin:${password}`);
}

// Constant-time string-vergelijking om timing-aanvallen op de cookie te
// beperken. Beide waarden moeten dezelfde lengte hebben.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await generateAdminToken();
    return safeEqual(token, expected);
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Constant-time vergelijking, zelfde lengte forceren via HMAC-hash.
  const secret = process.env.ADMIN_AUTH_SECRET || "fallback-secret-niet-gebruiken";
  const [a, b] = await Promise.all([
    hmacSha256(secret, `pw:${input}`),
    hmacSha256(secret, `pw:${password}`),
  ]);
  return safeEqual(a, b);
}
