import type { ArtKind } from "@/lib/catalog";

/** Line-drawn product study used in place of photography (from the approved design). */
export function ProductArt({ kind, fill }: { kind: ArtKind; fill: string }) {
  const shadow = (cx: number, cy: number, rx: number) => <ellipse cx={cx} cy={cy} rx={rx} ry={5} fill="#222321" stroke="none" opacity={0.08} />;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <g stroke="#222321" strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round">
        {kind === "sofa" && (<>
          {shadow(100, 160, 80)}
          <path d="M40 84c0-10 8-17 18-17h84c10 0 18 7 18 17v32H40z" fill={fill} />
          <rect x="44" y="110" width="112" height="32" rx="10" fill={fill} />
          <rect x="24" y="98" width="26" height="48" rx="13" fill={fill} />
          <rect x="150" y="98" width="26" height="48" rx="13" fill={fill} />
          <path d="M100 112v28M60 146v11M140 146v11" fill="none" />
          <rect x="56" y="84" width="30" height="24" rx="8" fill="#F8F5EF" opacity={0.55} />
        </>)}
        {kind === "chair" && (<>
          {shadow(100, 164, 54)}
          <path d="M62 62c0-15 13-26 38-26s38 11 38 26v60H62z" fill={fill} />
          <rect x="52" y="106" width="96" height="32" rx="15" fill={fill} />
          <path d="M68 138l-9 24M132 138l9 24" fill="none" />
          <path d="M76 60c6-8 14-11 24-11" fill="none" opacity={0.35} />
        </>)}
        {kind === "lamp" && (<>
          <circle cx="100" cy="98" r="46" fill="#FFF3DC" stroke="none" opacity={0.7} />
          <path d="M72 46h56l17 48H55z" fill={fill} />
          <path d="M88 46l-8 48M100 46v48M112 46l8 48" fill="none" opacity={0.3} />
          <path d="M100 94v62" fill="none" />
          <ellipse cx="100" cy="160" rx="28" ry="6" fill={fill} />
        </>)}
        {kind === "vase" && (<>
          {shadow(100, 164, 40)}
          <path d="M100 74c-3-22 3-42 18-58M110 40c8-5 16-5 22 0M98 30c-9-3-16-1-21 6M104 56c7-2 13 0 17 5" fill="none" />
          <path d="M86 86c0-6 3-9 4-14h20c1 5 4 8 4 14 18 12 22 30 18 46-4 18-18 30-32 30s-28-12-32-30c-4-16 0-34 18-46z" fill={fill} />
          <path d="M76 112c10 4 38 4 48 0" fill="none" opacity={0.3} />
        </>)}
        {kind === "table" && (<>
          {shadow(100, 164, 50)}
          <path d="M38 90v7c0 8 28 14 62 14s62-6 62-14v-7" fill={fill} />
          <ellipse cx="100" cy="90" rx="62" ry="14" fill={fill} />
          <path d="M100 111v46M74 158h52" fill="none" />
          <path d="M90 80c0-6 4-8 10-8s10 2 10 8v8H90z" fill="#F8F5EF" />
        </>)}
        {kind === "bed" && (<>
          {shadow(100, 160, 82)}
          <rect x="34" y="58" width="132" height="58" rx="12" fill={fill} />
          <rect x="26" y="106" width="148" height="20" rx="6" fill="#FFFFFF" />
          <rect x="26" y="122" width="148" height="26" rx="6" fill={fill} />
          <rect x="46" y="88" width="46" height="20" rx="10" fill="#F8F5EF" />
          <rect x="108" y="88" width="46" height="20" rx="10" fill="#F8F5EF" />
          <path d="M36 148v10M164 148v10" fill="none" />
        </>)}
        {kind === "shelf" && (<>
          {shadow(100, 166, 58)}
          <rect x="48" y="34" width="104" height="126" rx="6" fill={fill} />
          <path d="M48 76h104M48 118h104" fill="none" />
          <rect x="60" y="50" width="8" height="26" fill="#F8F5EF" />
          <rect x="70" y="54" width="8" height="22" fill="#C68C70" />
          <path d="M118 118c0-10 4-16 8-20 4 4 8 10 8 20z" fill="#F8F5EF" />
          <circle cx="80" cy="104" r="10" fill="#788575" />
        </>)}
        {kind === "plant" && (<>
          <path d="M100 122c-6-30-26-46-44-48 2 24 20 42 44 48zM100 122c4-34 22-54 42-58 0 28-18 50-42 58zM100 122c-2-30 2-54 0-74" fill="#788575" />
          <path d="M76 120h48l-7 40H83z" fill={fill} />
        </>)}
      </g>
    </svg>
  );
}
