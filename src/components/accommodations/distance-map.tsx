import { ACCOMMODATION_TYPE } from "@/lib/status";
import type { Accommodation, AccommodationDirection } from "@/lib/types/database";

const DIR_ANGLE: Record<AccommodationDirection, number> = {
  N: -90,
  NE: -45,
  E: 0,
  SE: 45,
  S: 90,
  SO: 135,
  O: 180,
  NO: -135,
};

const TYPE_COLOR: Record<string, string> = {
  sur_place: "var(--sage-deep)",
  hotel: "var(--sage)",
  gite: "var(--gold)",
  airbnb: "var(--warn)",
  autre: "var(--ink-muted)",
};

export function DistanceMap({
  accommodations,
  venueName,
}: {
  accommodations: Accommodation[];
  venueName: string;
}) {
  const cx = 220;
  const cy = 180;
  const R = 150;
  const rings = [5, 10, 15, 20];

  let autoIndex = 0;
  const points = accommodations.map((a) => {
    const minutes = a.distance_minutes ?? 10;
    const r = minutes <= 0 ? 22 : (Math.min(minutes, 20) / 20) * R;
    const angle =
      a.direction && DIR_ANGLE[a.direction] !== undefined
        ? DIR_ANGLE[a.direction]
        : -70 + autoIndex++ * 137.5;
    const rad = (angle * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    const far = minutes > 15;
    return { a, x, y, far, right: x >= cx };
  });

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 440 360" className="w-full" role="img" aria-label="Carte schématique des hébergements par minutes de route">
        {rings.map((m) => {
          const r = (m / 20) * R;
          return (
            <g key={m}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={m === 15 ? "var(--gold)" : "var(--line)"}
                strokeWidth={m === 15 ? 1.2 : 1}
                strokeDasharray={m === 15 ? "4 4" : undefined}
              />
              <text x={cx} y={cy - r - 5} textAnchor="middle" fontSize={11} fill="var(--ink-muted)">
                {m} min
              </text>
            </g>
          );
        })}

        <path
          d={`M${cx - 12} ${cy + 12} v-14 a12 12 0 0 1 24 0 v14z`}
          fill="var(--sage-deep)"
        />

        {points.map(({ a, x, y, far, right }) => (
          <g key={a.id}>
            <circle cx={x} cy={y} r={8} fill={TYPE_COLOR[a.type]} stroke="var(--surface)" strokeWidth={2} />
            {far && (
              <circle cx={x} cy={y} r={13} fill="none" stroke="var(--destructive)" strokeWidth={1.3} strokeDasharray="3 3" />
            )}
            <text
              x={x + (right ? 14 : -14)}
              y={y + 4}
              textAnchor={right ? "start" : "end"}
              fontSize={12}
              fontWeight={500}
              fill="var(--foreground)"
              style={{ paintOrder: "stroke", stroke: "var(--surface)", strokeWidth: 4 }}
            >
              {a.name.length > 18 ? a.name.slice(0, 17) + "…" : a.name}
            </text>
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sage-deep" />
          {venueName}
        </span>
        {ACCOMMODATION_TYPE.map((t) => (
          <span key={t.value} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TYPE_COLOR[t.value] }} />
            {t.label}
          </span>
        ))}
        <span className="text-gold-ink">Anneau pointillé doré : 15 min</span>
      </div>
    </div>
  );
}
