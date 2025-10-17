import { Eye, Target } from "lucide-react";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlowCard from "./GlowCard";
import Reveal from "./Reveal";

export default function MissionVisionTabs() {
  const [tab, setTab] = useState("mission");

  const tabs = [
    {
      key: "mission",
      label: (
        <span className="inline-flex items-center gap-2">
          <Target className="size-4" />
          Our Mission
        </span>
      ),
      content:
        "Help organizations move faster with reliable, maintainable, and thoughtful software and websites that deliver real results for real users.",
    },
    {
      key: "vision",
      label: (
        <span className="inline-flex items-center gap-2">
          <Eye className="size-4" />
          Our Vision
        </span>
      ),
      content:
        "A world where custom software and web solutions fit perfectly, feel intuitive, and look beautiful while quietly scaling in the background.",
    },
  ];

  const activeIndex = tab === "mission" ? 0 : 1;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIndex =
          e.key === "ArrowRight"
            ? (activeIndex + 1) % tabs.length
            : (activeIndex - 1 + tabs.length) % tabs.length;
        setTab(tabs[nextIndex].key);
      }
    },
    [activeIndex]
  );

  return (
    <Reveal as="div" delay={100} className="max-w-3xl mx-auto">
      <GlowCard className="p-0 overflow-hidden">
        <div className="relative">
          {/* Tablist */}
          <div
            className="relative grid grid-cols-2 z-[1]"
            role="tablist"
            aria-label="Mission and Vision"
            onKeyDown={handleKeyDown}
          >
            {/* Slider block behind the buttons */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 w-1/2 translate-y-0 rounded-lg bg-gradient-to-r from-fuchsia-600/60 to-purple-600/60 ring-1 ring-purple-400/30 transition-transform duration-300 ease-out z-0"
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {tabs.map((t) => {
              const isActive = t.key === tab;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${t.key}`}
                  id={`tab-${t.key}`}
                  onClick={() => setTab(t.key)}
                  className={[
                    "relative z-[1] cursor-pointer py-3 text-sm md:text-base font-semibold transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70 focus-visible:ring-offset-0 rounded-lg",
                    isActive
                      ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"
                      : "text-fuchsia-200/70",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div className="relative z-[1] p-6 md:p-8 border-t border-purple-500/30">
            <AnimatePresence mode="wait">
              <motion.p
                key={tab}
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab}`}
                className="text-gray-200 leading-relaxed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {tabs[activeIndex].content}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </GlowCard>
    </Reveal>
  );
}
