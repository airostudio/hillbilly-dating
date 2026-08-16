export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 900 720"
      role="img"
      aria-label="A couple sitting close together on a pickup truck tailgate, watching the sunset with string lights glowing overhead and their dog resting nearby."
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3C46B" />
          <stop offset="34%" stopColor="#E8A356" />
          <stop offset="62%" stopColor="#D3714A" />
          <stop offset="100%" stopColor="#8C4A3E" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE9B8" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#F6BE72" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F6BE72" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillsFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C3A32" />
          <stop offset="100%" stopColor="#432A24" />
        </linearGradient>
        <linearGradient id="hillsNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2C3B27" />
          <stop offset="100%" stopColor="#20291C" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#25311F" />
          <stop offset="100%" stopColor="#161D13" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE29A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFE29A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="900" height="720" fill="url(#sky)" />
      <circle cx="620" cy="430" r="230" fill="url(#sun)" />

      {/* Stars / fireflies, upper sky only */}
      {[
        [60, 60], [140, 110], [230, 50], [330, 90], [420, 40], [520, 70],
        [90, 180], [200, 160], [700, 60], [780, 120], [830, 70], [760, 180],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.5} fill="#FFF3D6" opacity={0.8} />
      ))}

      {/* Far hills */}
      <path
        d="M0,430 C120,395 220,410 320,395 C430,378 520,405 620,392 C730,378 820,400 900,388 L900,720 L0,720 Z"
        fill="url(#hillsFar)"
        opacity="0.9"
      />

      {/* Near hills / ground */}
      <path
        d="M0,520 C150,485 260,505 380,492 C520,478 640,510 760,495 C820,488 860,498 900,492 L900,720 L0,720 Z"
        fill="url(#hillsNear)"
      />

      {/* String lights: post to truck */}
      <path
        d="M110,300 C260,260 420,255 560,300"
        fill="none"
        stroke="#3A2A22"
        strokeWidth="3"
        opacity="0.8"
      />
      {[
        [150, 308], [220, 288], [290, 276], [360, 271], [430, 274], [500, 288],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="url(#bulbGlow)" />
          <circle cx={x} cy={y} r="4.5" fill="#FFDE8A" />
        </g>
      ))}
      {/* light post */}
      <rect x="104" y="300" width="8" height="230" fill="#3A2A22" rx="2" />

      {/* Truck (simplified pickup, tailgate down, facing left) */}
      <g transform="translate(430,470)">
        {/* cab + bed body */}
        <path
          d="M0,90 L0,50 C0,38 8,30 20,30 L60,30 L80,-10 C86,-22 98,-30 112,-30 L200,-30 C214,-30 224,-20 224,-8 L224,30 L340,30 C352,30 360,38 360,50 L360,90 Z"
          fill="#3B2A21"
        />
        {/* windshield */}
        <path d="M92,-6 L110,-24 L196,-24 L206,-6 Z" fill="#8FA6A0" opacity="0.85" />
        {/* bed rail */}
        <rect x="224" y="-6" width="120" height="10" rx="2" fill="#2E2019" />
        {/* lowered tailgate, hinged flat off the back of the bed */}
        <rect x="344" y="30" width="92" height="10" rx="2" fill="#2E2019" />
        <rect x="340" y="-2" width="8" height="34" rx="2" fill="#2E2019" />
        {/* wheels */}
        <circle cx="70" cy="94" r="30" fill="#181310" />
        <circle cx="70" cy="94" r="12" fill="#5C4A3E" />
        <circle cx="300" cy="94" r="30" fill="#181310" />
        <circle cx="300" cy="94" r="12" fill="#5C4A3E" />
        {/* headlight */}
        <circle cx="12" cy="46" r="6" fill="#FFE29A" opacity="0.9" />
      </g>

      {/* Couple sitting on the tailgate, silhouetted, leaning together */}
      <g transform="translate(560,468)">
        {/* her: seated, leaning head onto his shoulder, hair down, sundress */}
        <path
          d="M-4,64 C-4,30 4,10 18,-2 C24,-8 30,-14 30,-24 C30,-36 22,-44 12,-44 C0,-44 -8,-34 -8,-24 C-8,-14 -2,-6 4,0 C-8,10 -18,28 -18,54 C-18,60 -14,64 -8,64 Z"
          fill="#2A1B15"
        />
        <circle cx="10" cy="-46" r="13" fill="#2A1B15" />
        {/* her hair */}
        <path d="M-2,-52 C-10,-52 -16,-44 -14,-34 C-13,-28 -10,-22 -6,-18 L2,-30 C0,-38 -2,-46 -2,-52 Z" fill="#1E120E" />

        {/* him: broader, cap, arm around her */}
        <path
          d="M40,64 C40,26 46,4 58,-8 C66,-16 72,-24 72,-34 C72,-47 62,-57 49,-57 C36,-57 26,-47 26,-34 C26,-24 32,-16 40,-8 C34,-2 30,6 28,16 C36,10 44,8 44,8 C44,8 30,20 26,40 C24,50 24,58 28,64 Z"
          fill="#241611"
        />
        <circle cx="49" cy="-59" r="15" fill="#241611" />
        {/* his cap */}
        <path d="M34,-70 C34,-79 41,-86 49,-86 C57,-86 64,-79 64,-70 L64,-66 L34,-66 Z" fill="#1B100C" />
        <path d="M62,-70 C70,-70 76,-68 76,-64 C76,-61 70,-61 63,-62 Z" fill="#1B100C" />

        {/* linked arm shape between them */}
        <path d="M28,16 C36,6 42,2 44,-2" stroke="#241611" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>

      {/* Dog sitting nearby, in profile, facing the truck */}
      <g transform="translate(694,548)" fill="#20140F">
        {/* tail */}
        <path d="M2,22 Q-10,12 -5,-2" stroke="#20140F" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* haunches / body */}
        <ellipse cx="20" cy="27" rx="20" ry="17" />
        {/* front leg */}
        <rect x="7" y="20" width="8" height="22" rx="4" />
        {/* head */}
        <circle cx="35" cy="4" r="12.5" />
        {/* snout */}
        <ellipse cx="46" cy="9" rx="7" ry="5.5" />
        {/* ear */}
        <path d="M27,-6 L22,-19 L34,-8 Z" />
      </g>

      {/* Foreground grass / ground */}
      <path
        d="M0,620 C180,600 320,635 480,612 C620,592 760,624 900,600 L900,720 L0,720 Z"
        fill="url(#grass)"
      />
      <g opacity="0.5" stroke="#0F150C" strokeWidth="3" strokeLinecap="round">
        {[40, 90, 150, 210, 640, 700, 760, 820, 860].map((x, i) => (
          <path key={i} d={`M${x},650 q4,-22 -2,-36`} />
        ))}
      </g>

      {/* film grain overlay for a hand-crafted, painterly finish */}
      <rect x="0" y="0" width="900" height="720" filter="url(#grain)" />
    </svg>
  );
}
