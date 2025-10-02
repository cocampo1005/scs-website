export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pt-24 px-6">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            About Solid Code Solutions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transforming ideas into powerful digital solutions with precision
            and creativity
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20 rounded-3xl p-8 border border-purple-500/30 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">⚡</div>
              <p className="text-2xl font-semibold text-fuchsia-300">
                Innovation Driven
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-fuchsia-300">
              Our Story
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Solid Code Solutions was founded with a singular mission: to
              deliver exceptional software and web solutions that exceed
              expectations. We specialize in turning complex challenges into
              elegant, user-friendly applications.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With expertise spanning modern web technologies, custom software
              development, and intuitive design, we partner with businesses to
              create digital experiences that drive real results.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: "🎯",
                title: "Precision",
                desc: "Every line of code matters",
              },
              {
                icon: "🚀",
                title: "Innovation",
                desc: "Always pushing boundaries",
              },
              {
                icon: "🤝",
                title: "Partnership",
                desc: "Your success is our success",
              },
              {
                icon: "💎",
                title: "Quality",
                desc: "Excellence in every detail",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-fuchsia-500/50 transition-all duration-300 text-center"
              >
                <div className="text-5xl mb-3">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-fuchsia-300">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            Our Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "React",
              "Node.js",
              "Python",
              "TypeScript",
              "Next.js",
              "PostgreSQL",
              "AWS",
              "Tailwind CSS",
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-500/20 hover:bg-white/10 transition-all duration-300"
              >
                <p className="font-semibold text-gray-200">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto pb-20">
        <div className="text-center bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-gray-300 mb-6">
            Ready to start your next project?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300 transform hover:scale-105">
            Contact Us Today
          </button>
        </div>
      </section>
    </div>
  );
}
