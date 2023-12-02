/**
 * This hook is used to manage the cart state with zustand and localStorage
 * add product
 * remove product
 * clear cart
 * keep track of cart items
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/payload-types";

export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

// regular react states are not persisted on page refresh meaning that if we add items to the cart and refresh the page, the cart will be empty. To solve this, we can use localStorage to persist the cart state.
// with zustand, we can use the persist plugin to persist the cart state in localStorage

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] };
        }),
      removeItem: (id) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        }),
      clearCart: () =>
        set(() => {
          return { items: [] };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
