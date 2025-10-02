export default function HexagonLoader({ ready }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        ready ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-busy={!ready}
    >
      <div className="relative w-20 h-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            animation: "hover 2s ease-in-out infinite",
            filter: "drop-shadow(0 8px 20px rgba(217, 70, 239, 0.6))",
          }}
        >
          <defs>
            <linearGradient
              id="hexFillGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Filled hexagon */}
          <path
            d="M 50 5 L 85 27.5 L 85 72.5 L 50 95 L 15 72.5 L 15 27.5 Z"
            fill="url(#hexFillGradient)"
          />
        </svg>

        <style>{`
          @keyframes hover {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
      <span className="sr-only">Loading 3D scene</span>
    </div>
  );
}
