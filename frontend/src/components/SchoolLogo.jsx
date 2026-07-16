import React from "react";

export default function SchoolLogo({ size = "100%", className, ...props }) {

  // 13 flames radiating around the top half from -90 to +90 degrees
  const flameAngles = [-90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <defs>
        {/* Flame Gradient */}
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Shield Silver Gradient */}
        <radialGradient
          id="shieldGrad"
          cx="50%"
          cy="45%"
          r="60%"
          fx="35%"
          fy="35%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </radialGradient>

        {/* Gold Ribbon Gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Soft Drop Shadow for shield */}
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="6"
            floodColor="#000000"
            floodOpacity="0.4"
          />
        </filter>

        {/* Glow for text plaques */}
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.3"
          />
        </filter>

        {/* Single Flame Template */}
        <path
          id="flame"
          d="M 0 0 C -12 -25, -4 -50, -18 -80 C -5 -52, 10 -28, 0 0"
          fill="url(#flameGrad)"
        />
      </defs>

      {/* 1. Radiating Sun Rays (Flames) from top of the circle */}
      <g>
        {flameAngles.map((angle) => (
          <use
            key={angle}
            href="#flame"
            transform={`translate(250, 240) rotate(${angle}) translate(0, -102)`}
          />
        ))}
      </g>

      {/* 2. Main Circular Shield */}
      <circle
        cx="250"
        cy="240"
        r="110"
        fill="url(#shieldGrad)"
        stroke="#9ca3af"
        strokeWidth="4"
        filter="url(#shadow)"
      />

      {/* Inner shield rim */}
      <circle
        cx="250"
        cy="240"
        r="102"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />

      {/* 3. Bold Red Capital 'M' with thick white border */}
      <g filter="url(#glow)">
        <path
          d="M 172 305 L 205 150 L 235 150 L 250 215 L 265 150 L 295 150 L 328 305 L 293 305 L 282 225 L 256 295 L 244 295 L 218 225 L 207 305 Z"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinejoin="miter"
        />
      </g>

      {/* 4. Bold Yellow Capital 'A' with red border (Overlaid on 'M') */}
      <g filter="url(#glow)">
        {/* Outer path & inner counter hole using EvenOdd fill-rule */}
        <path
          d="M 215 330 L 250 232 L 285 330 L 262 330 L 254 304 L 246 304 L 238 330 Z 
             M 250 258 L 258 288 L 242 288 Z"
          fill="#facc15"
          stroke="#b91c1c"
          strokeWidth="4"
          strokeLinejoin="round"
          fillRule="evenodd"
        />
      </g>

      {/* 5. Slanted Left & Right Black Plaques */}
      {/* Left Plaque: BAHERI */}
      <g transform="rotate(-23, 155, 332)" filter="url(#glow)">
        <rect
          x="100"
          y="317"
          width="110"
          height="30"
          rx="6"
          fill="#111827"
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        <text
          x="155"
          y="338"
          fill="#ffffff"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="1"
          textAnchor="middle"
        >
          BAHERI
        </text>
      </g>

      {/* Right Plaque: BAREILLY */}
      <g transform="rotate(23, 345, 332)" filter="url(#glow)">
        <rect
          x="290"
          y="317"
          width="110"
          height="30"
          rx="6"
          fill="#111827"
          stroke="#ffffff"
          strokeWidth="2.5"
        />

        <text
          x="345"
          y="338"
          fill="#ffffff"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="14"
          letterSpacing="1"
          textAnchor="middle"
        >
          BAREILLY
        </text>
      </g>

      {/* 6. Curved Ribbon Banner at the very bottom */}
      <g filter="url(#shadow)">
        {/* Gold Ribbon Shadow/Base */}
        <path
          d="M 75 352 C 150 422, 350 422, 425 352 L 435 382 C 350 457, 150 457, 65 382 Z"
          fill="#b91c1c"
        />

        {/* Gold Ribbon Front */}
        <path
          d="M 80 348 C 152 418, 348 418, 420 348 L 430 378 C 348 452, 152 452, 70 378 Z"
          fill="url(#goldGrad)"
          stroke="#b91c1c"
          strokeWidth="3"
        />

        {/* Text Ribbon Curving: BAHERI • 1997 • BAREILLY */}
        {/* Define a path to guide the text */}
        <path
          id="textPathRibbon"
          d="M 88 372 C 156 438, 344 438, 412 372"
          fill="none"
        />

        <text>
          <textPath
            href="#textPathRibbon"
            startOffset="50%"
            textAnchor="middle"
            fill="#b91c1c"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="15"
          >
            BAHERI • 1997 • BAREILLY
          </textPath>
        </text>

        {/* Small decorative red dots on yellow ribbon */}
        <circle cx="218" cy="419" r="3.5" fill="#b91c1c" />
        <circle cx="282" cy="419" r="3.5" fill="#b91c1c" />
      </g>
    </svg>
  );
}
