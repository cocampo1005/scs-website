import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logos/scs-logo-cube.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/0 backdrop-blur-sm text-white p-4 shadow-md z-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold ml-2 md:ml-6">
          <Link
            to="/"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="Solid Code Solutions Logo"
              className="w-10 md:w-20 z-10 inline-block transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            <span
              className={`whitespace-nowrap font-display text-base md:text-3xl font-semibold transition-all duration-300 ${
                isLogoHovered
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              Solid Code Solutions
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden font-display text-lg md:flex gap-15 mr-6">
          <Link
            to="/about"
            className={`hover:scale-120 transition ${
              isActive("/about")
                ? "text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
                : "hover:text-fuchsia-300 hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
            }`}
          >
            About
          </Link>
          <Link
            to="/projects"
            className={`hover:scale-120 transition ${
              isActive("/projects")
                ? "text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
                : "hover:text-fuchsia-300 hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
            }`}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className={`hover:scale-120 transition ${
              isActive("/contact")
                ? "text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
                : "hover:text-fuchsia-300 hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.9)]"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden mr-2 p-2 hover:bg-gray-800/50 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 pb-4">
          <Link
            to="/about"
            className={`transition px-4 py-2 rounded active:bg-fuchsia-500/30 ${
              isActive("/about")
                ? "text-fuchsia-400 bg-fuchsia-500/20 border-l-4 border-fuchsia-400"
                : "hover:text-fuchsia-300 hover:bg-gray-800/30"
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/projects"
            className={`transition px-4 py-2 rounded active:bg-fuchsia-500/30 ${
              isActive("/projects")
                ? "text-fuchsia-400 bg-fuchsia-500/20 border-l-4 border-fuchsia-400"
                : "hover:text-fuchsia-300 hover:bg-gray-800/30"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className={`transition px-4 py-2 rounded active:bg-fuchsia-500/30 ${
              isActive("/contact")
                ? "text-fuchsia-400 bg-fuchsia-500/20 border-l-4 border-fuchsia-400"
                : "hover:text-fuchsia-300 hover:bg-gray-800/30"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
