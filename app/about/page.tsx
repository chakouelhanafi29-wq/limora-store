import type { Metadata } from "next";
import Link from "next/link";
import { about } from "../lib/data";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: "من نحن",
    description: about.paragraphs[0],
    path: "/about",
  });
}

export default function AboutPage() {
  return (
    <>
      <header className="border-b border-champagne/10 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-[0.15em] text-foreground"
          >
            LIMORA
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-champagne">
            ← الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
          {about.label}
        </span>
        <h1 className="mb-4 font-serif text-4xl font-semibold text-foreground">
          {about.title}
        </h1>
        <p className="mb-10 text-lg text-champagne">{about.subtitle}</p>
        <div className="space-y-6 leading-relaxed text-muted">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </main>
    </>
  );
}
