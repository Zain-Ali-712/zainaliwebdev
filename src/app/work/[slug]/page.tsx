import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject, projects } from "@/content/projects";
import { Footer } from "@/components/Footer";
import { CaseHero, Gallery, NextProject } from "@/components/case/CaseParts";
import { FadeUp, SplitReveal } from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: `${p.title} · Zain Ali`, description: p.summary, images: p.media.poster ? [{ url: p.media.poster }] : undefined },
  };
}

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<section data-theme="dark" className="section-dark min-h-[100svh]" />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}

async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];

  const meta = [
    { k: "Role", v: p.role },
    { k: "Year", v: p.year },
    { k: "Type", v: p.category },
    ...(p.team ? [{ k: "Team", v: p.team }] : []),
    ...(p.place ? [{ k: "Where", v: p.place }] : []),
  ];

  return (
    <>
      <CaseHero p={p} />

      <section data-theme="light" className="bg-paper py-[clamp(70px,9vw,130px)]">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
              {meta.map((m) => (
                <div key={m.k} className="border-t border-ink/10 pt-3">
                  <dt className="mono text-muted">{m.k}</dt>
                  <dd className="mt-1 text-[16px] font-medium">{m.v}</dd>
                </div>
              ))}
              <div className="col-span-2 border-t border-ink/10 pt-3 lg:col-span-1">
                <dt className="mono text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="pill">{s}</span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-ink">
                  <span className="btn-label">Visit live site ↗</span>
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <span className="btn-label">Code ↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {p.problem && (
              <>
                <span className="mono inline-flex items-center gap-2 text-muted"><span className="dot" /> The problem</span>
                <SplitReveal as="p" className="condensed mt-4 text-[clamp(26px,3vw,44px)] font-[800] leading-[1.04]">
                  {p.problem}
                </SplitReveal>
              </>
            )}
            <div className={p.problem ? "mt-14" : ""}>
              <span className="mono inline-flex items-center gap-2 text-muted"><span className="dot" /> What I built</span>
              <FadeUp as="div" stagger={0.07} className="mt-5 grid gap-0 border-t border-ink/10">
                {p.built.map((b, k) => (
                  <div key={k} className="grid grid-cols-[44px_1fr] gap-3 border-b border-ink/10 py-4">
                    <span className="mono tabular text-muted">{String(k + 1).padStart(2, "0")}</span>
                    <span className="text-[17px] leading-relaxed">{b}</span>
                  </div>
                ))}
              </FadeUp>
            </div>
            {p.disclaimer && (
              <p className="mono mt-10 rounded-[10px] bg-paper-2 p-4 text-[11px] normal-case leading-relaxed tracking-normal text-ink/70">{p.disclaimer}</p>
            )}
          </div>
        </div>
      </section>

      {p.media.screens.length > 0 && <Gallery p={p} />}

      {p.media.mobile && p.media.mobile.length > 0 && (
        <section data-theme="light" className="bg-paper-2 py-[clamp(70px,9vw,130px)]">
          <div className="wrap">
            <span className="mono inline-flex items-center gap-2 text-muted"><span className="dot" /> On a phone</span>
            <FadeUp as="div" stagger={0.1} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8">
              {p.media.mobile.map((src, k) => (
                <div key={src} className={`relative aspect-[390/844] overflow-hidden rounded-[22px] bg-ink shadow-[0_30px_60px_-30px_rgb(11_12_14/0.6)] ring-[6px] ring-ink ${k === 1 ? "sm:translate-y-12" : ""} ${k === 2 ? "hidden sm:block" : ""}`}>
                  <Image src={src} alt={`${p.title} on mobile, screen ${k + 1}`} fill sizes="(max-width:640px) 46vw, 30vw" className="object-cover object-top" />
                </div>
              ))}
            </FadeUp>
          </div>
        </section>
      )}

      <NextProject p={next} />
      <div className="bg-paper py-6 text-center">
        <Link href="/work" className="mono text-muted underline underline-offset-4 hover:text-signal">All work</Link>
      </div>
      <Footer />
    </>
  );
}
