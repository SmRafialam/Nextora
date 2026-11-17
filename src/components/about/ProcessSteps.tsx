"use client";
import { useState } from "react";

const PROC = [
  ["01", "Sourced", "We work with workshops that use solid, traceable materials and fair working conditions."],
  ["02", "Tested", "Every piece is sat on, scrubbed and lived with in our studio before it is offered to you."],
  ["03", "Refined", "We adjust heights, depths and finishes until the piece feels right in a real room."],
  ["04", "Delivered", "Our own team delivers larger pieces in Dhaka and places them where you want them."],
];

export function ProcessSteps() {
  const [step, setStep] = useState(1);
  return (
    <div className="nx-cols4">
      {PROC.map(([n, title, body], i) => {
        const on = step === i;
        return (
          <button key={n} className="nx-reveal" onClick={() => setStep(i)} aria-pressed={on} style={{ textAlign: "left", border: 0, cursor: "pointer", borderRadius: 6, padding: 28, minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24, background: on ? "#5E6A5B" : "#EFE9DF", color: on ? "#F8F5EF" : "#222321", transition: "background .5s, color .5s" }}>
            <span className="nx-f" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1 }}>{n}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 10 }}><span className="nx-f" style={{ fontSize: 26 }}>{title}</span><span style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.85 }}>{body}</span></span>
          </button>
        );
      })}
    </div>
  );
}
