import {
  resolvePrimaryProductImage,
  sortProductImages,
  getPrimaryImageBySlug,
} from "@/lib/product-images";
import {
  normalizeReviewImage,
} from "@/lib/review-images";
import {
  announcements as staticAnnouncements,
  featuredProducts as staticFeaturedProducts,
  testimonials as staticTestimonials,
} from "@/app/lib/data";
import {
  getOfferDisplayLabel as staticOfferLabel,
  offers as staticOffers,
  product as staticProduct,
  productOrderName as staticOrderName,
  type Offer,
} from "@/app/lib/product-data";
import type { ProductImageRecord } from "@/lib/product-images";
import type {
  Product,
  ProductOffer,
  ProductWithRelations,
  Review,
  Settings,
} from "@/lib/types/database";

export type FeaturedProductCard = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  benefit: string;
  description: string;
  price: string;
  originalPrice: string;
  badge: string | null;
  image: string;
  cta: string;
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  subtitle: string;
  emotionalHook?: string;
  rating: number;
  reviewCount: number;
  bullets: string[];
  urgency: string;
  images: string[];
  orderName: string;
};

export function getAnnouncements(settings: Settings | null): string[] {
  if (settings) {
    const items = [
      settings.announcement_1,
      settings.announcement_2,
      settings.announcement_3,
    ].filter((item): item is string => Boolean(item?.trim()));

    if (items.length) return items;
  }

  return staticAnnouncements;
}

export function mapFeaturedProducts(
  products: Product[],
): FeaturedProductCard[] {
  if (!products.length) {
    return staticFeaturedProducts.map((product) => ({
      ...product,
      slug: product.id,
      badge: product.badge ?? null,
    }));
  }

  return products.map((product) => {
    const images = (product as Product & { product_images?: ProductImageRecord[] })
      .product_images;
    const image = resolvePrimaryProductImage(
      images,
      staticFeaturedProducts.find((item) => item.id === product.slug)?.image ??
        getPrimaryImageBySlug(product.slug),
    );

    return {
      id: product.id,
      slug: product.slug,
      name: product.name_ar,
      nameEn: product.name_en,
      benefit: product.subtitle ?? "",
      description: product.description ?? "",
      price: String(product.price),
      originalPrice: product.original_price
        ? String(product.original_price)
        : "",
      badge: product.badge,
      image,
      cta: `اختاري ${product.name_en.split(" ").pop() ?? "LIMORA"}`,
    };
  });
}

export function mapOffer(offer: ProductOffer): Offer {
  return {
    id: offer.id,
    quantity: offer.quantity,
    label: offer.label,
    price: Number(offer.price),
    unitPrice: Number(offer.price) / offer.quantity,
    badge: offer.badge,
    recommended: offer.is_recommended,
  };
}

export function getOfferDisplayLabel(offer: Offer, displayLabel?: string | null) {
  if (displayLabel?.trim()) return displayLabel;
  return staticOfferLabel(offer);
}

export function mapProductPageData(product: ProductWithRelations | null) {
  if (!product) {
    return {
      productId: undefined as string | undefined,
      productSlug: staticProduct.id,
      product: {
        id: staticProduct.id,
        slug: staticProduct.id,
        name: staticProduct.name,
        nameEn: staticProduct.nameEn,
        subtitle: staticProduct.subtitle,
        rating: staticProduct.rating,
        reviewCount: staticProduct.reviewCount,
        bullets: staticProduct.bullets,
        urgency: staticProduct.urgency,
        images: staticProduct.images,
        orderName: staticOrderName,
      } satisfies StorefrontProduct,
      offers: staticOffers,
      offerLabels: {} as Record<string, string>,
    };
  }

  const images = product.product_images.length
    ? sortProductImages(product.product_images).map((image) => image.url)
    : staticProduct.images;

  const offers = product.product_offers.length
    ? product.product_offers.map(mapOffer)
    : staticOffers;

  const offerLabels = Object.fromEntries(
    product.product_offers.map((offer) => [
      offer.id,
      offer.display_label ?? staticOfferLabel(mapOffer(offer)),
    ]),
  );

  return {
    productId: product.id,
    productSlug: product.slug,
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name_ar,
      nameEn: product.name_en,
      subtitle: product.subtitle ?? "",
      rating: staticProduct.rating,
      reviewCount: staticProduct.reviewCount,
      bullets: product.bullets?.length ? product.bullets : staticProduct.bullets,
      urgency: product.urgency_text ?? staticProduct.urgency,
      images,
      orderName: product.name_en,
    } satisfies StorefrontProduct,
    offers,
    offerLabels,
  };
}

export function mapHomeReviews(reviews: Review[]) {
  if (!reviews.length) return staticTestimonials;

  return {
    label: staticTestimonials.label,
    title: staticTestimonials.title,
    subtitle: staticTestimonials.subtitle,
    items: reviews.map((review) => ({
      name: review.customer_name,
      location: review.location ?? "",
      product: review.product_label ?? "LIMORA",
      rating: review.rating,
      text: review.content,
      image: normalizeReviewImage(
        review.customer_name,
        review.image_url,
      ),
    })),
  };
}
