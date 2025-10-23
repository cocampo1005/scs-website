import { useState } from "react";
import { Link } from "react-router-dom";
import { buildStartSimilarLink } from "../utils/similarProjectLinks";

function ProjectCard({
  title,
  blurb,
  image,
  alt,
  href,
  slug,
  key,
  tags,
  index,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isEven = index % 2 === 0;

  const handleContentMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <article
      className="group relative bg-gradient-to-br from-accent-purple/5 to-accent-fuchsia/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-accent-fuchsia-dark/20 hover:border-accent-fuchsia-dark/50 transition-all duration-500 shadow-2xl shadow-fuchsia-500/5 hover:shadow-fuchsia-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } gap-0`}
      >
        {/* Image Section */}
        <div className="relative md:w-1/2 overflow-hidden">
          <div className="relative aspect-square md:aspect-auto md:h-full md:min-h-[400px]">
            <img
              src={image}
              alt={alt}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              loading="lazy"
            />

            {/* Mobile: bottom gradient overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 h-1/3 md:hidden bg-gradient-to-t from-primary-dark-purple/80 to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-70" : "opacity-90"
              }`}
              aria-hidden="true"
            />

            {/* Desktop/Tablet: side overlay (unchanged behavior) */}
            <div
              className={`absolute inset-0 hidden md:block ${
                isEven ? "bg-gradient-to-r" : "bg-gradient-to-l"
              } from-transparent via-transparent to-primary-dark-purple/80 transition-opacity duration-500 ${
                isHovered ? "opacity-70" : "opacity-90"
              }`}
              aria-hidden="true"
            />

            {/* Mobile: bottom accent line */}
            <div
              className={`absolute inset-x-0 bottom-0 md:hidden h-1 bg-gradient-to-r from-accent-fuchsia via-accent-purple to-accent-fuchsia transition-all duration-500 ${
                isHovered ? "opacity-100 h-1.5" : "opacity-60"
              }`}
              aria-hidden="true"
            />

            {/* Desktop/Tablet: side accent line (unchanged behavior) */}
            <div
              className={`absolute hidden md:block ${
                isEven ? "right-0" : "left-0"
              } top-0 bottom-0 w-1 bg-gradient-to-b from-accent-fuchsia via-accent-purple to-accent-fuchsia transition-all duration-500 ${
                isHovered ? "opacity-100 w-2" : "opacity-50"
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Content Section */}
        <div
          className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-accent-purple/0 to-accent-fuchsia/5 backdrop-blur-sm border border-accent-fuchsia-dark/30 md:border-accent-purple-dark/30 hover:border-accent-fuchsia-dark/50 transition-all duration-300 overflow-hidden shadow-lg shadow-fuchsia-500/10"
          onMouseMove={handleContentMouseMove}
        >
          {/* Cursor glow effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 70, 239, 0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 space-y-6">
            {/* Project number badge */}
            <div className="inline-flex items-center gap-2 text-sm font-mono text-accent-fuchsia-light">
              <span className="w-8 h-px bg-accent-fuchsia"></span>
              <span>Project {String(index + 1).padStart(2, "0")}</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-gradient-to-r from-fuchsia-200 to-purple-200 bg-clip-text leading-tight">
              {title}
            </h3>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {blurb}
            </p>

            {/* Tech tags */}
            {Array.isArray(tags) && tags.length > 0 && (
              <ul
                className="flex flex-wrap gap-3"
                aria-label="Project tech and highlights"
              >
                {tags.map((t) => (
                  <li
                    key={t}
                    className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-400/30 text-fuchsia-200 hover:border-fuchsia-400/50 transition-colors duration-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to={href}
                className="btn-primary"
                aria-label={`Open project: ${title}`}
              >
                View Case Study
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                to={buildStartSimilarLink(key ?? slug, title)}
                className="btn-secondary"
              >
                Start Similar Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated background effect */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        style={{
          background: `radial-gradient(circle at ${
            isEven ? "25%" : "75%"
          } 50%, rgba(217, 70, 239, 0.05), transparent 50%)`,
        }}
        aria-hidden="true"
      />
    </article>
  );
}
export default ProjectCard;
