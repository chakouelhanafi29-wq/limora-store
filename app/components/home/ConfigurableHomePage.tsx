"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AnnouncementBar from "@/app/components/AnnouncementBar";
import Testimonials from "@/app/components/Testimonials";
import { getOrderedHomeSections } from "@/lib/home-builder/default-config";
import { isValidImageSrc } from "@/lib/home-builder/image-utils";
import type {
  HomePageConfig,
  HomePageTheme,
  HomeSection,
} from "@/lib/home-builder/types";
import type { FeaturedProductCard } from "@/lib/storefront";
import ConfigurableNavbar from "./ConfigurableNavbar";
import FeaturedProductsSection from "./FeaturedProductsSection";
import HomeFAQSection from "./HomeFAQSection";

type TestimonialsData = {
  label: string;
  title: string;
  subtitle: string;
  items: {
    name: string;
    location: string;
    product: string;
    rating: number;
    text: string;
    image: string;
  }[];
};

type Props = {
  config: HomePageConfig;
  products: FeaturedProductCard[];
  testimonials: TestimonialsData;
  preview?: boolean;
  previewMobile?: boolean;
};

function spacingClass(theme: HomePageTheme) {
  if (theme.sectionSpacing === "compact") return "py-12 sm:py-16";
  if (theme.sectionSpacing === "spacious") return "py-24 sm:py-32";
  return "py-20 sm:py-28";
}

function heroGradientClass(theme: HomePageTheme) {
  if (theme.heroGradient === "soft") return "bg-gradient-to-b from-beige/80 to-ivory";
  if (theme.heroGradient === "minimal") return "bg-ivory";
  return "luxury-gradient";
}

function buttonRadius(theme: HomePageTheme) {
  return theme.buttonStyle === "rounded-xl" ? "rounded-xl" : "rounded-full";
}

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-16 text-center">
      <span className="section-label mb-4 inline-block text-xs font-medium text-champagne">
        {label}
      </span>
      <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mx-auto max-w-2xl text-muted">{subtitle}</p>}
    </div>
  );
}

