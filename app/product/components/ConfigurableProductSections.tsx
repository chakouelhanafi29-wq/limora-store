"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getSectionGridGapClass,
  getSectionHeaderMarginClass,
  getSectionLabelMarginClass,
  getSectionPaddingClass,
} from "@/lib/page-builder/section-spacing";
import {
  resolveTransformationCaption,
  resolveTransformationImage,
  resolveTransformationResult,
  resolveTransformationTitle,
  type TransformationCardContent,
} from "@/lib/page-builder/transformation-content";
import type { PageSection, ProductPageConfig, ProductPageTheme } from "@/lib/page-builder/types";
import { getOrderedSections } from "@/lib/page-builder/default-config";
import ReviewAvatar from "./ReviewAvatar";
import SectionCTA from "./SectionCTA";

function spacingClass(theme: ProductPageTheme) {
  return getSectionPaddingClass(theme);
}

const gridGap = getSectionGridGapClass();
const headerMargin = getSectionHeaderMarginClass();
const labelMargin = getSectionLabelMarginClass();

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
    <div className={`${headerMargin} text-center`}>
      <span
        className={`section-label ${labelMargin} inline-block text-xs font-medium tracking-[0.25em] ${dark ? "text-champagne-light" : "text-champagne"}`}
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

export function renderProductSection(
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
      const problems =
        (content.problems as {
          title: string;
          description: string;
          icon?: string;
          image?: string;
        }[]) ?? [];
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
            <div className={`mb-8 grid ${gridGap} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
              {problems.map((p, index) => (
                <div
                  key={`${p.title}-${index}`}
                  className="group overflow-hidden rounded-3xl border border-champagne/10 bg-white luxury-shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {p.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                      <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                        {p.icon ? (
                          <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg backdrop-blur-sm">
                            {p.icon}
                          </span>
                        ) : null}
                        <h3 className="text-sm font-bold sm:text-base">{p.title}</h3>
                        {p.description ? (
                          <p className="mt-1 text-xs leading-relaxed text-white/85 sm:text-sm">
                            {p.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-6">
                      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl">
                        {p.icon || "✦"}
                      </span>
                      <h3 className="mb-2 text-sm font-bold sm:text-base">{p.title}</h3>
                      <p className="text-xs leading-relaxed text-muted sm:text-sm">
                        {p.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {solution && (
              <div className="rounded-3xl bg-gradient-to-l from-champagne/10 via-nude/20 to-beige p-6 sm:p-8">
                <h3 className="mb-3 font-serif text-2xl font-semibold sm:text-3xl">{solution.title}</h3>
                <p className="mb-4 max-w-3xl leading-relaxed text-muted">{solution.description}</p>
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
      const items =
        (content.items as {
          icon: string;
          title: string;
          description: string;
          image?: string;
        }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} ${bg || "bg-beige/50"}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className={`grid ${gridGap} sm:grid-cols-2 lg:grid-cols-3`}>
              {items.map((item) => (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-1"
                >
                  {item.image ? (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-5 sm:p-6">
                    <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-champagne/15 text-xl">
                      {item.icon}
                    </span>
                    <h3 className="mb-2 font-bold">{item.title}</h3>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "transformation": {
      const items = (content.beforeAfter as TransformationCardContent[]) ?? [];
      return (
        <section key={section.id} className={`${pad} bg-gradient-to-b from-ivory to-beige/30`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className={`grid ${gridGap} lg:grid-cols-2`}>
              {items.map((item, index) => {
                const image = resolveTransformationImage(item);
                const title = resolveTransformationTitle(item);
                const caption = resolveTransformationCaption(item);
                const resultText = resolveTransformationResult(item);

                return (
                  <div
                    key={`${title || caption || image}-${index}`}
                    className="overflow-hidden rounded-[1.75rem] border border-champagne/10 bg-white luxury-shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-beige/30 sm:aspect-[5/3]">
                      {image ? (
                        <Image
                          src={image}
                          alt={title || caption || "تحول قبل / بعد"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-xs text-muted">
                          ارفعي صورة التحول الموحدة (قبل / بعد) من المحرر
                        </div>
                      )}
                    </div>
                    {(title || caption || resultText) && (
                      <div className="border-t border-champagne/10 bg-gradient-to-b from-white to-beige/20 p-5 text-center sm:p-6">
                        {title ? (
                          <h3 className="mb-2 font-serif text-lg font-semibold text-foreground sm:text-xl">
                            {title}
                          </h3>
                        ) : null}
                        {caption ? (
                          <p className="text-sm italic leading-relaxed text-foreground/85 sm:text-base">
                            &ldquo;{caption}&rdquo;
                          </p>
                        ) : null}
                        {resultText ? (
                          <p className="mt-2 text-xs font-medium text-champagne sm:text-sm">
                            {resultText}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    case "results_timeline": {
      const weeks =
        (content.weeks as {
          title: string;
          description: string;
          progress?: number;
          image?: string;
        }[]) ?? [];

      return (
        <section
          key={section.id}
          className={`${pad} bg-gradient-to-b from-rose-50/40 via-ivory to-beige/30`}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "متى تظهر النتائج؟")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className="relative space-y-6">
              <div className="absolute right-[1.125rem] top-2 bottom-2 w-px bg-gradient-to-b from-champagne/10 via-champagne/40 to-champagne/10 sm:right-8" />
              {weeks.map((week, index) => {
                const progress =
                  typeof week.progress === "number"
                    ? week.progress
                    : Math.min(100, (index + 1) * 25);

                return (
                  <div key={`${week.title}-${index}`} className="relative pr-12 sm:pr-16">
                    <div className="absolute right-3 top-8 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-champagne shadow-[0_0_16px_rgba(212,137,154,0.55)] sm:right-6 sm:h-6 sm:w-6">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <article className="overflow-hidden rounded-[1.75rem] border border-champagne/10 bg-white/90 luxury-shadow backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                        {week.image ? (
                          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[180px]">
                            <Image
                              src={week.image}
                              alt={week.title}
                              fill
                              className="object-cover"
                              sizes="220px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 to-transparent md:bg-gradient-to-l" />
                          </div>
                        ) : null}
                        <div className="p-5 sm:p-6">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                              {week.title}
                            </h3>
                            <span className="rounded-full bg-champagne/10 px-3 py-1 text-xs font-bold text-champagne">
                              {progress}%
                            </span>
                          </div>
                          <p className="mb-4 text-sm leading-relaxed text-muted sm:text-base">
                            {week.description}
                          </p>
                          <div className="h-2 overflow-hidden rounded-full bg-beige/80">
                            <div
                              className="h-full rounded-full bg-gradient-to-l from-champagne via-rose-gold to-champagne shadow-[0_0_14px_rgba(212,137,154,0.45)] transition-all duration-700"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
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
              <div className="grid grid-cols-3 border-b border-champagne/10 bg-beige/50 p-4 text-center text-xs font-bold sm:text-sm">
                <div className="text-muted">الميزة</div>
                <div className="text-champagne">LIMORA</div>
                <div className="leading-snug text-muted">المنتجات العادية الأخرى</div>
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
      const items =
        (content.items as {
          name: string;
          location: string;
          rating: number;
          text: string;
          image: string;
          transformationImage?: string;
        }[]) ?? [];
      const ctaSubtitle = String(content.ctaSubtitle ?? "");
      const ctaFootnote = String(content.ctaFootnote ?? "");
      return (
        <div key={section.id}>
          <section id="reviews" className={pad}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} />
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((review, index) => (
                  <article
                    key={`${review.name}-${index}`}
                    className="overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {review.transformationImage ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={review.transformationImage}
                          alt={`تحول ${review.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                      </div>
                    ) : null}
                    <div className="p-5 sm:p-6">
                      <ReviewStars rating={review.rating ?? 5} />
                      <blockquote className="mb-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                        &ldquo;{review.text}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-3 border-t border-champagne/10 pt-3">
                        <ReviewAvatar name={review.name} image={review.image} />
                        <div>
                          <p className="text-sm font-bold">{review.name}</p>
                          <p className="text-xs text-muted">{review.location}</p>
                        </div>
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
              subtitle={
                ctaSubtitle ||
                "انضمي لآلاف العميلات السعوديات — اطلبي الآن بالدفع عند الاستلام"
              }
              footnote={ctaFootnote}
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
            <div className={`grid ${gridGap} md:grid-cols-3`}>
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
      const items =
        (content.items as { name: string; benefit: string; image: string; icon?: string }[]) ??
        [];
      return (
        <section key={section.id} className={`${pad} ${bg || "bg-beige/50"}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className={`grid ${gridGap} sm:grid-cols-2 lg:grid-cols-3`}>
              {items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-1"
                >
                  {item.image ? (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-5 sm:p-6">
                    <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-champagne/15 text-xl">
                      {item.icon || "✦"}
                    </span>
                    <h3 className="mb-2 font-bold">{item.name}</h3>
                    <p className="text-sm text-muted">{item.benefit}</p>
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
      const ctaSubtitle = String(content.ctaSubtitle ?? "");
      const ctaFootnote = String(content.ctaFootnote ?? "");
      return (
        <div key={section.id}>
          <section className={pad}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
              <div className={`grid ${gridGap} sm:grid-cols-2 lg:grid-cols-4`}>
                {points.map((point) => (
                  <div key={point.title} className="rounded-3xl border border-champagne/15 bg-white p-5 text-center luxury-shadow sm:p-6">
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
              subtitle={ctaSubtitle || "ضمان LIMORA — اطلبي بثقة والدفع عند الاستلام"}
              footnote={ctaFootnote}
            />
          )}
        </div>
      );
    }
    case "lifestyle": {
      const imagePosition = content.imagePosition === "left" ? "left" : "right";
      return (
        <section key={section.id} className={`${pad} ${bg}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid items-center ${gridGap} lg:grid-cols-2 lg:gap-6 ${
                imagePosition === "left" ? "lg:[direction:ltr]" : ""
              }`}
            >
              {imagePosition === "left" && content.image ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl luxury-shadow-lg">
                  <Image
                    src={String(content.image)}
                    alt={String(content.title ?? "Lifestyle")}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              ) : null}
              <div className={imagePosition === "left" ? "lg:[direction:rtl]" : ""}>
                <SectionHeader
                  label={String(content.label ?? "")}
                  title={String(content.title ?? "")}
                  subtitle={String(content.subtitle ?? "")}
                />
                {content.body ? (
                  <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-foreground/80 lg:text-right">
                    {String(content.body)}
                  </p>
                ) : null}
              </div>
              {imagePosition === "right" && content.image ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl luxury-shadow-lg">
                  <Image
                    src={String(content.image)}
                    alt={String(content.title ?? "Lifestyle")}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      );
    }
    case "related_products": {
      const items = (content.items as { id: string; name: string; nameEn: string; benefit: string; price: string; image: string; href: string }[]) ?? [];
      return (
        <section key={section.id} className={`${pad} border-t border-champagne/10 bg-beige/30`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label={String(content.label ?? "YOU MAY ALSO LOVE")} title={String(content.title ?? "منتجات قد تعجبكِ")} />
            <div className={`grid ${gridGap} md:grid-cols-3`}>
              {items.map((item) => (
                <Link key={item.id} href={item.href} className="group overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-0.5">
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
      {sections.map((section) => renderProductSection(section, config.theme, cta))}
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
    images: hero.images ?? [],
    orderName,
  };
}
