import type { ReactNode } from "react";
import { Container, Eyebrow } from "../ui/Section";
import { GridBackdrop } from "../ui/GridBackdrop";
import { cn } from "../ui/cn";

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Breadcrumb or other content above the title */
  above?: ReactNode;
  /** Content below the lead (anchors, meta tiles) */
  children?: ReactNode;
  id?: string;
  className?: string;
  titleClassName?: string;
};

/** Inner-page header: sits under the fixed site header, grid patch top right */
export function PageHeader({ eyebrow, title, lead, above, children, id = "page-title", className, titleClassName }: PageHeaderProps) {
  return (
    <section aria-labelledby={id} className={cn("relative isolate overflow-hidden pt-[104px] pb-10 lg:pt-[148px] lg:pb-14", className)}>
      <GridBackdrop mask="corner" glow="corner" />
      <Container>
        <div className="flex max-w-[900px] flex-col gap-4 lg:gap-[18px]">
          {above}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 id={id} className={cn("display m-0 text-[34px] leading-[1.06] sm:text-5xl lg:text-[58px] lg:leading-[1.04]", titleClassName)}>
            {title}
          </h1>
          {lead && <p className="m-0 max-w-[720px] text-[17px] leading-relaxed text-ink-muted lg:text-[19px]">{lead}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}
