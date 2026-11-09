export default function HeroIllustration() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 640 460"
      role="img"
      aria-labelledby="hero-art-title hero-art-desc"
    >
      <title id="hero-art-title">Portable cold-storage enclosure with refrigeration unit</title>
      <desc id="hero-art-desc">
        Schematic of a portable cold-storage enclosure on a chassis, a refrigeration unit mounted at one
        end, and dimensioned measurement points connected by thin lines. Illustrative only.
      </desc>
      <defs>
        <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="var(--grid)" strokeWidth="1" />
        </pattern>
        <linearGradient id="wall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1b2b44" />
          <stop offset="1" stopColor="#121d31" />
        </linearGradient>
      </defs>
      <rect width="640" height="460" fill="url(#g)" opacity=".7" />

      {/* ground + chassis */}
      <line x1="20" y1="388" x2="620" y2="388" stroke="var(--line)" strokeWidth="1.5" />
      <rect x="70" y="334" width="420" height="12" fill="#0e1727" stroke="var(--ice-dim)" />
      <circle cx="140" cy="364" r="20" fill="#0b1220" stroke="var(--ice-dim)" strokeWidth="2" />
      <circle cx="140" cy="364" r="7" fill="none" stroke="var(--ice-dim)" />
      <circle cx="210" cy="364" r="20" fill="#0b1220" stroke="var(--ice-dim)" strokeWidth="2" />
      <circle cx="210" cy="364" r="7" fill="none" stroke="var(--ice-dim)" />
      <path d="M70 346 L40 372 H70" fill="none" stroke="var(--ice-dim)" strokeWidth="2" />

      {/* enclosure */}
      <rect x="70" y="150" width="420" height="184" rx="6" fill="url(#wall)" stroke="var(--ice)" strokeWidth="2" />
      <rect x="84" y="164" width="392" height="156" rx="3" fill="none" stroke="var(--ice-dim)" strokeDasharray="4 6" />
      {[130, 190, 250, 310, 370, 430].map((x) => (
        <line key={x} x1={x} y1="150" x2={x} y2="334" stroke="var(--line)" />
      ))}
      {/* door */}
      <rect x="400" y="190" width="66" height="130" fill="#0e1727" stroke="var(--ice)" />
      <rect x="452" y="248" width="6" height="22" fill="var(--ice)" />

      {/* refrigeration unit */}
      <rect x="490" y="176" width="68" height="108" rx="4" fill="#0e1727" stroke="var(--ice)" strokeWidth="2" />
      <circle cx="524" cy="214" r="22" fill="none" stroke="var(--ice)" strokeWidth="2" />
      <g stroke="var(--ice)" strokeWidth="2" strokeLinecap="round">
        <path d="M524 214 L524 196 M524 214 L539 223 M524 214 L509 223" />
      </g>
      <line x1="502" y1="256" x2="546" y2="256" stroke="var(--ice-dim)" />
      <line x1="502" y1="266" x2="546" y2="266" stroke="var(--ice-dim)" />
      <path d="M490 240 H480" stroke="var(--ice)" strokeWidth="2" />

      {/* dimension: length */}
      <g stroke="var(--ice-dim)" strokeWidth="1" fill="none">
        <path d="M70 420 H490 M70 412 V428 M490 412 V428" />
      </g>
      <text x="280" y="446" textAnchor="middle" className="svg-label">20 ft</text>
      {/* dimension: height */}
      <g stroke="var(--ice-dim)" strokeWidth="1" fill="none">
        <path d="M40 150 V334 M32 150 H48 M32 334 H48" />
      </g>
      <text x="26" y="248" textAnchor="middle" className="svg-label" transform="rotate(-90 26 248)">8 ft</text>

      {/* measurement points + connections */}
      <g fill="none" stroke="var(--ice)" strokeWidth="1.25">
        <path d="M200 200 L200 100 H420" />
        <path d="M524 176 L524 100 H420" />
        <path d="M300 300 L300 80 H420" />
        <path d="M420 100 H560 L590 70" />
      </g>
      {[[200, 200], [300, 300], [524, 176]].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="var(--ice)" opacity=".5" />
          <circle cx={cx} cy={cy} r="4" fill="var(--ice)" />
        </g>
      ))}
      <rect x="560" y="40" width="64" height="34" rx="3" fill="#0e1727" stroke="var(--ice)" />
      <text x="592" y="62" textAnchor="middle" className="svg-label">LOG</text>
      <text x="200" y="224" textAnchor="middle" className="svg-label">temp</text>
      <text x="300" y="324" textAnchor="middle" className="svg-label">kW</text>
      <text x="524" y="302" textAnchor="middle" className="svg-label">unit</text>
    </svg>
  )
}
