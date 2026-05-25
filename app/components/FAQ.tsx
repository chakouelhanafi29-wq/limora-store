"use client";

import { useState } from "react";
import { faqs } from "../lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-beige/50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            {faqs.label}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {faqs.title}
          </h2>
          <p className="text-muted">{faqs.subtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.items.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-champagne/10 bg-white transition-all duration-300 hover:border-champagne/25"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-right"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-foreground">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-beige text-champagne transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted">
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
