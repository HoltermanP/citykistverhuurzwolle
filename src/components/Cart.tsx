"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function Cart() {
  const { state, verwijder, updateAantal, sluitCart, totaalPrijs, totaalItems } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm" onClick={sluitCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-card z-50 flex flex-col shadow-2xl border-l border-dark-border">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border bg-gradient-to-r from-party/10 to-pink-party/5">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-party" size={22} />
            <h2 className="text-slate-900 font-bold text-lg">Jouw Aanvraag</h2>
            {totaalItems > 0 && (
              <span className="bg-gradient-party text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totaalItems}
              </span>
            )}
          </div>
          <button onClick={sluitCart} className="text-slate-500 hover:text-slate-900 transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-slate-600 text-base">Je aanvraag is nog leeg</p>
              <p className="text-slate-400 text-sm mt-1">Voeg producten toe om verder te gaan</p>
              <button
                onClick={sluitCart}
                className="mt-6 bg-gradient-party text-white px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
              >
                Producten bekijken
              </button>
            </div>
          ) : (
            state.items.map((item) => {
              const dagen = Math.max(
                1,
                Math.ceil((new Date(item.eindDatum).getTime() - new Date(item.startDatum).getTime()) / 86400000)
              );
              return (
                <div key={item.product.id} className="bg-dark border border-dark-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-slate-900 font-medium text-sm leading-snug">{item.product.naam}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {formatDate(item.startDatum)} – {formatDate(item.eindDatum)} ({dagen} dag{dagen !== 1 ? "en" : ""})
                      </p>
                    </div>
                    <button
                      onClick={() => verwijder(item.product.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAantal(item.product.id, item.aantal - 1)}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-slate-900 font-semibold w-5 text-center text-sm">{item.aantal}</span>
                      <button
                        onClick={() => updateAantal(item.product.id, item.aantal + 1)}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="text-party font-bold">€{item.totaalprijs.toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-5 border-t border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Totaal (excl. BTW)</span>
              <span className="text-slate-900 font-black text-2xl">€{totaalPrijs.toFixed(2)}</span>
            </div>
            <Link
              href="/aanvraag"
              onClick={sluitCart}
              className="block w-full bg-gradient-party hover:opacity-90 text-white text-center py-4 rounded-xl font-bold text-base transition-opacity"
            >
              Aanvraag indienen →
            </Link>
            <button
              onClick={sluitCart}
              className="block w-full text-slate-500 hover:text-slate-900 text-center py-2 text-sm transition-colors"
            >
              Verder winkelen
            </button>
          </div>
        )}
      </div>
    </>
  );
}
