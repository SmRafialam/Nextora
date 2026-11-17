// Stroke icons from the approved design (kept as-is so the line weight matches the brand).
type P = { size?: number };
const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true as const });

export const IconSearch = ({ size }: P) => (<svg {...base(size)}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>);
export const IconUser = ({ size }: P) => (<svg {...base(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>);
export const IconBag = ({ size }: P) => (<svg {...base(size)}><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6.5a3 3 0 016 0V8" /></svg>);
export const IconMenu = ({ size = 22 }: P) => (<svg {...base(size)}><path d="M3 8h18M3 16h12" /></svg>);
export const IconClose = ({ size }: P) => (<svg {...base(size)}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const IconArrowRight = ({ size = 18 }: P) => (<svg {...base(size)}><path d="M4 12h16M14 6l6 6-6 6" /></svg>);
export const IconArrowLeft = ({ size = 20 }: P) => (<svg {...base(size)}><path d="M20 12H4M10 6l-6 6 6 6" /></svg>);
export const IconArrowUpRight = ({ size = 16 }: P) => (<svg {...base(size)} strokeWidth={1.6}><path d="M5 19L19 5M9 5h10v10" /></svg>);
export const IconPlus = ({ size = 16 }: P) => (<svg {...base(size)} strokeWidth={1.8}><path d="M12 5v14M5 12h14" /></svg>);
export const IconCheck = ({ size = 16, color = "currentColor" }: P & { color?: string }) => (<svg {...base(size)} stroke={color} strokeWidth={2}><path d="M5 12l5 5 9-10" /></svg>);
export const IconHeart = ({ size, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7 4 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4 20 4 22.4 7 21.2 10.6 19.5 15.4 12 20 12 20z" />
  </svg>
);
