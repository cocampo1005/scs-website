import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const Spline = lazy(() => import("@splinetool/react-spline"));
import HexagonLoader from "../components/HexagonLoader";
import { Boxes, Globe, Palette } from "lucide-react";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const appRef = useRef(null);
  const rafRef = useRef(null);
  const solvedRef = useRef(false);

  function startWatchingSolved() {
    // Avoid multiple watchers
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const solved =
        appRef.current && appRef.current.getVariable
          ? appRef.current.getVariable("puzzleSolved")
          : false;

      if (solved && !solvedRef.current) {
        solvedRef.current = true;
        setShowUI(true);
        return; // stop watching
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }

  const handleMouseMove = (e, cardRef) => {
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  function handleLoad(app) {
    appRef.current = app;
    setReady(true);
    startWatchingSolved();
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[100svh] min-h-[800px] overflow-hidden flex flex-col items-center justify-start pt-[clamp(10vh,18vh,24vh)]">
        {/* Spline background */}
        <div className="absolute inset-0">
          <div
            className={`h-full w-full spline-wrap overscroll-contain select-none ${
              showUI ? "touch-auto" : "touch-none"
            }`}
          >
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/7sWk3IF3iLADtCBs/scene.splinecode"
                onLoad={handleLoad}
              />
            </Suspense>

            {/* Loader overlay */}
            <HexagonLoader ready={ready} />
          </div>
        </div>

        {/* Headline + CTAs (fade in after puzzleSolved) */}
        <div
          className={`absolute inset-x-0 top-[22vh] z-10 text-center max-w-5xl mx-auto p-4
              transition-opacity duration-700
              ${showUI ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          aria-hidden={showUI}
        >
          <h1 className="font-logo text-2xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-200 to-purple-300 bg-clip-text text-transparent">
            Can't Seem to Find a Digital Solution That Really Fits?
          </h1>
        </div>

        {/* Solved state: your existing headline and CTAs */}
        <div
          className={`relative text-center max-w-5xl p-4 transition-opacity duration-700 delay-100
    ${
      showUI
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }`}
        >
          <h1 className="font-logo text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent">
            The Missing Piece to Your Digital Solution
          </h1>
          <p className="font-sans text-lg md:text-xl text-gray-light mb-8 max-w-3xl mx-auto">
            Solid Code Solutions builds tailored websites and web applications
            that click into place for your brand, your users, and your goals.
          </p>
          <div className="flex flex-nowrap gap-2 md:gap-10 justify-center">
            <Link to="/contact" className="btn-primary">
              Start Your Project
            </Link>

            <Link to="/projects" className="btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>

        {/* Scroll indicator (hide once solved if you want) */}
        {showUI && (
          <div className="absolute bottom-8 animate-bounce">
            <div className="w-6 h-10 border-2 border-accent-purple rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-accent-purple rounded-full mt-2"></div>
            </div>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[10vh] z-10
                  bg-gradient-to-t from-primary-dark-purple via-primary-dark-purple/50 to-transparent"
        />
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-logo text-center mb-16 bg-gradient-to-r from-accent-fuchsia to-accent-purple bg-clip-text text-transparent">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Software",
                description:
                  "Tailored web apps built to solve your unique business challenges with cutting-edge technology",
                icon: (
                  <Boxes className="w-12 h-12 text-accent-purple-light mb-4" />
                ),
              },
              {
                title: "Web Development",
                description:
                  "Modern, responsive websites that captivate your audience and drive business growth",
                icon: (
                  <Globe className="w-12 h-12 text-accent-purple-light mb-4" />
                ),
              },
              {
                title: "UI/UX Design",
                description:
                  "Beautiful, intuitive interfaces that users love and that align with your brand identity",
                icon: (
                  <Palette className="w-12 h-12 text-accent-purple-light mb-4" />
                ),
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-fuchsia-500/50 transition-all duration-300 overflow-hidden"
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

                <div className="relative z-10">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-fuchsia-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "100%", label: "Client Satisfaction" },
            { number: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-5xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can bring your ideas to life
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300 transform hover:scale-105">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
}
