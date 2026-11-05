import type { Metadata } from "next";
import Link from "next/link";
import { indexed as projects } from "@/content/projects";
import { Footer } from "@/components/Footer";
import { ProjectCover } from "@/components/ProjectCover";
import { SplitReveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Work",
  description: "Every project by Zain Ali: pitch concepts, client platforms, a final year project and team builds.",
};

export default function WorkPage() {
  return (
    <>
      <section data-theme="dark" className="section-dark pb-16 pt-32">
        <div className="wrap">
          <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> {projects.length} projects</span>
          <SplitReveal as="h1" type="chars" className="display mt-4 text-[clamp(80px,17vw,300px)]" start="top 100%">
            All work
          </SplitReveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="card-dark group block p-3" data-cursor="view">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-ink-3">
                  <ProjectCover p={p} sizes="(max-width:640px) 92vw, 33vw" className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                </div>
                <div className="flex items-end justify-between gap-3 px-1.5 pb-1 pt-4">
                  <div className="min-w-0">
                    <p className="mono text-paper/45">{p.category} · {p.year}</p>
                    <h2 className="condensed mt-1 truncate text-[26px] font-[800] leading-none">{p.title}</h2>
                  </div>
                  <span className="arrow-btn">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
