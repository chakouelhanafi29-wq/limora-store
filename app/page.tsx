export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import WhyLimora from "./components/WhyLimora";
import RealResults from "./components/RealResults";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import AboutUs from "./components/AboutUs";
import {
  getActiveReviews,
  getFeaturedProducts,
  getSettings,
} from "@/lib/supabase/queries";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getAnnouncements,
  mapFeaturedProducts,
  mapHomeReviews,
} from "@/lib/storefront";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: site.seo.title,
    description: site.seo.description,
    path: "/",
  });
}

export default async function Home() {
  const [settings, featuredProducts, reviews] = await Promise.all([
    getSettings(),
    getFeaturedProducts(),
    getActiveReviews(),
  ]);

  const announcements = getAnnouncements(settings);
  const products = mapFeaturedProducts(featuredProducts);
  const testimonials = mapHomeReviews(reviews);

  return (
    <>
      <AnnouncementBar announcements={announcements} />
      <Navbar />
      <main>
        <Hero />
        <Products products={products} />
        <WhyLimora />
        <RealResults />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <AboutUs />
      </main>
    </>
  );
}
