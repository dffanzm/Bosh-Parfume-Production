export const formatCurrency = (value: any) => {
  // Jaga-jaga kalau datanya null/undefined/0, tetep balikin Rp 0
  if (!value) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Biar gak ada koma ,00 di belakang
  }).format(Number(value));
};