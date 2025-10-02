export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Web Application",
      description:
        "Full-stack e-commerce solution with real-time inventory management and payment processing",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Analytics Dashboard",
      category: "SaaS Product",
      description:
        "Real-time data visualization platform with custom reporting and AI-powered insights",
      tags: ["Next.js", "Python", "TensorFlow", "D3.js"],
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      title: "Mobile Banking App",
      category: "Mobile Application",
      description:
        "Secure mobile banking solution with biometric authentication and instant transfers",
      tags: ["React Native", "Firebase", "AWS", "Encryption"],
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Healthcare Portal",
      category: "Enterprise Software",
      description:
        "HIPAA-compliant patient management system with telemedicine capabilities",
      tags: ["Vue.js", "Django", "WebRTC", "HIPAA"],
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "AI Content Generator",
      category: "AI/ML Tool",
      description:
        "Machine learning-powered content creation platform with multiple output formats",
      tags: ["React", "GPT-4", "FastAPI", "Redis"],
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Real Estate CRM",
      category: "Business Software",
      description:
        "Comprehensive property management system with automated marketing workflows",
      tags: ["Angular", "MongoDB", "Node.js", "SendGrid"],
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pt-24 px-6 pb-20">
      {/* Header */}
      <section className="max-w-6xl mx-auto py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Our Projects
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore our portfolio of innovative solutions that have helped
          businesses thrive in the digital landscape
        </p>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-fuchsia-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              {/* Project Header with Gradient */}
              <div
                className={`h-32 bg-gradient-to-r ${project.gradient} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-purple-900/30 rounded-full text-xs text-purple-300 border border-purple-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="px-6 pb-6">
                <button className="w-full py-2 bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 rounded-lg text-sm font-semibold border border-fuchsia-500/30 group-hover:from-fuchsia-600 group-hover:to-purple-600 transition-all duration-300">
                  View Case Study
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto mt-20 bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 rounded-3xl p-12 border border-purple-500/30">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Project Impact
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Projects Delivered" },
            { value: "15+", label: "Industries Served" },
            { value: "99%", label: "On-Time Delivery" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto mt-20">
        <div className="text-center bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-gray-300 mb-6">
            Let's collaborate to create something extraordinary
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300 transform hover:scale-105">
            Start Your Project
          </button>
        </div>
      </section>
    </div>
  );
}
