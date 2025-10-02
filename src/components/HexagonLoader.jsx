import loadingGlowingHex from "../assets/icons/loading-glowing-hex.svg";

export default function HexagonLoader({ ready }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
        ready ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-busy={!ready}
    >
      <div className="relative w-20 h-20 md:w-40 md:h-40">
        <img
          src={loadingGlowingHex}
          alt=""
          style={{ animation: "float 2s ease-in-out infinite" }}
          className="w-full h-full"
        />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
        `}</style>
      </div>
      <span className="mt-4 text-sm md:text-lg text-gray-300">
        Loading 3D scene
      </span>
    </div>
  );
}
