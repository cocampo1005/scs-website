import { PAGE_PATHS } from "./src/routes.js";

// SPA with build-time HTML for every page (no server needed on Hostinger)
export default {
  appDirectory: "src/app",
  ssr: false,
  prerender: PAGE_PATHS,
};
