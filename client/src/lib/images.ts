// Product & editorial imagery for the VIVAH store.
// Served from the app's own /public/images so they load in dev, preview and prod.
const BASE = "/images";

export const IMG = {
  hero: `${BASE}/vivah_products_v11.png`,
  bottleSet: `${BASE}/vivah_products_v3.png`,
  turtle: `${BASE}/vivah_products_v7.png`,
  kamdhenu: `${BASE}/vivah_products_v5.png`,
  sugarPot: `${BASE}/vivah_products_v10.png`,
  aartiDiya: `${BASE}/vivah_products_v4.png`,
  photoFrame: `${BASE}/vivah_products.png`,
  poojaThali: `${BASE}/vivah_products_v2.png`,
  swanCutlery: `${BASE}/vivah_products_v8.png`,
  laxmiGanesh: `${BASE}/vivah_products_v12.png`,
  peacockBell: `${BASE}/vivah_products_v6.png`,
  miniPooja: `${BASE}/vivah_products_v13.png`,
  trousseau: `${BASE}/vivah_products_v9.png`,
} as const;
