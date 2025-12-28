// services/api.js

// Pastikan ini URL Vercel lu yang aktif
const API_URL = "https://bosh-render.vercel.app/api";

export const apiService = {
  // 1. GET ALL PRODUCTS
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Balikin array kosong biar gak crash
    }
  },

  // 2. GET PRODUCT BY ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (error) {
      console.error("Error fetching product detail:", error);
      return null;
    }
  },

  // 3. GET PRODUCTS BY TAG
  getProductsByTag: async (tag) => {
    try {
      // Kalau tag 'all', panggil getProducts biasa
      if (tag === "all") {
        const response = await fetch(`${API_URL}/products`);
        return await response.json();
      }

      // Kalau tag specific (new/best), panggil endpoint tag
      const response = await fetch(`${API_URL}/products/tag/${tag}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching products by tag:", error);
      return [];
    }
  },

  // 4. GET BANNERS
  getBanners: async () => {
    try {
      const response = await fetch(`${API_URL}/banners`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  },

  // 5. GET FEATURED PRODUCTS
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products/featured`);
      if (!response.ok) throw new Error("Failed to fetch featured");
      return await response.json();
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  // 6. GET DEVELOPERS (TIM HORE) <--- INI YANG BARU
  getDevelopers: async () => {
    try {
      const response = await fetch(`${API_URL}/developers`);
      if (!response.ok) throw new Error("Failed to fetch developers");
      return await response.json();
    } catch (error) {
      console.error("Error fetching developers:", error);
      return [];
    }
  },
};
