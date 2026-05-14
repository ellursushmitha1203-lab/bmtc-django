export function HeroBus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="busBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD" />
          <stop offset="100%" stopColor="#90CAF9" />
        </linearGradient>
        <linearGradient id="busTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      {/* Road */}
      <ellipse cx="160" cy="178" rx="130" ry="8" fill="rgba(255,255,255,0.12)" />

      {/* Bus body */}
      <rect x="40" y="60" width="220" height="100" rx="18" fill="url(#busBody)" />
      <rect x="40" y="60" width="220" height="38" rx="18" fill="url(#busTop)" />

      {/* Windows */}
      <rect x="58" y="74" width="38" height="22" rx="5" fill="#BBDEFB" />
      <rect x="104" y="74" width="38" height="22" rx="5" fill="#BBDEFB" />
      <rect x="150" y="74" width="38" height="22" rx="5" fill="#BBDEFB" />
      <rect x="196" y="74" width="46" height="22" rx="5" fill="#BBDEFB" />

      {/* Door */}
      <rect x="200" y="108" width="40" height="44" rx="6" fill="#1565C0" opacity="0.85" />
      <line x1="220" y1="110" x2="220" y2="150" stroke="#0D47A1" strokeWidth="1.5" />

      {/* Headlight & route */}
      <rect x="48" y="118" width="14" height="10" rx="2" fill="#FFE082" />
      <rect x="70" y="116" width="120" height="14" rx="3" fill="#0D47A1" opacity="0.8" />
      <text x="130" y="127" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700" fontFamily="Inter, sans-serif">
        BMTC
      </text>

      {/* Wheels */}
      <circle cx="86" cy="162" r="16" fill="#1A1A2E" />
      <circle cx="86" cy="162" r="6" fill="#90CAF9" />
      <circle cx="222" cy="162" r="16" fill="#1A1A2E" />
      <circle cx="222" cy="162" r="6" fill="#90CAF9" />
    </svg>
  );
}
