import Image from "next/image";

type TestimonialItem = {
  name: string;
  location: string;
  product: string;
  rating: number;
  text: string;
  image: string;
};

type TestimonialsData = {
  label: string;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-champagne">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type Props = {
  testimonials: TestimonialsData;
};

export default function Testimonials({ testimonials }: Props) {
  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
            {testimonials.label}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            {testimonials.title}
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            {testimonials.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.items.map((item) => (
            <article
              key={`${item.name}-${item.text.slice(0, 20)}`}
              className="flex flex-col rounded-3xl bg-white p-8 luxury-shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <Stars count={item.rating} />

              <blockquote className="my-6 flex-1 text-base leading-relaxed text-foreground/80">
                &ldquo;{item.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 border-t border-champagne/10 pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-champagne/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted">
                    {item.location} · {item.product}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
