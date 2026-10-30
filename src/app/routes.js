import { index, route } from "@react-router/dev/routes";

export default [
  index("../pages/Home.jsx"),
  route("about", "../pages/About.jsx"),
  route("projects", "../pages/Projects.jsx"),
  route("contact", "../pages/Contact.jsx"),
  route("privacy", "../pages/Privacy.jsx"),
  route("terms", "../pages/Terms.jsx"),
  route("*", "../pages/NotFound.jsx"),
];
