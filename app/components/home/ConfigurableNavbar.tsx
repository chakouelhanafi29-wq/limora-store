"use client";

import { useState } from "react";
import type { HomeNavbar } from "@/lib/home-builder/types";

export default function ConfigurableNavbar({ navbar }: { navbar: HomeNavbar }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-champagne/10 bg-ivory/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="group flex items-center gap-2">
          <span className="font-serif text-3xl font-semibold tracking-[0.15em] text-foreground transition-colors group-hover:text-champagne">
            {navbar.brandName}
          </span>
        </a>

        <ul className="hidden items-center gap-10 lg:flex">
          {navbar.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-champagne"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={navbar.ctaHref}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-ivory transition-all hover:bg-champagne sm:px-6 sm:py-2.5 sm:text-sm"
          >
            {navbar.ctaLabel}
          </a>

          <button
            type="button"
            aria-label="القائمة"
            aria-expanded={open}
            className="luxury-focus-ring rounded-full p-2.5 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-champagne/10 bg-ivory px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {navbar.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="luxury-focus-ring block rounded-lg py-2 text-base font-medium text-foreground/80 transition-colors hover:text-champagne"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={navbar.ctaHref}
                className="mt-2 block rounded-full bg-foreground py-3 text-center text-sm font-medium text-ivory"
                onClick={() => setOpen(false)}
              >
                {navbar.ctaLabel}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
