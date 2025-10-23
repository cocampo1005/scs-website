import {
  Cpu,
  Crosshair,
  Gem,
  HeartHandshake,
  LineChart,
  Sparkles,
} from "lucide-react";
import GlowCard from "./GlowCard";
import Reveal from "./Reveal";

export default function ValuesGrid() {
  const values = [
    {
      icon: <Crosshair className="size-6" />,
      title: "Precision",
      desc: "Every detail adds up and supports the whole.",
    },
    {
      icon: <Sparkles className="size-6" />,
      title: "Innovation",
      desc: "Simple solutions to hard problems with fresh thinking.",
    },
    {
      icon: <HeartHandshake className="size-6" />,
      title: "Partnership",
      desc: "We listen well and win together with our clients.",
    },
    {
      icon: <Gem className="size-6" />,
      title: "Quality",
      desc: "Built to last and easy to grow over time.",
    },
    {
      icon: <Cpu className="size-6" />,
      title: "Engineering",
      desc: "Performance, reliability, and clean architecture.",
    },
    {
      icon: <LineChart className="size-6" />,
      title: "Outcomes",
      desc: "Real world impact and measurable value.",
    },
  ];

  return (
    <div className="relative pb-24">
      {/* subtle background grid glow */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[70vmin] rounded-full blur-3xl bg-fuchsia-600/10" />
      </div>
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-primary-dark-purple to-transparent"
      />

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 60}>
            <GlowCard className="group p-8">
              <div className="flex items-start gap-4">
                {/* uniform icon container */}
                <div
                  className="
                    grid place-items-center 
                    w-14 h-14 
                    rounded-xl 
                    bg-gradient-to-br from-fuchsia-600 to-purple-700 
                    ring-1 ring-purple-400/40 
                    transition-transform 
                    group-hover:scale-105
                    flex-shrink-0
                  "
                >
                  {v.icon}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-fuchsia-100">
                    {v.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">{v.desc}</p>
                </div>
              </div>

              {/* bottom accent — visible by default on mobile */}
              <div
                className="
                  mt-5 h-[3px] rounded-full 
                  bg-gradient-to-r from-fuchsia-400 to-purple-400
                  transition-all 
                  w-full md:w-0 md:group-hover:w-full
                "
              />
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