function renderSection(
  section: HomeSection,
  theme: HomePageTheme,
  products: FeaturedProductCard[],
  testimonials: TestimonialsData,
) {
  const pad = spacingClass(theme);
  const btn = buttonRadius(theme);
  const content = section.content as Record<string, unknown>;

  switch (section.type) {
    case "announcement_bar": {
      const messages = (content.messages as string[]) ?? [];
      return <AnnouncementBar key={section.id} announcements={messages} />;
    }
    case "hero": {
      const stats = (content.stats as { value: string; label: string }[]) ?? [];
      const floatCard1 = content.floatCard1 as { title: string; subtitle: string };
      const floatCard2 = content.floatCard2 as { label: string; title: string };
      return (
        <section key={section.id} className={`relative ${heroGradientClass(theme)}`}>
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
            <div className="text-center lg:text-right">
              <span className="section-label mb-6 inline-block rounded-full border border-champagne/30 bg-white/50 px-5 py-2 text-xs font-medium text-champagne">
                {String(content.label ?? "")}
              </span>
              <h1 className="mb-6 font-serif text-4xl font-semibold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
                {String(content.headline ?? "")}
                <br />
                <span className="bg-gradient-to-l from-champagne via-rose-gold to-champagne bg-clip-text text-transparent">
                  {String(content.headlineAccent ?? "")}
                </span>
              </h1>
              <p className="mx-auto mb-4 max-w-lg text-lg leading-relaxed text-muted lg:mx-0">
                {String(content.subheadline ?? "")}
              </p>
              <p className="mb-8 text-sm text-champagne">{String(content.trustLine ?? "")}</p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="/product/collagen-glow"
                  className={`${btn} luxury-focus-ring bg-foreground px-10 py-4 text-base font-medium text-ivory transition-all hover:bg-champagne hover:text-foreground hover:shadow-xl hover:shadow-champagne/20 active:scale-[0.99]`}
                >
                  {String(content.ctaPrimary ?? "")}
                </a>
                <a
                  href="#results"
                  className={`${btn} luxury-focus-ring border border-champagne/40 bg-white/60 px-10 py-4 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:border-champagne hover:bg-white active:scale-[0.99]`}
                >
                  {String(content.ctaSecondary ?? "")}
                </a>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="contents">
                    {index > 0 && <div className="hidden h-10 w-px bg-champagne/20 sm:block" />}
                    <div className="text-center">
                      <p className="font-serif text-3xl font-semibold text-champagne">{stat.value}</p>
                      <p className="text-xs text-muted">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-visible lg:max-w-none">
              <div className="relative overflow-hidden rounded-[2rem] luxury-shadow-lg">
                <Image
                  src={String(content.image ?? "")}
                  alt={String(content.headline ?? "LIMORA — جمالٌ يُولَد من الداخل")}
                  width={900}
                  height={1125}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {floatCard1 && (
                <div className="absolute bottom-4 right-4 hidden glass-card rounded-2xl p-5 luxury-shadow lg:block lg:-bottom-6 lg:-right-8">
                  <p className="text-sm font-bold text-foreground">{floatCard1.title}</p>
                  <p className="text-xs text-muted">{floatCard1.subtitle}</p>
                </div>
              )}
              {floatCard2 && (
                <div className="absolute top-4 left-4 hidden glass-card rounded-2xl p-4 luxury-shadow lg:block lg:-top-4 lg:-left-8">
                  <p className="text-xs font-medium text-champagne">{floatCard2.label}</p>
                  <p className="font-serif text-lg font-semibold text-foreground">{floatCard2.title}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }
    case "products":
      return (
        <FeaturedProductsSection
          key={section.id}
          products={products}
          label={String(content.label ?? "")}
          title={String(content.title ?? "")}
          subtitle={String(content.subtitle ?? "")}
          className={pad}
          buttonRadius={btn}
        />
      );
    case "before_after": {
      type TransformationCard = {
        productName?: string;
        title: string;
        emotionalLine?: string;
        description: string;
        image: string;
        stat: string;
        statLabel: string;
        href?: string;
        accent?: "rose" | "gold" | "sage";
      };

      const accentStyles = {
        rose: "from-rose-gold/20 via-champagne/10 to-transparent ring-rose-gold/15",
        gold: "from-champagne/25 via-amber-100/10 to-transparent ring-champagne/20",
        sage: "from-emerald-100/30 via-emerald-50/20 to-transparent ring-emerald-200/20",
      } as const;

      const items = (content.transformations as TransformationCard[]) ?? [];
      const visibleItems = items.filter((item) => isValidImageSrc(item.image));

      return (
        <section key={section.id} id="results" className={`bg-beige/50 ${pad}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={String(content.label ?? "")}
              title={String(content.title ?? "")}
              subtitle={String(content.subtitle ?? "")}
            />
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
              {visibleItems.map((item) => {
                const accent = item.accent ?? "gold";
                const card = (
                  <article
                    className={`group relative overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-champagne/10 luxury-shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-champagne/10 ${item.href ? "cursor-pointer" : ""}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                      <Image
                        src={item.image}
                        alt={item.productName ?? item.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2a201e]/55 via-[#2a201e]/10 to-transparent" />
                      <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                        <p className="font-serif text-lg font-semibold text-champagne">
                          {item.stat}
                        </p>
                        <p className="text-[10px] text-muted">{item.statLabel}</p>
                      </div>
                    </div>
                    <div
                      className={`relative border-t border-champagne/10 bg-gradient-to-b ${accentStyles[accent]} p-6 sm:p-7`}
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-champagne">
                        {item.productName ?? "LIMORA"}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
                        {item.title}
                      </h3>
                      {item.emotionalLine ? (
                        <p className="mt-3 font-serif text-base leading-relaxed text-champagne sm:text-lg">
                          {item.emotionalLine}
                        </p>
                      ) : null}
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                      {item.href ? (
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:text-champagne">
                          اكتشفي المزيد
                          <span aria-hidden="true">←</span>
                        </span>
                      ) : null}
                    </div>
                  </article>
                );

                return item.href ? (
                  <Link key={item.title} href={item.href} className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={item.title}>{card}</div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    case "benefits": {
      const pillars = (content.pillars as { icon: string; title: string; description: string }[]) ?? [];
      return (
        <section key={section.id} id="why" className={pad}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
            <div className="grid gap-6 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="luxury-card-hover rounded-3xl border border-champagne/10 bg-white/60 p-8 luxury-shadow hover:border-champagne/25">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/15 text-xl text-champagne">{pillar.icon}</span>
                  <h3 className="mb-3 text-lg font-bold">{pillar.title}</h3>
                  <p className="text-sm text-muted">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "reviews": {
      const staticItems = (content.items as TestimonialsData["items"]) ?? [];
      const data: TestimonialsData = {
        label: String(content.label ?? ""),
        title: String(content.title ?? ""),
        subtitle: String(content.subtitle ?? ""),
        items: content.useDynamicReviews ? testimonials.items : staticItems,
      };
      return <Testimonials key={section.id} testimonials={data} className={pad} />;
    }
    case "faq":
      return (
        <HomeFAQSection
          key={section.id}
          label={String(content.label ?? "")}
          title={String(content.title ?? "")}
          subtitle={String(content.subtitle ?? "")}
          items={(content.items as { question: string; answer: string }[]) ?? []}
          className={`bg-beige/50 ${pad}`}
        />
      );
    case "brand_story": {
      const paragraphs = (content.paragraphs as string[]) ?? [];
      const values = (content.values as { label: string; icon: string }[]) ?? [];
      const imageSrc = String(content.image ?? "").trim();
      const showImage = isValidImageSrc(imageSrc);
      const hasText =
        paragraphs.length > 0 ||
        Boolean(content.title) ||
        Boolean(content.subtitle) ||
        values.length > 0;

      if (!showImage && !hasText) {
        return null;
      }

      return (
        <section key={section.id} id="about" className={pad}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`grid items-center gap-12 ${showImage ? "lg:grid-cols-2" : ""}`}>
              {showImage ? (
                <div className="relative overflow-hidden rounded-[1.5rem] luxury-shadow-lg">
                  <Image src={imageSrc} alt={String(content.title ?? "عن LIMORA")} width={800} height={900} className="aspect-[4/5] w-full object-cover" />
                </div>
              ) : null}
              <div className="text-center lg:text-right">
                <SectionHeader label={String(content.label ?? "")} title={String(content.title ?? "")} subtitle={String(content.subtitle ?? "")} />
                <div className="space-y-5 text-muted">
                  {paragraphs.map((p) => (
                    <p key={p} className="leading-relaxed">{p}</p>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                  {values.map((v) => (
                    <span key={v.label} className="inline-flex items-center gap-2 rounded-full border border-champagne/20 bg-white/70 px-5 py-2.5 text-sm">
                      <span className="text-champagne">{v.icon}</span>{v.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    case "promo_banner": {
      const productItems =
        (content.products as { name: string; image: string; href?: string }[]) ??
        [];
      const visibleProducts = productItems.filter(
        (item) => isValidImageSrc(item.image) && item.name?.trim(),
      );

      return (
        <section
          key={section.id}
          className={pad}
          style={{
            background: String(
              content.backgroundColor ??
                "linear-gradient(135deg, #3d2e2a, #2a201e)",
            ),
          }}
        >
          <div className="mx-auto max-w-7xl px-4 text-center text-ivory sm:px-6">
            {visibleProducts.length > 0 && (
              <div className="mb-10 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
                {visibleProducts.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href ?? "#products"}
                    className="group flex flex-col items-center gap-3 transition hover:-translate-y-1"
                  >
                    <div className="relative h-32 w-24 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-ivory/20 sm:h-40 sm:w-28">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                    <span className="text-xs font-medium text-ivory/80">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:text-right">
              <div className="flex-1">
                <h2 className="font-serif text-3xl font-semibold">
                  {String(content.title ?? "")}
                </h2>
                <p className="mt-2 text-ivory/70">
                  {String(content.subtitle ?? "")}
                </p>
                {content.priceNote ? (
                  <p className="mt-3 text-sm font-medium text-champagne-light">
                    {String(content.priceNote)}
                  </p>
                ) : null}
              </div>
              <a
                href={String(content.ctaHref ?? "/product/collagen-glow")}
                className={`${btn} luxury-focus-ring bg-champagne px-8 py-3 text-sm font-medium text-white transition-all hover:bg-rose-gold hover:shadow-lg active:scale-[0.99]`}
              >
                {String(content.ctaLabel ?? "اطلبي الآن")}
              </a>
            </div>
          </div>
        </section>
      );
    }
    case "countdown_banner":
      return (
        <section key={section.id} className="bg-champagne/10 py-6 text-center">
          <p className="text-sm font-medium text-champagne">{String(content.message ?? "")}</p>
          <p className="font-serif text-2xl font-semibold text-foreground">{String(content.title ?? "")}</p>
          <p className="text-xs text-muted">{String(content.endDate ?? "")}</p>
        </section>
      );
    case "footer": {
      const quickLinks = (content.quickLinks as { href: string; label: string }[]) ?? [];
      return (
        <footer key={section.id} className="border-t border-champagne/10 bg-[#2a201e] text-ivory/80">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-12 sm:grid-cols-2">
              <div>
                <p className="font-serif text-2xl tracking-[0.15em] text-ivory">{String(content.brandName ?? "LIMORA")}</p>
                <p className="mt-4 max-w-sm text-sm text-ivory/50">{String(content.tagline ?? "")}</p>
                <p className="mt-4 text-xs text-ivory/40">{String(content.location ?? "")}</p>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-bold text-ivory">روابط سريعة</h4>
                <ul className="space-y-3 text-sm text-ivory/50">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-champagne-light">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-12 border-t border-ivory/10 pt-8 text-center text-xs text-ivory/40">
              © 2026 {String(content.brandName ?? "LIMORA")}. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      );
    }
    default:
      return null;
  }
}

export default function ConfigurableHomePage({
  config,
  products,
  testimonials,
  preview = false,
  previewMobile = false,
}: Props) {
  const [isMobile, setIsMobile] = useState(previewMobile);

  useEffect(() => {
    if (preview) {
      setIsMobile(previewMobile);
      return;
    }
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [preview, previewMobile]);

  const sections = getOrderedHomeSections(config, isMobile);
  const hasFooterSection = sections.some((s) => s.type === "footer");

  return (
    <div
      className="home-builder-page"
      style={{
        ["--builder-accent" as string]: config.theme.accentColor,
        fontSize: `${config.mobile.fontScale * 100}%`,
      }}
    >
      {!sections.some((s) => s.type === "announcement_bar") && null}
      <ConfigurableNavbar navbar={config.navbar} />
      <main>
        {sections
          .map((section) =>
            renderSection(section, config.theme, products, testimonials),
          )
          .filter(Boolean)}
      </main>
      {preview && hasFooterSection && (
        <p className="sr-only">Footer rendered in sections</p>
      )}
    </div>
  );
}

export { type TestimonialsData };
