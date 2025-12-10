import { create } from "zustand";

export const useWishlist = create((set) => ({
  items: [],

  addToWishlist: (product) =>
    set((state) => {
      // Cegah duplikat
      if (state.items.some((i) => i.id === product.id)) return state;
      return { items: [...state.items, product] };
    }),

  removeFromWishlist: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
