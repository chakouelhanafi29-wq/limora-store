import Image from "next/image";
import { hero } from "../lib/data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden luxury-gradient">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-champagne/10 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-nude/40 blur-3xl animate-pulse-soft" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <div className="animate-fade-up text-center lg:text-right">
          <span className="section-label mb-6 inline-block rounded-full border border-champagne/30 bg-white/50 px-5 py-2 text-xs font-medium tracking-[0.25em] text-champagne">
            {hero.label}
          </span>

          <h1 className="mb-6 font-serif text-4xl leading-[1.15] font-semibold text-foreground sm:text-5xl lg:text-6xl">
            {hero.headline}
            <br />
            <span className="bg-gradient-to-l from-champagne via-rose-gold to-champagne bg-clip-text text-transparent">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="mx-auto mb-4 max-w-lg text-lg leading-relaxed text-muted lg:mx-0">
            {hero.subheadline}
          </p>

          <p className="mb-8 text-sm text-champagne">{hero.trustLine}</p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/product"
              className="group relative overflow-hidden rounded-full bg-foreground px-10 py-4 text-base font-medium text-ivory transition-all hover:shadow-xl hover:shadow-champagne/20"
            >
              <span className="relative z-10">{hero.ctaPrimary}</span>
              <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-20" />
            </a>
            <a
              href="#results"
              className="rounded-full border border-champagne/40 bg-white/60 px-10 py-4 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:border-champagne hover:bg-white"
            >
              {hero.ctaSecondary}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
            {hero.stats.map((stat, index) => (
              <div key={stat.label} className="contents">
                {index > 0 && (
                  <div className="hidden h-10 w-px bg-champagne/20 sm:block" />
                )}
                <div className="text-center">
                  <p className="font-serif text-3xl font-semibold text-champagne">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up delay-200 relative">
          <div className="relative mx-auto aspect-[4/5] max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-champagne/20 via-nude/30 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] luxury-shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80"
                alt="امرأة ببشرة متوهجة — LIMORA"
                width={900}
                height={1125}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-4 glass-card animate-float rounded-2xl p-5 luxury-shadow lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/20">
                  <span className="text-xl">✨</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {hero.floatCard1.title}
                  </p>
                  <p className="text-xs text-muted">
                    {hero.floatCard1.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 glass-card animate-float rounded-2xl p-4 luxury-shadow lg:-left-8">
              <p className="text-xs font-medium text-champagne">
                {hero.floatCard2.label}
              </p>
              <p className="font-serif text-lg font-semibold text-foreground">
                {hero.floatCard2.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
