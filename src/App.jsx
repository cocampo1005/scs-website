import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

// Home ships in the main bundle; other pages load when visited
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-primary-dark-purple">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-fuchsia-dark focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
