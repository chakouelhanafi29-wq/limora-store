"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageSection, ProductPageConfig, ProductPageTheme } from "@/lib/page-builder/types";
import { getOrderedSections } from "@/lib/page-builder/default-config";
import SectionCTA from "./SectionCTA";

function spacingClass(theme: ProductPageTheme) {
  if (theme.sectionSpacing === "compact") return "py-12 sm:py-16";
  if (theme.sectionSpacing === "spacious") return "py-24 sm:py-32";
  return "py-20 sm:py-28";
}

function SectionHeader({
  label,
  title,
  subtitle,
  dark = false,
}: {
  label: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-12 text-center">
      <span
        className={`section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] ${dark ? "text-champagne-light" : "text-champagne"}`}
      >
        {label}
      </span>
      <h2
        className={`mb-3 font-serif text-3xl font-semibold sm:text-4xl ${dark ? "text-ivory" : "text-foreground"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mx-auto max-w-2xl ${dark ? "text-ivory/60" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="mb-3 flex gap-0.5 text-champagne">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < full ? "fill-current" : "fill-champagne/20"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function renderSection(
  section: PageSection,
  theme: ProductPageTheme,
  cta?: { onOrder: () => void; ctaLabel: string; price: number },
) {
  const pad = spacingClass(theme);
  const bg =
    theme.sectionBackground === "beige"
      ? "bg-beige/50"
      : theme.sectionBackground === "white"
        ? "bg-white"
        : "";

  const content = section.content as Record<string, unknown>;

  switch (section.type) {
    case "problem_solution": {
      const problems = (content.problems as { title: string; description: string }[]) ?? [];
      const solution = content.solution as {
        title: string;
        description: string;
        highlights: string[];
      };
      return (
        <section key={section.id} className={pad}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
            />
            <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {problems.map((p) => (
                <div key={p.title} className="rounded-2xl border border-champagne/10 bg-beige/40 p-5 sm:p-6">
                  <h3 className="mb-2 text-sm font-bold sm:text-base">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-muted sm:text-sm">{p.description}</p>
                </div>
              ))}
            </div>
            {solution && (
              <div className="rounded-3xl bg-gradient-to-l from-champagne/10 via-nude/20 to-beige p-8 sm:p-12">
                <h3 className="mb-4 font-serif text-2xl font-semibold sm:text-3xl">{solution.title}</h3>
                <p className="mb-6 max-w-3xl leading-relaxed text-muted">{solution.description}</p>
                <ul className="flex flex-wrap gap-4">
                  {solution.highlights?.map((h) => (
                    <li key={h} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium">
                      <span className="text-champagne">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      );
    }
    case "benefits": {
      const items = (content.items as { icon: string; title: string; description: string }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} ${bg || "bg-beige/50"}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.title} className="rounded-3xl bg-white p-7 luxury-shadow transition hover:-translate-y-1">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl">{item.icon}</span>
                  <h3 className="mb-2 font-bold">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "transformation": {
      const items = (content.beforeAfter as { before: string; after: string; quote: string; days: string }[]) ?? [];
      return (
        <section key={section.id} className={pad}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
            <div className="grid gap-10 lg:grid-cols-2">
              {items.map((item) => (
                <div key={item.quote} className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg">
                  <div className="grid grid-cols-2">
                    <div className="relative aspect-[3/4]">
                      <span className="absolute right-2 top-2 z-10 rounded-full bg-foreground/70 px-2 py-0.5 text-[10px] font-bold text-ivory">
                        قبل
                      </span>
                      <Image src={item.before} alt="قبل" fill className="object-cover grayscale-[25%]" sizes="50vw" />
                    </div>
                    <div className="relative aspect-[3/4]">
                      <span className="absolute right-2 top-2 z-10 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-bold text-white">
                        بعد
                      </span>
                      <Image src={item.after} alt="بعد" fill className="object-cover" sizes="50vw" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <p className="mb-1 text-sm font-bold text-champagne">{item.days}</p>
                    <p className="text-sm italic text-foreground/80">&ldquo;{item.quote}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "comparison": {
      const rows = (content.rows as { feature: string; limora: boolean; others: boolean }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} bg-beige/50`}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
            <div className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg">
              <div className="grid grid-cols-3 border-b border-champagne/10 bg-beige/50 p-4 text-center text-sm font-bold">
                <div className="text-muted">الميزة</div>
                <div className="text-champagne">LIMORA</div>
                <div className="text-muted">أخرى</div>
              </div>
              {rows.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 border-b border-champagne/5 p-4 text-center text-sm last:border-0">
                  <div className="text-right font-medium">{row.feature}</div>
                  <div className="text-champagne">{row.limora ? "✓" : "—"}</div>
                  <div className="text-muted/50">{row.others ? "✓" : "✗"}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "reviews": {
      const items = (content.items as { name: string; location: string; rating: number; text: string; image: string }[]) ?? [];
      return (
        <div key={section.id}>
          <section id="reviews" className={pad}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} />
              <div className="grid gap-6 sm:grid-cols-2">
                {items.map((review) => (
                  <article key={`${review.name}-${review.text.slice(0, 20)}`} className="rounded-3xl bg-white p-7 luxury-shadow">
                    <ReviewStars rating={review.rating} />
                    <blockquote className="mb-6 text-sm leading-relaxed text-foreground/80">&ldquo;{review.text}&rdquo;</blockquote>
                    <div className="flex items-center gap-3 border-t border-champagne/10 pt-4">
                      <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-champagne/20">
                        <Image src={review.image} alt={review.name} fill className="object-cover" sizes="44px" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{review.name}</p>
                        <p className="text-xs text-muted">{review.location}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {cta && (
            <SectionCTA
              onOrder={cta.onOrder}
              ctaLabel={cta.ctaLabel}
              price={cta.price}
              subtitle="انضمي لآلاف العميلات السعوديات — اطلبي الآن بالدفع عند الاستلام"
            />
          )}
        </div>
      );
    }
    case "how_to_use": {
      const steps = (content.steps as { step: string; title: string; description: string }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} bg-beige/50`}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15 font-serif text-xl font-semibold text-champagne">{step.step}</span>
                  <h3 className="mb-2 font-bold">{step.title}</h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "ingredients": {
      const items = (content.items as { name: string; benefit: string; image: string }[]) ?? [];
      return (
        <section key={section.id} className={pad}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <div key={item.name} className="overflow-hidden rounded-3xl bg-white luxury-shadow">
                  <div className="relative aspect-square">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="25vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 font-bold">{item.name}</h3>
                    <p className="text-xs text-muted">{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "faq": {
      const items = (content.items as { question: string; answer: string }[]) ?? [];
      return <FAQBlock key={section.id} pad={pad} label={String(content.label ?? "")} title={String(content.title ?? "")} items={items} />;
    }
    case "guarantee": {
      const points = (content.points as { icon: string; title: string; description: string }[]) ?? [];
      return (
        <div key={section.id}>
          <section className={pad}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {points.map((point) => (
                  <div key={point.title} className="rounded-3xl border border-champagne/15 bg-white p-6 text-center luxury-shadow">
                    <span className="mb-3 block text-2xl text-champagne">{point.icon}</span>
                    <h3 className="mb-2 text-sm font-bold">{point.title}</h3>
                    <p className="text-xs text-muted">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {cta && (
            <SectionCTA
              onOrder={cta.onOrder}
              ctaLabel={cta.ctaLabel}
              price={cta.price}
              subtitle="ضمان LIMORA — اطلبي بثقة والدفع عند الاستلام"
            />
          )}
        </div>
      );
    }
    case "related_products": {
      const items = (content.items as { id: string; name: string; nameEn: string; benefit: string; price: string; image: string; href: string }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} border-t border-champagne/10 bg-beige/30`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label={String(content.label ?? "YOU MAY ALSO LOVE")} title={String(content.title ?? "منتجات قد تعجبكِ")} />
            <div className="grid gap-6 md:grid-cols-3">
              {items.map((item) => (
                <Link key={item.id} href={item.href} className="group overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="33vw" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase text-champagne">{item.nameEn}</p>
                    <h3 className="font-serif text-xl font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">{item.benefit}</p>
                    <p className="mt-3 font-serif text-lg font-semibold">{item.price} <span className="text-sm text-muted">ر.س</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    }
    default:
      return null;
  }
}

function FAQBlock({
  pad,
  label,
  title,
  items,
}: {
  pad: string;
  label: string;
  title: string;
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className={`${pad} bg-beige/50`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader label={label} title={title} />
        <div className="space-y-3">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-champagne/10 bg-white">
                <button type="button" className="flex w-full items-center justify-between gap-4 p-5 text-right" onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <span className="text-sm font-bold">{faq.question}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-beige text-champagne transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ConfigurableProductSections({
  config,
  onOrder,
  ctaLabel = "أطلب الآن الدفع عند الاستلام",
  selectedPrice = 0,
}: {
  config: ProductPageConfig;
  preview?: boolean;
  onOrder?: () => void;
  ctaLabel?: string;
  selectedPrice?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const sections = getOrderedSections(config, isMobile);
  const cta =
    onOrder && selectedPrice > 0
      ? { onOrder, ctaLabel, price: selectedPrice }
      : undefined;

  return (
    <div
      className="product-builder-page"
      style={{
        ["--builder-accent" as string]: config.theme.accentColor,
        ...(config.mobile.spacingScale !== 1
          ? { fontSize: `${config.mobile.spacingScale * 100}%` }
          : {}),
      }}
    >
      {sections.map((section) => renderSection(section, config.theme, cta))}
    </div>
  );
}

export function builderOffersToOffers(
  offers: ProductPageConfig["offers"],
) {
  return offers.map((offer) => ({
    id: offer.id,
    quantity: offer.quantity,
    label: offer.label,
    price: offer.price,
    unitPrice: offer.price / offer.quantity,
    badge: offer.badge,
    recommended: offer.recommended,
  }));
}

export function heroToStorefrontProduct(
  hero: ProductPageConfig["hero"],
  slug: string,
  orderName: string,
  galleryImages?: string[],
) {
  return {
    id: slug,
    slug,
    name: hero.nameAr,
    nameEn: hero.nameEn,
    subtitle: hero.subtitle,
    emotionalHook: hero.emotionalHook,
    rating: hero.rating,
    reviewCount: hero.reviewCount,
    bullets: hero.bullets,
    urgency: hero.urgency,
    images: galleryImages?.length ? galleryImages : hero.images,
    orderName,
  };
}
