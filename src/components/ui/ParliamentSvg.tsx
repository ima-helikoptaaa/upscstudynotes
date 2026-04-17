export function ParliamentSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 420"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Ground / base platform */}
      <rect x="0" y="395" width="1200" height="25" />
      <rect x="40" y="378" width="1120" height="20" rx="1" />
      <rect x="90" y="362" width="1020" height="18" rx="1" />

      {/* Colonnade base plinth */}
      <rect x="130" y="285" width="940" height="80" />

      {/* Columns - 38 columns across colonnade */}
      {Array.from({ length: 38 }, (_, i) => (
        <rect
          key={i}
          x={148 + i * 24}
          y={210}
          width={10}
          height={78}
          rx={2}
        />
      ))}

      {/* Colonnade capital bar */}
      <rect x="130" y="200" width="940" height="14" rx="2" />

      {/* Central building body */}
      <rect x="280" y="150" width="640" height="135" />

      {/* Left wing */}
      <rect x="130" y="180" width="155" height="110" />
      {/* Left wing roof arc */}
      <path d="M130 180 Q207 130 285 180 Z" />

      {/* Right wing */}
      <rect x="915" y="180" width="155" height="110" />
      {/* Right wing roof arc */}
      <path d="M915 180 Q993 130 1070 180 Z" />

      {/* Central dome base ellipse */}
      <ellipse cx="600" cy="150" rx="160" ry="18" />

      {/* Dome curve */}
      <path d="M440 150 Q520 60 600 40 Q680 60 760 150 Z" />

      {/* Dome lantern */}
      <rect x="590" y="20" width="20" height="24" rx="3" />

      {/* Finial */}
      <rect x="597" y="4" width="6" height="18" rx="2" />
      <circle cx="600" cy="4" r="5" />

      {/* Small decorative elements on colonnade top */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={`dec-${i}`}
          x={200 + i * 140}
          y={185}
          width={20}
          height={18}
          rx={2}
        />
      ))}

      {/* Entrance archways in central body */}
      <path d="M530 285 L530 220 Q600 190 670 220 L670 285 Z" />

      {/* Flagpole */}
      <rect x="597" y="-20" width="6" height="28" />
    </svg>
  );
}
