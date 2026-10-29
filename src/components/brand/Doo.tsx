export type DooMood = "neutral" | "smug" | "happy" | "worried" | "thinking";

const INK = "#1e1e24";
const CHALK = "#fffdf5";

/** Doo, the know-it-all piece of chalk. Decorative unless given a title. */
export function Doo({
  mood = "neutral",
  size = 96,
  className,
  title,
}: {
  mood?: DooMood;
  size?: number;
  className?: string;
  title?: string;
}) {
  const armsUp = mood === "happy";
  return (
    <svg
      viewBox="0 0 120 160"
      width={size}
      height={(size * 160) / 120}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <g transform="rotate(-6 60 80)">
        {/* arms */}
        {armsUp ? (
          <>
            <path d="M36 92 Q20 78 14 58" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M84 92 Q100 78 106 58" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : mood === "thinking" ? (
          <>
            <path d="M36 98 Q22 106 22 120" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M84 98 Q96 92 78 82" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M36 96 Q22 104 20 120" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M84 96 Q98 104 100 120" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* legs */}
        <path d="M50 140 L46 156 M70 140 L74 156" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        {/* chalk body with a worn, dusty tip */}
        <path
          d="M36 34 Q37 18 50 16 L54 13 L60 17 L66 13 L72 17 Q83 19 84 34 L84 132 Q84 142 74 142 L46 142 Q36 142 36 132 Z"
          fill={CHALK}
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M40 120 L80 120" stroke={INK} strokeWidth="2" opacity="0.25" />
        <path d="M40 126 L80 126" stroke={INK} strokeWidth="2" opacity="0.15" />
        {/* glasses */}
        <circle cx="50" cy="58" r="9" fill="none" stroke={INK} strokeWidth="3" />
        <circle cx="72" cy="58" r="9" fill="none" stroke={INK} strokeWidth="3" />
        <path d="M59 58 L63 58" stroke={INK} strokeWidth="3" />
        {/* eyes */}
        {mood === "happy" ? (
          <>
            <path d="M45 59 Q50 53 55 59" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M67 59 Q72 53 77 59" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={mood === "thinking" ? 53 : 50} cy={mood === "thinking" ? 55 : 59} r="2.8" fill={INK} />
            <circle cx={mood === "thinking" ? 75 : 72} cy={mood === "thinking" ? 55 : 59} r="2.8" fill={INK} />
          </>
        )}
        {/* eyebrows */}
        {mood === "smug" && (
          <>
            <path d="M42 44 L57 46" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M66 42 Q72 36 80 40" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {mood === "worried" && (
          <>
            <path d="M43 46 L56 42" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M66 42 L79 46" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {/* mouth */}
        {mood === "happy" && <path d="M48 78 Q61 94 74 78 Z" fill={INK} />}
        {mood === "smug" && <path d="M50 82 Q62 84 74 76" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === "neutral" && <path d="M52 81 Q61 85 70 81" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />}
        {mood === "worried" && (
          <path d="M50 84 Q54 79 58 84 Q62 89 66 84 Q70 79 74 84" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
        {mood === "thinking" && <path d="M54 82 L68 80" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      </g>
      {/* chalk dust */}
      <g fill={CHALK} stroke={INK} strokeWidth="1.5" opacity="0.9">
        <circle cx="54" cy="6" r="2.5" />
        <circle cx="66" cy="4" r="1.8" />
        <circle cx="76" cy="8" r="1.4" />
      </g>
    </svg>
  );
}
