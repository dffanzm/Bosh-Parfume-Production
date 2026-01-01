import { create } from "zustand";

export const useWishlist = create((set) => ({
  items: [],

  addToWishlist: (product: any) =>
    set((state: any) => {
      if (state.items.some((i: any) => i.id === product.id)) return state;
      return { items: [...state.items, product] };
    }),

  removeFromWishlist: (id: any) =>
    set((state: any) => ({
      items: state.items.filter((item: any) => item.id !== id),
    })),
}));
