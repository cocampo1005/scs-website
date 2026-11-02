import type { CaseStudy, Device, Screenshot } from "../../content/types";
import { workPath } from "../../content/work";
import { buildStartSimilarLink } from "../../utils/similarProjectLinks";
import { ArrowIcon, LinkButton } from "../ui/Button";
import { Eyebrow } from "../ui/Section";
import { cn } from "../ui/cn";

/** A screenshot in a light device frame: browser chrome for desktop, a phone for mobile */
export function DeviceFrame({ image, device, className, priority }: { image: Screenshot; device: Device; className?: string; priority?: boolean }) {
  if (device === "mobile") {
    return (
      <div className={cn("mx-auto w-[58%] max-w-[230px] overflow-hidden rounded-[26px] border-[6px] border-[#1f1830] bg-[#1f1830] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]", className)}>
        <img src={image.src} alt={image.alt} loading={priority ? "eager" : "lazy"} className="block w-full rounded-[20px]" />
      </div>
    );
  }
  return (
    <div className={cn("overflow-hidden rounded-[12px] border border-[rgb(255_255_255/0.1)] bg-[#17122a] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]", className)}>
      <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-[rgb(255_255_255/0.06)] bg-[rgb(255_255_255/0.03)] px-3">
        <span className="size-2 rounded-full bg-[rgb(196_181_253/0.25)]" />
        <span className="size-2 rounded-full bg-[rgb(196_181_253/0.25)]" />
        <span className="size-2 rounded-full bg-[rgb(196_181_253/0.25)]" />
      </div>
      <img src={image.src} alt={image.alt} loading={priority ? "eager" : "lazy"} className="block w-full" />
    </div>
  );
}

/**
 * A featured software project: name, context, the problem, what we built, the
 * important capabilities, a product screenshot and the practical benefit, with
 * two separate actions. Nothing here is a nested link: the card itself is not
 * clickable, the buttons are.
 */
export function FeaturedProject({ study, index, reverse = false }: { study: CaseStudy; index: number; reverse?: boolean }) {
  const [phone] = study.keyScreens.filter((k) => k.device === "mobile");
  const headingId = `featured-${study.slug}`;
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "tile tile-feature grid overflow-hidden lg:grid-cols-12 lg:items-stretch",
        reverse && "lg:[&>.media]:order-2",
      )}
    >
      {/* Media */}
      <div
        className={cn(
          "media relative flex items-end overflow-hidden border-b border-line bg-[radial-gradient(500px_300px_at_50%_100%,rgb(139_92_246/0.28),transparent_70%)] px-5 pt-8 sm:px-8 lg:col-span-7 lg:border-b-0 lg:pt-12",
          reverse ? "lg:border-l lg:border-line" : "lg:border-r lg:border-line",
        )}
      >
        <div aria-hidden="true" className="grid-motif absolute inset-0 opacity-50 [mask-image:linear-gradient(180deg,#000,transparent_85%)]" />
        <div className="relative w-full">
          <DeviceFrame image={study.cover} device="desktop" className="rounded-b-none border-b-0" />
          {phone && (
            <DeviceFrame
              image={phone.image}
              device="mobile"
              className="absolute -right-2 bottom-0 hidden w-[26%] max-w-[180px] rounded-b-none border-b-0 sm:block"
            />
          )}
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-5 p-5 sm:p-8 lg:col-span-5 lg:p-10">
        <Eyebrow tone="subtle">
          {String(index + 1).padStart(2, "0")} · {study.category}
        </Eyebrow>
        <div>
          <h3 id={headingId} className="display m-0 text-[26px] sm:text-[32px]">
            {study.name}
          </h3>
          {study.client !== study.name && <p className="m-0 mt-1 text-sm text-ink-subtle">for {study.client}</p>}
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-ink-muted sm:text-base">{study.headline}</p>

        <dl className="m-0 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="label text-ink-subtle">The problem</dt>
            <dd className="m-0 mt-1.5 text-sm leading-relaxed text-ink-soft">{study.problem.title}</dd>
          </div>
          <div>
            <dt className="label text-fuchsia">What we built</dt>
            <dd className="m-0 mt-1.5 text-sm leading-relaxed text-ink-soft">{study.built.title}</dd>
          </div>
        </dl>

        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2" aria-label="Key capabilities">
          {study.highlights.map((h) => (
            <li key={h.title} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[2px] bg-focus shadow-[0_0_8px_var(--color-focus)]" />
              {h.title}
            </li>
          ))}
        </ul>

        <p className="m-0 border-l-2 border-focus/60 pl-3.5 text-sm italic leading-relaxed text-ink-muted">{study.benefit}</p>

        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
          <LinkButton to={workPath(study.slug)}>
            View case study <ArrowIcon />
          </LinkButton>
          <LinkButton to={buildStartSimilarLink(study.slug, study.name)} variant="secondary">
            Start a similar project
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
