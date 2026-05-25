import Image from "next/image";
import { about } from "../lib/data";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-champagne/15 to-nude/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] luxury-shadow-lg">
              <Image
                src={about.image}
                alt="LIMORA — علامة تجميل فاخرة"
                width={800}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-right">
            <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
              {about.label}
            </span>
            <h2 className="mb-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              {about.title}
            </h2>
            <p className="mb-8 text-lg font-medium text-champagne">
              {about.subtitle}
            </p>

            <div className="space-y-5 text-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              {about.values.map((value) => (
                <span
                  key={value.label}
                  className="inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-white/70 px-5 py-2.5 text-sm font-medium text-foreground"
                >
                  <span className="text-champagne">{value.icon}</span>
                  {value.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
