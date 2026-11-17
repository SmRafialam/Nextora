// Shared by the contact page (server) and form (client).
export const TOPICS = [
  ["order", "Order & delivery"],
  ["product", "A product question"],
  ["styling", "Free styling advice"],
  ["visit", "Book a showroom visit"],
  ["other", "Something else"],
] as const;
export type Topic = (typeof TOPICS)[number][0];
