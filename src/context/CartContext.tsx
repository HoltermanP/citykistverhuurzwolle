"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Product } from "@/lib/schema";

export interface CartItem {
  product: Product;
  aantal: number;
  startDatum: string; // ISO date string
  eindDatum: string;
  totaalprijs: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_AANTAL"; productId: number; aantal: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

function berekenDagen(start: string, eind: string): number {
  const d1 = new Date(start);
  const d2 = new Date(eind);
  return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
}

function berekenItemPrijs(product: Product, aantal: number, start: string, eind: string): number {
  const dagen = berekenDagen(start, eind);
  return Number(product.prijsPerDag) * aantal * dagen;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const idx = state.items.findIndex((i) => i.product.id === action.item.product.id);
      if (idx >= 0) {
        const updated = [...state.items];
        updated[idx] = action.item;
        return { ...state, items: updated, isOpen: true };
      }
      return { ...state, items: [...state.items, action.item], isOpen: true };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_AANTAL": {
      if (action.aantal <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) => {
          if (i.product.id !== action.productId) return i;
          return {
            ...i,
            aantal: action.aantal,
            totaalprijs: berekenItemPrijs(i.product, action.aantal, i.startDatum, i.eindDatum),
          };
        }),
      };
    }
    case "CLEAR_CART": return { ...state, items: [] };
    case "TOGGLE_CART": return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART": return { ...state, isOpen: true };
    case "CLOSE_CART": return { ...state, isOpen: false };
    default: return state;
  }
}

interface CartContextType {
  state: CartState;
  voegToe: (product: Product, aantal: number, startDatum: string, eindDatum: string) => void;
  verwijder: (productId: number) => void;
  updateAantal: (productId: number, aantal: number) => void;
  leegMaken: () => void;
  toggleCart: () => void;
  openCart: () => void;
  sluitCart: () => void;
  totaalItems: number;
  totaalPrijs: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const voegToe = (product: Product, aantal: number, startDatum: string, eindDatum: string) => {
    const totaalprijs = berekenItemPrijs(product, aantal, startDatum, eindDatum);
    dispatch({ type: "ADD_ITEM", item: { product, aantal, startDatum, eindDatum, totaalprijs } });
  };

  const verwijder = (productId: number) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateAantal = (productId: number, aantal: number) => dispatch({ type: "UPDATE_AANTAL", productId, aantal });
  const leegMaken = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const sluitCart = () => dispatch({ type: "CLOSE_CART" });

  const totaalItems = state.items.reduce((s, i) => s + i.aantal, 0);
  const totaalPrijs = state.items.reduce((s, i) => s + i.totaalprijs, 0);

  return (
    <CartContext.Provider value={{ state, voegToe, verwijder, updateAantal, leegMaken, toggleCart, openCart, sluitCart, totaalItems, totaalPrijs }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart moet binnen CartProvider gebruikt worden");
  return ctx;
}

export function berekenDagenHelper(start: string, eind: string): number {
  return berekenDagen(start, eind);
}
