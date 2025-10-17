// CubeLoader.jsx
import React from "react";

export default function CubeLoader({
  ready = false,
  size = 80,
  label = "Loading 3D Scene...",
}) {
  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        ready ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-busy={!ready}
      aria-live="polite"
    >
      {/* Loader */}
      <div
        className="cube-loader"
        style={{
          "--s": `${size}px`,
          "--from": "hsl(292, 91%, 53%)", // fuchsia
          "--to": "hsl(271, 81%, 56%)", // purple
          "--glow": "rgba(217,70,239,0.8)", // glow
        }}
      >
        <div className="cube-top" />
        <div className="cube-wrapper">
          <span style={{ "--i": 0 }} className="cube-span" />
          <span style={{ "--i": 1 }} className="cube-span" />
          <span style={{ "--i": 2 }} className="cube-span" />
          <span style={{ "--i": 3 }} className="cube-span" />
        </div>
      </div>

      {/* Label */}
      <span className="mt-20 text-sm md:text-base text-gray-300">{label}</span>

      {/* Scoped Styles */}
      <style>{`
        .cube-loader {
          position: relative;
          width: var(--s);
          height: var(--s);
          transform-style: preserve-3d;
          transform: rotateX(-30deg);
          animation: cube-rotate 3s linear infinite;
        }

        @keyframes cube-rotate {
          0% { transform: rotateX(-30deg) rotateY(0deg); }
          100% { transform: rotateX(-30deg) rotateY(360deg); }
        }

        .cube-wrapper {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .cube-span {
          position: absolute;
          inset: 0;
          transform: rotateY(calc(90deg * var(--i))) translateZ(calc(var(--s) / 2));
          background: linear-gradient(
            to bottom,
            color-mix(in oklab, var(--from), white 10%) 0%,
            var(--from) 25%,
            var(--to) 100%
          );
          border: 1px solid rgba(255,255,255,0.06);
        }

        .cube-top {
          position: absolute;
          width: var(--s);
          height: var(--s);
          background: linear-gradient(
            to bottom,
            color-mix(in oklab, var(--from), white 10%) 0%,
            var(--from) 25%,
            var(--to) 100%
          );
          transform: rotateX(90deg) translateZ(calc(var(--s) / 2));
          transform-style: preserve-3d;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .cube-top::before {
          content: "";
          position: absolute;
          width: var(--s);
          height: var(--s);
          transform: translateZ(calc(var(--s) * -1.2));
          filter: blur(12px);
          background: transparent;
          box-shadow:
            0 0 12px rgba(50,50,50,0.5),
            0 0 22px var(--glow),
            0 0 36px rgba(50,50,50,0.4),
            0 0 44px var(--glow);
        }

        @media (prefers-reduced-motion: reduce) {
          .cube-loader { animation: none; }
        }
      `}</style>
    </div>
  );
}
