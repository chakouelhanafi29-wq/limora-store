"use client";

import Image from "next/image";
import {
  resolveTransformationCaption,
  resolveTransformationImage,
  resolveTransformationResult,
  resolveTransformationTitle,
} from "@/lib/page-builder/transformation-content";
import Link from "next/link";
import { useState } from "react";
import ReviewAvatar from "./ReviewAvatar";
import {
  comparison,
  guarantee,
  howToUse,
  problemSolution,
  productBenefits,
  productFaqs,
  productIngredients,
  productReviews,
  relatedProducts,
  transformation,
} from "../../lib/product-data";

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
        <p
          className={`mx-auto max-w-2xl ${dark ? "text-ivory/60" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ProblemSolutionSection() {
  const { problems, solution } = problemSolution;
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={problemSolution.label}
          title={problemSolution.title}
        />

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-champagne/10 bg-beige/40 p-5 sm:p-6"
            >
              <h3 className="mb-2 text-sm font-bold text-foreground sm:text-base">
                {p.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-to-l from-champagne/10 via-nude/20 to-beige p-8 sm:p-12">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            {solution.title}
          </h3>
          <p className="mb-6 max-w-3xl leading-relaxed text-muted">
            {solution.description}
          </p>
          <ul className="flex flex-wrap gap-4">
            {solution.highlights.map((h) => (
              <li
                key={h}
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-foreground"
              >
                <span className="text-champagne">✦</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="bg-beige/50 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={productBenefits.label}
          title={productBenefits.title}
          subtitle={productBenefits.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productBenefits.items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-7 luxury-shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl">
                {item.icon}
              </span>
              <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TransformationSection() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={transformation.label}
          title={transformation.title}
          subtitle={transformation.subtitle}
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {transformation.beforeAfter.map((item, index) => {
            const image = resolveTransformationImage(item);
            const title = resolveTransformationTitle(item);
            const caption = resolveTransformationCaption(item);
            const resultText = resolveTransformationResult(item);

            return (
              <div
                key={`${title || caption || index}`}
                className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/3]">
                  {image ? (
                    <Image
                      src={image}
                      alt={title || caption || "تحول قبل / بعد"}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : null}
                </div>
                {(title || caption || resultText) && (
                  <div className="p-5 text-center sm:p-6">
                    {title ? (
                      <h3 className="mb-2 font-serif text-lg font-semibold">{title}</h3>
                    ) : null}
                    {caption ? (
                      <p className="text-sm italic leading-relaxed text-foreground/85">
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

export function ComparisonSection() {
  return (
    <section className="bg-beige/50 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader
          label={comparison.label}
          title={comparison.title}
          subtitle={comparison.subtitle}
        />
        <div className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg">
          <div className="grid grid-cols-3 border-b border-champagne/10 bg-beige/50 p-4 text-center text-sm font-bold">
            <div className="text-muted">الميزة</div>
            <div className="text-champagne">LIMORA</div>
            <div className="leading-snug text-muted">المنتجات العادية الأخرى</div>
          </div>
          {comparison.rows.map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-3 border-b border-champagne/5 p-4 text-center text-sm last:border-0"
            >
              <div className="text-right font-medium text-foreground">
                {row.feature}
              </div>
              <div className="text-champagne">{row.limora ? "✓" : "—"}</div>
              <div className="text-muted/50">{row.others ? "✓" : "✗"}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={productReviews.label}
          title={productReviews.title}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {productReviews.items.map((review) => (
            <article
              key={review.name}
              className="rounded-3xl bg-white p-7 luxury-shadow"
            >
              <div className="mb-4 flex gap-0.5 text-champagne">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mb-6 text-sm leading-relaxed text-foreground/80">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 border-t border-champagne/10 pt-3">
                <ReviewAvatar name={review.name} image={review.image} size="sm" />
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
  );
}

export function HowToUseSection() {
  return (
    <section className="bg-beige/50 py-10 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader
          label={howToUse.label}
          title={howToUse.title}
          subtitle={howToUse.subtitle}
        />
        <div className="grid gap-8 md:grid-cols-3">
          {howToUse.steps.map((step) => (
            <div key={step.step} className="text-center">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne/15 font-serif text-xl font-semibold text-champagne">
                {step.step}
              </span>
              <h3 className="mb-2 font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IngredientsSection() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={productIngredients.label}
          title={productIngredients.title}
          subtitle={productIngredients.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productIngredients.items.map((item) => (
            <div
              key={item.name}
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
                  {"icon" in item && item.icon ? (item.icon as string) : "✦"}
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

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-beige/50 py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader label={productFaqs.label} title={productFaqs.title} />
        <div className="space-y-3">
          {productFaqs.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-champagne/10 bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-right"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-foreground">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-beige text-champagne transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GuaranteeSection() {
  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={guarantee.label}
          title={guarantee.title}
          subtitle={guarantee.subtitle}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantee.points.map((point) => (
            <div
              key={point.title}
              className="rounded-3xl border border-champagne/15 bg-white p-6 text-center luxury-shadow"
            >
              <span className="mb-3 block text-2xl text-champagne">
                {point.icon}
              </span>
              <h3 className="mb-2 text-sm font-bold text-foreground">
                {point.title}
              </h3>
              <p className="text-xs text-muted">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedProductsSection() {
  return (
    <section className="border-t border-champagne/10 bg-beige/30 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="YOU MAY ALSO LOVE"
          title="منتجات قد تعجبكِ"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group overflow-hidden rounded-3xl bg-white luxury-shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-champagne uppercase">{item.nameEn}</p>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{item.benefit}</p>
                <p className="mt-3 font-serif text-lg font-semibold text-foreground">
                  {item.price} <span className="text-sm text-muted">ر.س</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
