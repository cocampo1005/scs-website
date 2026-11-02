import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// index.html carries default tags for clients that do not run JavaScript.
// Pages render their own through <SEO>, so drop the defaults to avoid duplicates.
document.querySelectorAll("[data-static-seo]").forEach((el) => el.remove());

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
