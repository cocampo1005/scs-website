import { Blocks, TrendingUp, Sparkles, Users } from "lucide-react";
import customSoftwareImg from "../assets/images/custom-software-image.webp";
import webDevImg from "../assets/images/web-dev-image.webp";
import uiuxDesignImg from "../assets/images/ux-ui-design-image.webp";
import sccFeatureImg from "../assets/images/scc-feature-image.webp";
import mmFeatureImg from "../assets/images/mm-feature-image.webp";
import bbFeatureImg from "../assets/images/bio-feature-image.webp";

export const SERVICES = [
  {
    title: "Custom Software",
    description:
      "Tailored web apps built to solve your unique business challenges with cutting-edge technology",
    image: customSoftwareImg,
    alt: "custom software illustration",
  },
  {
    title: "Web Development",
    description:
      "Modern, responsive websites that captivate your audience and drive business growth",
    image: webDevImg,
    alt: "web development illustration",
  },
  {
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces that users love and that align with your brand identity",
    image: uiuxDesignImg,
    alt: "UI/UX design illustration",
  },
];

export const ADVANTAGES = [
  {
    title: "Tailored to Your Business",
    description:
      "Every solution is designed around your unique needs, making your workflows faster and more efficient.",
    icon: Blocks,
  },
  {
    title: "Modern & Scalable Technology",
    description:
      "We use cutting-edge frameworks that grow with your business, so your digital presence never falls behind.",
    icon: TrendingUp,
  },
  {
    title: "Design That Elevates Your Brand",
    description:
      "Intuitive, beautiful interfaces that captivate users and strengthen your brand identity.",
    icon: Sparkles,
  },
  {
    title: "Collaborative & Transparent Process",
    description:
      "We work closely with you from concept to launch, ensuring clarity, trust, and results at every step.",
    icon: Users,
  },
];

export const PROJECTS = [
  {
    slug: "street-cat-clinic",
    title: "Street Cat Clinic Data Management App",
    blurb:
      "End-to-end records system for staff and coordinators – database setup, record entry and keeping, staff management, and automated PDF Form generation in one place.",
    image: sccFeatureImg,
    alt: "Screenshot concept of a data management interface",
    href: "/projects#street-cat-clinic",
    tags: ["React", "Firebase", "PDF Gen", "Role-based UI"],
  },
  {
    slug: "meowmax",
    title: "MeowMax Appointment Scheduling App",
    blurb:
      "Mobile-first scheduling web app, admin oversight, and real-time updates for TNR and foster workflows.",
    image: mmFeatureImg,
    alt: "Scheduling grid showing available appointment slots",
    href: "/projects#meowmax",
    tags: ["React", "Firebase", "Realtime", "Admin Tools", "UX/UI"],
  },
  {
    slug: "bio-blast",
    title: "Blast It Off & Bio Coatings Websites",
    blurb:
      "Two sister sites working in tandem – sandblasting and powder-coating service funnels with fast, SEO-ready pages.",
    image: bbFeatureImg,
    alt: "Website mockups for industrial services",
    href: "/projects#bio-blast",
    tags: ["WordPress", "SEO", "Performance", "Conversion"],
  },
];
