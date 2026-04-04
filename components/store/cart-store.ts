import { ProductParams } from "@/constant.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStoreParams {
  items: ProductParams[];
  addItem: (item: ProductParams) => void;
  decreaseQty: (id: string) => void;
  increaseQty: (id: string) => void;
  clearCartItems: () => void;
}

export const cartStore = create<CartStoreParams>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),
      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),
      clearCartItems: () => set({ items: [] }), // ✅ clears cart
    }),
    { name: "cart-storage" }
  )
);