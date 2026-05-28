"use client";

import { useState, type CSSProperties } from "react";

type FAQItem = { question: string; answer: string };

export default function HomeFAQSection({
  label,
  title,
  subtitle,
  items,
  className = "bg-beige/50 py-20 sm:py-28",
  style,
}: {
  label: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
  className?: string;
  style?: CSSProperties;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={className} style={style}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            {label}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="text-muted">{subtitle}</p>
        </div>
        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-champagne/10 bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-right"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-base font-bold text-foreground">{faq.question}</span>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige text-lg text-champagne transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
