"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { LahoreClock } from "../LahoreClock";
import { Magnetic } from "../Magnetic";
import { FadeUp, SplitReveal } from "../Reveal";
import { Ribbon, type RibbonPath } from "../Ribbon";
import { SocialIcons } from "../SocialIcons";

const CONTACT_RIBBONS: RibbonPath[] = [
  { kind: "thin", d: "M1460 90 C 1240 40, 1080 200, 940 160 S 760 30, 820 100 S 1060 220, 1180 160 S 1400 60, 1480 120" },
  { kind: "thin", delay: 0.1, d: "M-40 720 C 200 660, 320 780, 520 720 S 760 560, 700 640 S 600 780, 860 830" },
];

const TYPES = ["Website", "Web app", "Landing page", "Dashboard", "Redesign"];

type Status = { kind: "idle" | "sending" | "ok" | "error"; msg?: string; mailto?: string };

export function Contact() {
  const [type, setType] = useState("Website");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      setStatus({ kind: "error", msg: "Add your name, a valid email and a short message (10+ characters)." });
      return;
    }
    setStatus({ kind: "sending" });
    const subject = `Portfolio enquiry: ${type} from ${name}`;
    // Sends through EmailJS (the service the old portfolio used). If that fails, offer a prefilled
    // email instead, so a visitor's message is never lost.
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        site.emailjs.serviceId,
        site.emailjs.templateId,
        { from_name: name, from_email: email, requirement: type, country: "", message, to_name: "Zain Ali" },
        { publicKey: site.emailjs.publicKey },
      );
    } catch {
      const body = `${message}\n\n${name} · ${email}`;
      setStatus({
        kind: "error",
        msg: "The form couldn't send right now.",
        mailto: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      });
      return;
    }
    setStatus({ kind: "ok", msg: "Sent. I'll reply to you soon." });
    form.reset();
  };

  return (
    <section id="contact" data-theme="dark" className="section-dark relative overflow-hidden !bg-[#060607] py-[clamp(90px,12vw,170px)]" aria-labelledby="contact-title">
      {/* dot grid + a faint ribbon behind the form */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{ backgroundImage: "radial-gradient(rgb(243 242 239 / .5) 1px, transparent 1px)", backgroundSize: "26px 26px", maskImage: "radial-gradient(80% 70% at 70% 40%, #000, transparent 75%)" }}
      />
      <Ribbon
        paths={CONTACT_RIBBONS}
        viewBox="0 0 1400 800"
        className="absolute inset-0 h-full w-full text-signal/45"
        start="top 75%"
        end="bottom 60%"
      />
      <div className="wrap relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> Contact</span>
          <SplitReveal as="h2" type="chars" className="display mt-4 text-[clamp(60px,9vw,150px)]">
            <span id="contact-title">Need a website? Let&rsquo;s talk.</span>
          </SplitReveal>

          <FadeUp as="div" className="mt-10" delay={0.2}>
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`} className="text-[clamp(18px,2vw,26px)] text-lime underline decoration-lime/40 underline-offset-[6px] hover:decoration-lime">
                {site.email}
              </a>
              <button onClick={copy} className="pill pill-dark hover:bg-signal" data-cursor="copy">
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <div className="card-dark mt-8 flex max-w-[480px] items-end gap-5 p-4 pt-0">
              <div className="relative -mt-6 h-[132px] w-[104px] shrink-0 overflow-hidden rounded-b-[10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/zain-cut.webp" alt="" className="h-full w-full object-contain object-bottom" loading="lazy" />
              </div>
              <div className="min-w-0 pb-1">
                <p className="condensed text-[19px] font-[800] leading-none">Zain Ali</p>
                <p className="mt-1 text-[13px] text-paper/60">Full Stack Developer · UI/UX Designer</p>
                <p className="mono mt-2 text-paper/45">Lahore · <LahoreClock /></p>
                <SocialIcons tone="dark" size={34} className="mt-3" />
              </div>
            </div>
          </FadeUp>
        </div>

        <FadeUp as="div" className="lg:col-span-6 lg:pt-10" delay={0.15}>
          <form onSubmit={submit} noValidate className="grid gap-4">
            <fieldset>
              <legend className="mono mb-3 text-paper/50">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={`pill transition-colors ${type === t ? "!bg-paper text-ink" : "pill-dark hover:bg-white/10"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            {[
              { name: "name", label: "Name", type: "text", auto: "name" },
              { name: "email", label: "Email", type: "email", auto: "email" },
            ].map((f) => (
              <label key={f.name} className="group relative block">
                <span className="mono absolute left-4 top-3 text-paper/45 transition-colors group-focus-within:text-signal">{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  autoComplete={f.auto}
                  required
                  className="h-[68px] w-full rounded-[10px] bg-white/[0.04] px-4 pb-2 pt-7 text-[16px] text-paper outline-none ring-1 ring-paper/10 transition focus:bg-white/[0.06] focus:ring-signal"
                />
              </label>
            ))}
            <label className="group relative block">
              <span className="mono absolute left-4 top-3 text-paper/45 transition-colors group-focus-within:text-signal">Message</span>
              <textarea
                name="message"
                rows={5}
                required
                className="w-full resize-none rounded-[10px] bg-white/[0.04] px-4 pb-3 pt-8 text-[16px] text-paper outline-none ring-1 ring-paper/10 transition focus:bg-white/[0.06] focus:ring-signal"
              />
            </label>
            <Magnetic className="w-full" strength={0.12}>
              <button type="submit" disabled={status.kind === "sending"} className="btn btn-lime h-14 w-full text-[13px] disabled:opacity-60">
                <span data-magnetic-inner className="btn-label">{status.kind === "sending" ? "Sending…" : "Send message"}</span>
              </button>
            </Magnetic>
            <p role="status" aria-live="polite" className={`min-h-5 text-[14px] ${status.kind === "error" ? "text-signal" : "text-paper/70"}`}>
              {status.msg}
              {status.mailto && (
                <>
                  {" "}
                  <a href={status.mailto} className="text-lime underline underline-offset-4">
                    Send it by email instead ↗
                  </a>
                </>
              )}
            </p>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
