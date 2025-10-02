import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white pt-24 px-6 pb-20">
      {/* Header */}
      <section className="max-w-6xl mx-auto py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Let's Build Together
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Ready to transform your ideas into reality? Get in touch and let's
          start the conversation.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 text-fuchsia-300">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white placeholder-gray-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white placeholder-gray-500"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white placeholder-gray-500"
                placeholder="Your Company"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Project Type
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white"
              >
                <option value="" className="bg-slate-900">
                  Select a type
                </option>
                <option value="web" className="bg-slate-900">
                  Web Development
                </option>
                <option value="software" className="bg-slate-900">
                  Custom Software
                </option>
                <option value="mobile" className="bg-slate-900">
                  Mobile App
                </option>
                <option value="design" className="bg-slate-900">
                  UI/UX Design
                </option>
                <option value="other" className="bg-slate-900">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Budget Range
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white"
              >
                <option value="" className="bg-slate-900">
                  Select a range
                </option>
                <option value="5k-10k" className="bg-slate-900">
                  $5,000 - $10,000
                </option>
                <option value="10k-25k" className="bg-slate-900">
                  $10,000 - $25,000
                </option>
                <option value="25k-50k" className="bg-slate-900">
                  $25,000 - $50,000
                </option>
                <option value="50k+" className="bg-slate-900">
                  $50,000+
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Tell Us About Your Project *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg focus:outline-none focus:border-fuchsia-500 transition-colors text-white placeholder-gray-500 resize-none"
                placeholder="Describe your project, goals, and timeline..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Cards */}
          <div className="bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20 rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold mb-6 text-fuchsia-300">
              Get In Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-300">hello@solidcodesolutions.com</p>
                  <p className="text-gray-400 text-sm">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-sm">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Location</h3>
                  <p className="text-gray-300">Remote-First Company</p>
                  <p className="text-gray-400 text-sm">
                    Serving clients worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "LinkedIn", icon: "💼" },
                { name: "GitHub", icon: "💻" },
                { name: "Twitter", icon: "🐦" },
                { name: "Instagram", icon: "📸" },
              ].map((social, index) => (
                <button
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-purple-500/20 hover:border-fuchsia-500/50 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-2xl">{social.icon}</span>
                  <span className="font-semibold">{social.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Response Time */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-2">Fast Response Time</h3>
            <p className="text-gray-300">
              We typically respond to all inquiries within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "What's your typical project timeline?",
              a: "Project timelines vary based on scope, but most projects range from 4-12 weeks from kickoff to launch.",
            },
            {
              q: "Do you offer ongoing support?",
              a: "Yes! We provide maintenance packages and ongoing support to ensure your solution continues to perform optimally.",
            },
            {
              q: "What industries do you work with?",
              a: "We've worked across 15+ industries including healthcare, finance, e-commerce, education, and more.",
            },
            {
              q: "Can you work with our existing team?",
              a: "Absolutely! We seamlessly integrate with your in-house team and existing development workflows.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
            >
              <h3 className="font-bold text-lg mb-3 text-fuchsia-300">
                {faq.q}
              </h3>
              <p className="text-gray-300 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
