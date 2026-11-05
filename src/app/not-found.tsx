import Link from "next/link";

export default function NotFound() {
  return (
    <section data-theme="dark" className="section-dark grid min-h-[100svh] place-items-center px-[var(--gutter)] text-center">
      <div>
        <p className="mono text-paper/50">Error 404</p>
        <h1 className="display mt-4 text-[clamp(120px,28vw,420px)] leading-[0.8]">
          4<span className="text-signal">0</span>4
        </h1>
        <p className="mt-6 text-paper/70">This page isn&rsquo;t built yet. The rest of the site is.</p>
        <Link href="/" className="btn btn-paper mt-8">
          <span className="btn-label">Back home</span>
        </Link>
      </div>
    </section>
  );
}
