import type { Metadata } from "next";
import Link from "next/link";
import ThankYouContent from "./ThankYouContent";
import ThankYouTracker from "./ThankYouTracker";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: "تم استلام طلبك",
    description:
      "شكراً لثقتكِ بـ LIMORA. سيتواصل معكِ فريقنا قريباً لتأكيد طلبك.",
    path: "/thank-you",
    noIndex: true,
  });
}

type Props = {
  searchParams: Promise<{
    product?: string;
    offer?: string;
    price?: string;
    orderId?: string;
    slug?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;

  const order = {
    product: params.product ?? "LIMORA",
    offer: params.offer ?? "عرض قطعة واحدة",
    price: Number(params.price) || 199,
    orderId: params.orderId,
    slug: params.slug,
  };

  return (
    <div className="min-h-screen luxury-gradient">
      <ThankYouTracker
        product={order.product}
        offer={order.offer}
        price={order.price}
        orderId={order.orderId}
      />

      <header className="border-b border-champagne/10 bg-ivory/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-5">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-[0.15em] text-foreground"
          >
            LIMORA
          </Link>
        </div>
      </header>

      <ThankYouContent order={order} />
    </div>
  );
}
