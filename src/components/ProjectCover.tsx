import Image from "next/image";
import type { Project } from "@/content/projects";
import { Monogram } from "./Monogram";

/** Image, loop or (when no visuals can be shown) a typographic cover in the project's accent. */
export function ProjectCover({ p, sizes = "50vw", video = false, className = "" }: { p: Project; sizes?: string; video?: boolean; className?: string }) {
  if (video && p.media.loopSm) {
    return (
      <video
        src={p.media.loopSm}
        poster={p.media.poster}
        muted
        loop
        playsInline
        preload="none"
        className={`h-full w-full object-cover ${className}`}
        data-hover-video
      />
    );
  }
  if (p.media.poster) {
    return <Image src={p.media.poster} alt={`${p.title} screenshot`} fill sizes={sizes} className={`object-cover object-top ${className}`} />;
  }
  return (
    <div className={`absolute inset-0 flex flex-col justify-between overflow-hidden bg-ink-2 p-5 text-paper ${className}`}>
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(90% 80% at 85% 110%, ${p.accent}, transparent 60%)` }}
        aria-hidden
      />
      <div className="absolute inset-0 grid-lines opacity-[0.35] [--line:rgb(255_255_255/0.08)]" aria-hidden />
      <div className="relative flex items-center justify-between">
        <span className="mono text-paper/60">{p.client}</span>
        <Monogram size={20} />
      </div>
      <div className="relative">
        <p className="mono mb-2 text-paper/50">Private build · screens on request</p>
        <p className="display text-[clamp(34px,4.4vw,64px)] leading-[0.86]">{p.title}</p>
      </div>
    </div>
  );
}
