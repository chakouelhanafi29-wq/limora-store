import { whyLimora } from "../lib/data";

export default function WhyLimora() {
  return (
    <section id="why" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            {whyLimora.label}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {whyLimora.title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted">{whyLimora.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {whyLimora.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-3xl border border-champagne/10 bg-white/60 p-8 transition-all duration-500 hover:border-champagne/30 hover:bg-white hover:shadow-xl hover:shadow-champagne/5"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-champagne/20 to-nude/40 text-xl text-champagne transition-transform duration-500 group-hover:scale-110">
                {pillar.icon}
              </span>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
