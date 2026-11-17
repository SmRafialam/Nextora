// TEMPORARY preview data for the account pages. Phase 5 replaces it with the signed-in
// customer's real profile, addresses and orders; the pages are labelled as a preview until then.

export const ORDER_STEPS = ["Confirmed", "Packed", "On its way", "Delivered"] as const;
export type OrderStatus = (typeof ORDER_STEPS)[number];

export const SAMPLE_USER = { name: "Nadia Karim", email: "nadia@example.com", phone: "01700000000", since: 2025 };

export const SAMPLE_ADDRESSES = [
  { id: "a1", label: "Home", line: "House 12, Road 5, Dhanmondi, Dhaka 1205", isDefault: true },
  { id: "a2", label: "Office", line: "Level 4, 22 Gulshan Avenue, Dhaka 1212", isDefault: false },
];

export const SAMPLE_ORDER_COUNT = 2;

export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
export const statusPill = (s: OrderStatus) => (s === "Delivered" ? { background: "#E3E7E1", color: "#3F4A3D" } : { background: "#F1E2D9", color: "#7A4430" });
