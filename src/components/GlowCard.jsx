export default function GlowCard({ children, className = "" }) {
  return (
    <div
      className={`group relative bg-white/5 md:bg-white/5 bg-gradient-to-br from-accent-purple/10 to-accent-fuchsia/10 backdrop-blur-sm rounded-2xl border border-accent-fuchsia-dark/30 md:border-accent-purple-dark/30 hover:border-accent-fuchsia-dark/50 transition-all duration-300 overflow-hidden shadow-lg shadow-fuchsia-500/10 md:shadow-none ${className}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
      }}
      style={{
        "--mouse-x": "0px",
        "--mouse-y": "0px",
      }}
    >
      {/* Cursor shine effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(217, 70, 239, 0.15), transparent 40%)`,
        }}
      />

      {/* Border shine effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(217, 70, 239, 0.4), transparent 40%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
