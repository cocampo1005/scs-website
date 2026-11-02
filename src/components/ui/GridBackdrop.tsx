import { cn } from "./cn";

// Where the grid is visible. Masks fade it out so text never sits on bare grid.
const MASKS = {
  // Hero: faint behind the copy, full strength behind the cube, fading at the bottom
  hero: "[mask-image:linear-gradient(90deg,rgb(0_0_0/0.28)_0%,rgb(0_0_0/0.28)_36%,#000_62%),linear-gradient(180deg,#000_70%,transparent)] [mask-composite:intersect] max-lg:[mask-image:linear-gradient(180deg,rgb(0_0_0/0.25)_0%,rgb(0_0_0/0.25)_42%,#000_60%,transparent_100%)]",
  // Page headers: a patch in the top right
  corner: "[mask-image:radial-gradient(ellipse_50%_80%_at_85%_30%,#000,transparent)]",
  // Sections: a soft patch on the left
  left: "opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,#000,transparent)]",
  center: "[mask-image:radial-gradient(ellipse_45%_70%_at_50%_55%,#000,transparent)]",
} as const;

// Ambient violet light behind 3D and page headers
const GLOWS = {
  hero: "bg-[radial-gradient(760px_560px_at_74%_56%,rgb(139_92_246/0.26),transparent_70%),radial-gradient(520px_360px_at_82%_78%,rgb(232_121_249/0.16),transparent_70%),radial-gradient(900px_500px_at_10%_0%,rgb(124_58_237/0.1),transparent_70%)] max-lg:bg-[radial-gradient(320px_280px_at_50%_72%,rgb(139_92_246/0.3),transparent_70%),radial-gradient(600px_400px_at_50%_0%,rgb(124_58_237/0.12),transparent_70%)]",
  corner: "bg-[radial-gradient(600px_360px_at_85%_20%,rgb(139_92_246/0.22),transparent_70%)]",
  none: "",
} as const;

export function GridBackdrop({
  mask = "corner",
  glow = "none",
  className,
}: {
  mask?: keyof typeof MASKS;
  glow?: keyof typeof GLOWS;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {glow !== "none" && <div className={cn("absolute inset-0", GLOWS[glow])} />}
      <div className={cn("grid-motif absolute inset-0", MASKS[mask])} />
    </div>
  );
}
