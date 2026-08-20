"use client";

import { motion, useReducedMotion } from "framer-motion";

export type HeroArtVariant = "practitioners" | "projects" | "community";

const SQRT3 = Math.sqrt(3);

function hexPoints(cx: number, cy: number, radius: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
}

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = (Math.PI / 180) * deg;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function ArtFrame({
  children,
  glowId,
  washId,
}: {
  children: React.ReactNode;
  glowId: string;
  washId: string;
}) {
  return (
    <svg
      viewBox="0 0 560 460"
      className="relative h-auto w-full drop-shadow-sm"
      fill="none"
      role="presentation"
    >
      <defs>
        <radialGradient id={washId} cx="50%" cy="48%" r="58%">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="280" cy="232" r="210" fill={`url(#${washId})`} />
      {children}
    </svg>
  );
}

function PersonGlyph({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`} fill="currentColor" stroke="none">
      <circle cy="-5" r="3.4" />
      <path d="M-7.2 8.5c0-4.1 3.2-6.4 7.2-6.4s7.2 2.3 7.2 6.4" />
    </g>
  );
}

function PractitionersHive({
  glowId,
  reduceMotion,
}: {
  glowId: string;
  reduceMotion: boolean | null;
}) {
  const origin = { x: 280, y: 232 };
  const size = 46;
  const radius = 38;

  const cells = [
    { q: 0, r: 0, role: "core" },
    { q: 1, r: 0, role: "chart" },
    { q: 1, r: -1, role: "fill" },
    { q: 0, r: -1, role: "nodes" },
    { q: -1, r: 0, role: "fill" },
    { q: -1, r: 1, role: "accent" },
    { q: 0, r: 1, role: "fill" },
    { q: 2, r: -1, role: "ghost" },
    { q: 2, r: -2, role: "ghost" },
    { q: 1, r: -2, role: "ghost" },
    { q: 0, r: -2, role: "ghost" },
    { q: -1, r: -1, role: "ghost" },
    { q: -2, r: 0, role: "ghost" },
    { q: -2, r: 1, role: "ghost" },
    { q: -2, r: 2, role: "ghost" },
    { q: -1, r: 2, role: "ghost" },
    { q: 1, r: 1, role: "ghost" },
    { q: 2, r: 0, role: "ghost" },
  ] as const;

  const dirs = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ] as const;

  function toPixel(q: number, r: number) {
    return {
      x: origin.x + size * (SQRT3 * q + (SQRT3 / 2) * r),
      y: origin.y + size * ((3 / 2) * r),
    };
  }

  const byKey = new Map(cells.map((cell) => [`${cell.q},${cell.r}`, cell]));
  const links = cells.flatMap((cell) => {
    const fromKey = `${cell.q},${cell.r}`;
    return dirs
      .map(([dq, dr]) => byKey.get(`${cell.q + dq},${cell.r + dr}`))
      .filter((to): to is (typeof cells)[number] =>
        to != null && `${to.q},${to.r}` > fromKey,
      )
      .map((to) => ({ from: cell, to }));
  });

  return (
    <>
      {links.map(({ from, to }) => {
        const a = toPixel(from.q, from.r);
        const b = toPixel(to.q, to.r);
        const ghost = from.role === "ghost" && to.role === "ghost";
        const accent = from.role === "accent" || to.role === "accent";
        return (
          <line
            key={`${from.q},${from.r}-${to.q},${to.r}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            strokeWidth={accent ? 1.35 : 1}
            strokeOpacity={ghost ? 0.12 : accent ? 0.38 : 0.22}
          />
        );
      })}
      {cells.map((cell) => {
        const { x, y } = toPixel(cell.q, cell.r);
        const r = cell.role === "core" ? radius + 3 : radius;
        const fill =
          cell.role === "core"
            ? "rgba(255,255,255,0.18)"
            : cell.role === "accent"
              ? "rgba(231,110,75,0.28)"
              : cell.role === "ghost"
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.1)";
        const stroke =
          cell.role === "core"
            ? "rgba(255,255,255,0.72)"
            : cell.role === "accent"
              ? "rgba(255,214,196,0.85)"
              : cell.role === "ghost"
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.42)";

        return (
          <g key={`${cell.q},${cell.r}`} transform={`translate(${x} ${y})`}>
            <polygon
              points={hexPoints(0, 0, r)}
              fill={fill}
              stroke={stroke}
              strokeWidth={cell.role === "core" ? 1.6 : 1.1}
              filter={cell.role === "core" ? `url(#${glowId})` : undefined}
            />
            {cell.role === "core" ? (
              <g stroke="currentColor" strokeWidth="1.15" fill="none">
                <circle cx="0" cy="0" r="5.5" fill="currentColor" stroke="none" />
                <circle cx="-11" cy="-6" r="2.2" fill="currentColor" stroke="none" />
                <circle cx="11" cy="-5" r="2.2" fill="currentColor" stroke="none" />
                <circle cx="-7" cy="11" r="2.2" fill="currentColor" stroke="none" />
                <circle cx="9" cy="10" r="2.2" fill="currentColor" stroke="none" />
                <line x1="0" y1="0" x2="-11" y2="-6" opacity="0.6" />
                <line x1="0" y1="0" x2="11" y2="-5" opacity="0.6" />
                <line x1="0" y1="0" x2="-7" y2="11" opacity="0.6" />
                <line x1="0" y1="0" x2="9" y2="10" opacity="0.6" />
              </g>
            ) : null}
            {cell.role === "chart" ? (
              <g fill="currentColor" opacity="0.85">
                <rect x="-11" y="2" width="5.5" height="10" rx="1" />
                <rect x="-2.75" y="-5" width="5.5" height="17" rx="1" />
                <rect x="5.5" y="-10" width="5.5" height="22" rx="1" />
              </g>
            ) : null}
            {cell.role === "nodes" ? (
              <g stroke="currentColor" strokeWidth="1.2" fill="currentColor">
                <line x1="-8" y1="6" x2="0" y2="-8" opacity="0.55" />
                <line x1="8" y1="6" x2="0" y2="-8" opacity="0.55" />
                <line x1="-8" y1="6" x2="8" y2="6" opacity="0.55" />
                <circle cx="-8" cy="6" r="2.4" />
                <circle cx="8" cy="6" r="2.4" />
                <circle cx="0" cy="-8" r="2.8" />
              </g>
            ) : null}
            {cell.role === "accent" ? (
              <g fill="none" stroke="#ffd0bc" strokeWidth="1.3">
                <polyline points="-9,4 -4,-6 2,2 8,-8" />
                <circle cx="-9" cy="4" r="1.8" fill="#ffd0bc" stroke="none" />
                <circle cx="-4" cy="-6" r="1.8" fill="#ffd0bc" stroke="none" />
                <circle cx="2" cy="2" r="1.8" fill="#ffd0bc" stroke="none" />
                <circle cx="8" cy="-8" r="1.8" fill="#ffd0bc" stroke="none" />
              </g>
            ) : null}
          </g>
        );
      })}
      {!reduceMotion ? (
        <motion.circle
          cx={origin.x}
          cy={origin.y}
          r="3.2"
          fill="currentColor"
          animate={{ opacity: [0.25, 1, 0.25], r: [2.6, 4.2, 2.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </>
  );
}

function ProjectsPipeline({
  glowId,
  reduceMotion,
}: {
  glowId: string;
  reduceMotion: boolean | null;
}) {
  const stations = [
    { x: 118, y: 286, label: "Raw", kind: "raw" as const },
    { x: 232, y: 198, label: "SQL", kind: "sql" as const },
    { x: 348, y: 286, label: "Model", kind: "model" as const },
    { x: 458, y: 168, label: "Ship", kind: "ship" as const },
  ];

  const path = "M118 286 C170 286, 180 198, 232 198 S300 286, 348 286 S410 168, 458 168";

  return (
    <>
      {[
        { x: 90, y: 120, r: 26 },
        { x: 470, y: 330, r: 30 },
        { x: 80, y: 360, r: 22 },
        { x: 500, y: 90, r: 20 },
      ].map((hex) => (
        <polygon
          key={`${hex.x}-${hex.y}`}
          points={hexPoints(hex.x, hex.y, hex.r)}
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
      ))}

      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />
      {!reduceMotion ? (
        <motion.path
          d={path}
          stroke="#ffd0bc"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="10 18"
          animate={{ strokeDashoffset: [0, -56] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
      ) : null}

      {stations.map((station, index) => {
        const isShip = station.kind === "ship";
        return (
          <g key={station.label} transform={`translate(${station.x} ${station.y})`}>
            <polygon
              points={hexPoints(0, 0, isShip ? 46 : 40)}
              fill={isShip ? "rgba(231,110,75,0.3)" : "rgba(255,255,255,0.12)"}
              stroke={isShip ? "rgba(255,214,196,0.9)" : "rgba(255,255,255,0.55)"}
              strokeWidth={isShip ? 1.7 : 1.2}
              filter={isShip ? `url(#${glowId})` : undefined}
            />
            {station.kind === "raw" ? (
              <g fill="currentColor">
                <ellipse cx="0" cy="-8" rx="10" ry="3.2" opacity="0.9" />
                <ellipse cx="0" cy="-1" rx="10" ry="3.2" opacity="0.7" />
                <ellipse cx="0" cy="6" rx="10" ry="3.2" opacity="0.5" />
              </g>
            ) : null}
            {station.kind === "sql" ? (
              <g fill="currentColor" opacity="0.9">
                <rect x="-12" y="4" width="6" height="10" rx="1" />
                <rect x="-3" y="-6" width="6" height="20" rx="1" />
                <rect x="6" y="-2" width="6" height="16" rx="1" />
              </g>
            ) : null}
            {station.kind === "model" ? (
              <g fill="none" stroke="currentColor" strokeWidth="1.4">
                <polyline points="-12,6 -4,-8 3,2 12,-10" />
                <circle cx="-12" cy="6" r="2" fill="currentColor" stroke="none" />
                <circle cx="-4" cy="-8" r="2" fill="currentColor" stroke="none" />
                <circle cx="3" cy="2" r="2" fill="currentColor" stroke="none" />
                <circle cx="12" cy="-10" r="2" fill="currentColor" stroke="none" />
              </g>
            ) : null}
            {station.kind === "ship" ? (
              <g stroke="#ffd0bc" fill="none" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="-10,2 -3,10 12,-10" />
              </g>
            ) : null}
            <text
              y="62"
              textAnchor="middle"
              className="fill-current text-[11px] font-semibold tracking-[0.14em]"
              opacity="0.72"
            >
              {station.label.toUpperCase()}
            </text>
            {!reduceMotion && isShip ? (
              <motion.circle
                r="3"
                fill="#ffd0bc"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, delay: index * 0.15, repeat: Infinity }}
              />
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function CommunityConstellation({
  glowId,
  reduceMotion,
}: {
  glowId: string;
  reduceMotion: boolean | null;
}) {
  const cx = 280;
  const cy = 228;
  const members = [0, 60, 120, 180, 240, 300].map((deg) => polar(cx, cy, 128, deg - 90));
  const peers = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 2],
    [3, 5],
  ];

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="128"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeDasharray="5 8"
      />
      {peers.map(([a, b]) => {
        const from = members[a]!;
        const to = members[b]!;
        const long = Math.abs(a - b) === 2 || Math.abs(a - b) === 4;
        return (
          <line
            key={`${a}-${b}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            strokeWidth={long ? 1 : 1.2}
            strokeOpacity={long ? 0.12 : 0.28}
          />
        );
      })}
      {members.map((member) => (
        <line
          key={`hub-${member.x}-${member.y}`}
          x1={cx}
          y1={cy}
          x2={member.x}
          y2={member.y}
          stroke="currentColor"
          strokeWidth="1.15"
          strokeOpacity="0.32"
        />
      ))}

      <polygon
        points={hexPoints(cx, cy, 58)}
        fill="rgba(255,255,255,0.16)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.6"
        filter={`url(#${glowId})`}
      />
      <PersonGlyph x={cx} y={cy + 2} size={1.35} />
      <text
        x={cx}
        y={cy + 78}
        textAnchor="middle"
        className="fill-current text-[11px] font-semibold tracking-[0.16em]"
        opacity="0.72"
      >
        COHORT
      </text>

      {members.map((member, index) => (
        <g key={`m-${index}`}>
          <circle
            cx={member.x}
            cy={member.y}
            r="22"
            fill={index === 1 ? "rgba(231,110,75,0.28)" : "rgba(255,255,255,0.12)"}
            stroke={index === 1 ? "rgba(255,214,196,0.9)" : "rgba(255,255,255,0.5)"}
            strokeWidth="1.2"
          />
          <g className={index === 1 ? "text-[#ffd0bc]" : "text-primary-foreground"}>
            <PersonGlyph x={member.x} y={member.y + 1} />
          </g>
          {!reduceMotion && index % 2 === 0 ? (
            <motion.circle
              cx={member.x}
              cy={member.y}
              r="22"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              animate={{ opacity: [0.1, 0.45, 0.1], r: [22, 28, 22] }}
              transition={{ duration: 3.2, delay: index * 0.2, repeat: Infinity }}
            />
          ) : null}
        </g>
      ))}
    </>
  );
}

export function HeroSlideArt({ variant }: { variant: HeroArtVariant }) {
  const reduceMotion = useReducedMotion();
  const glowId = `hero-art-${variant}-glow`;
  const washId = `hero-art-${variant}-wash`;

  return (
    <div className="relative h-full w-full max-w-xl text-primary-foreground" aria-hidden>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden
      />
      <ArtFrame glowId={glowId} washId={washId}>
        {variant === "practitioners" ? (
          <PractitionersHive glowId={glowId} reduceMotion={reduceMotion} />
        ) : null}
        {variant === "projects" ? (
          <ProjectsPipeline glowId={glowId} reduceMotion={reduceMotion} />
        ) : null}
        {variant === "community" ? (
          <CommunityConstellation glowId={glowId} reduceMotion={reduceMotion} />
        ) : null}
      </ArtFrame>
    </div>
  );
}
