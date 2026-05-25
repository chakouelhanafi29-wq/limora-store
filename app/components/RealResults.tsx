import Image from "next/image";
import { realResults } from "../lib/data";

export default function RealResults() {
  return (
    <section id="results" className="bg-beige/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            {realResults.label}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {realResults.title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted">{realResults.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {realResults.transformations.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-3xl bg-white luxury-shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4">
                  <p className="font-serif text-3xl font-semibold text-ivory">
                    {item.stat}
                  </p>
                  <p className="text-xs text-ivory/80">{item.statLabel}</p>
                </div>
              </div>
              <div className="p-7">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#products"
            className="inline-block rounded-full bg-foreground px-10 py-4 text-sm font-medium text-ivory transition-all hover:bg-champagne hover:shadow-xl"
          >
            ابدئي تحولكِ مع LIMORA
          </a>
        </div>
      </div>
    </section>
  );
}
