export function TrustList() {
  const ic = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#45463F", paddingTop: 6 }}>
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}><svg {...ic}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>Encrypted checkout</span>
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}><svg {...ic}><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 3v4h-4M6 21v-4h4" /></svg>7-day easy returns</span>
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}><svg {...ic}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></svg>bKash · Nagad · Cards · Cash on delivery</span>
    </div>
  );
}
