"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm({ redirect }: { redirect: string }) {
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFout(null);
    setBezig(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wachtwoord, redirect }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFout(data.error || "Inloggen mislukt");
        setBezig(false);
        return;
      }
      // Volledige navigatie zodat de server-side admin-pagina's opnieuw renderen
      // met de zojuist gezette sessiecookie.
      window.location.href = data.redirect || redirect || "/admin";
    } catch {
      setFout("Verbinding mislukt. Probeer opnieuw.");
      setBezig(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
          <Lock size={20} />
        </div>
        <CardTitle className="text-2xl">Beheer inloggen</CardTitle>
        <CardDescription>CityKist Verhuur — alleen voor de beheerder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wachtwoord">Wachtwoord</Label>
            <Input
              id="wachtwoord"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              disabled={bezig}
            />
          </div>

          {fout && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {fout}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={bezig || !wachtwoord}>
            {bezig ? (
              <>
                <Loader2 className="animate-spin" /> Bezig met inloggen…
              </>
            ) : (
              "Inloggen"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
