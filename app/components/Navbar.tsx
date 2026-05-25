"use client";

import { useState } from "react";
import { navLinks } from "../lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-champagne/10 bg-ivory/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="group flex items-center gap-2">
          <span className="font-serif text-3xl font-semibold tracking-[0.15em] text-foreground transition-colors group-hover:text-champagne">
            LIMORA
          </span>
        </a>

        <ul className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
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
          <button
            type="button"
            aria-label="السلة"
            className="relative rounded-full p-2.5 text-foreground/70 transition-all hover:bg-beige hover:text-champagne"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-white">
              0
            </span>
          </button>

          <a
            href="#products"
            className="hidden rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-ivory transition-all hover:bg-champagne hover:shadow-lg sm:inline-block"
          >
            تسوقي الآن
          </a>

          <button
            type="button"
            aria-label="القائمة"
            className="rounded-full p-2.5 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-champagne/10 bg-ivory px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 text-base font-medium text-foreground/80"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#products"
                className="mt-2 block rounded-full bg-foreground py-3 text-center text-sm font-medium text-ivory"
                onClick={() => setOpen(false)}
              >
                تسوقي الآن
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
