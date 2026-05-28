import {
  HAIR_REVIVE_PRIMARY_IMAGE,
  OFFICIAL_PRODUCT_SLUGS,
  type OfficialProductSlug,
} from "@/lib/product-images";
import { REVIEW_AVATARS } from "@/lib/review-images";
import { buildStaticTemplateConfig as buildCollagenTemplate } from "@/lib/page-builder/section-templates";
import { feminineBalanceConfig } from "@/lib/products/feminine-balance-config";
import type { PageSection, ProductPageConfig } from "@/lib/page-builder/types";

export { OFFICIAL_PRODUCT_SLUGS, type OfficialProductSlug };

export function isOfficialProductSlug(slug: string): slug is OfficialProductSlug {
  return OFFICIAL_PRODUCT_SLUGS.includes(slug as OfficialProductSlug);
}

function patchSection(
  sections: PageSection[],
  type: PageSection["type"],
  content: Record<string, unknown>,
): PageSection[] {
  return sections.map((section) =>
    section.type === type ? { ...section, content } : section,
  );
}

const hairSections = (sections: PageSection[]) =>
  patchSection(
    patchSection(
      patchSection(
        patchSection(sections, "problem_solution", {
          label: "HAIR CONCERNS",
          title: "Ù‡Ù„ ØªØ¹Ø§Ù†ÙŠÙ† Ù…Ù† Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø´Ø§ÙƒÙ„ØŸ",
          problems: [
            {
              icon: "ðŸ’‡â€â™€ï¸",
              title: "ØªØ³Ø§Ù‚Ø· Ø§Ù„Ø´Ø¹Ø±",
              description: "Ø®ØµÙ„Ø§Øª ØªØªØ³Ø§Ù‚Ø· ÙŠÙˆÙ…ÙŠØ§Ù‹â€¦ ÙˆØªÙ‚Ù„Ù‚ ÙŠØ²Ø¯Ø§Ø¯.",
              image: "",
            },
            {
              icon: "ðŸ˜”",
              title: "Ø´Ø¹Ø± Ø®ÙÙŠÙ",
              description: "ÙƒØ«Ø§ÙØ© ØªÙ‚Ù„â€¦ ÙˆØ§Ù„Ù…Ø¸Ù‡Ø± ÙŠÙÙ‚Ø¯ Ø­ÙŠÙˆÙŠØªÙ‡.",
              image: "",
            },
            {
              icon: "ðŸ’”",
              title: "Ø´Ø¹Ø± Ø¶Ø¹ÙŠÙ",
              description: "ÙŠØªÙƒØ³Ø± Ø¨Ø³Ù‡ÙˆÙ„Ø©â€¦ ÙˆÙ„Ø§ ÙŠØªØ­Ù…Ù„ Ø§Ù„ØªØµÙÙŠÙ.",
              image: "",
            },
            {
              icon: "â³",
              title: "Ø¨Ø·Ø¡ Ø§Ù„Ù†Ù…Ùˆ",
              description: "Ø´Ø¹Ø±ÙƒÙ Ù„Ø§ ÙŠÙ†Ù…Ùˆ Ø¨Ø§Ù„Ø³Ø±Ø¹Ø© Ø§Ù„ØªÙŠ ØªØ³ØªØ­Ù‚ÙŠÙ†Ù‡Ø§.",
              image: "",
            },
          ],
          solution: {
            title: "LIMORA Hair Revive â€” Ù†Ù…Ùˆ ÙˆØªÙ‚ÙˆÙŠØ© Ù…Ù† Ø§Ù„Ø¯Ø§Ø®Ù„",
            description:
              "ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† + Ø¨ÙŠÙˆØªÙŠÙ† + ÙƒÙŠØ±Ø§ØªÙŠÙ† + Ø²Ù†Ùƒ + Ø³ÙŠÙ„ÙŠÙƒØ§ + ÙÙŠØªØ§Ù…ÙŠÙ† E â€” ØªØ±ÙƒÙŠØ¨Ø© Ù„Ù†Ù…Ùˆ Ø§Ù„Ø´Ø¹Ø± ÙˆØªÙ‚ÙˆÙŠØªÙ‡.",
            highlights: [
              "ØªØ­ÙÙŠØ² Ù†Ù…Ùˆ Ø§Ù„Ø´Ø¹Ø± Ù…Ù† Ø§Ù„Ø¬Ø°ÙˆØ±",
              "Ø´Ø¹Ø± Ø£Ù‚ÙˆÙ‰ ÙˆØ£Ù‚Ù„ ØªØ³Ø§Ù‚Ø·Ø§Ù‹",
              "ÙƒØ«Ø§ÙØ© ÙˆÙ„Ù…Ø¹Ø§Ù† Ø·Ø¨ÙŠØ¹ÙŠ",
            ],
            image: "/products/hair-revive/hero.webp",
            caption: "Ø´Ø¹Ø± Ø£Ù‚ÙˆÙ‰â€¦ ÙˆØ«Ù‚Ø© ØªØ¹ÙˆØ¯ Ù…Ø¹ ÙƒÙ„ ÙŠÙˆÙ… ðŸ’«",
          },
        }),
        "benefits",
        {
          label: "YOUR HAIR",
          title: "Ù…Ø§ Ø§Ù„Ø°ÙŠ Ø³ØªØ­ØµÙ„ÙŠÙ† Ø¹Ù„ÙŠÙ‡ØŸ",
          subtitle: "LIMORA Hair Revive â€” Ù„Ø´Ø¹Ø± Ø£ÙƒØ«Ø± ÙƒØ«Ø§ÙØ©ØŒ Ù‚ÙˆØ© ÙˆØµØ­Ø©.",
          items: [
            {
              icon: "ðŸŒ¿",
              title: "ØªØ­ÙÙŠØ² Ù†Ù…Ùˆ Ø§Ù„Ø´Ø¹Ø±",
              description: "Ù…Ù† Ø§Ù„Ø¬Ø°ÙˆØ±â€¦ Ù†ØªØ§Ø¦Ø¬ ØªÙÙ„Ø§Ø­Ø¸ Ù…Ø¹ Ø§Ù„Ø§Ø³ØªÙ…Ø±Ø§Ø±",
            },
            {
              icon: "ðŸ’ª",
              title: "Ø´Ø¹Ø± Ø£Ù‚ÙˆÙ‰",
              description: "ÙƒÙŠØ±Ø§ØªÙŠÙ† ÙˆÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† Ù„ØªÙ‚ÙˆÙŠØ© Ø§Ù„Ø®ØµÙ„Ø§Øª",
            },
            {
              icon: "âœ¨",
              title: "ØªÙ‚Ù„ÙŠÙ„ Ø§Ù„ØªØ³Ø§Ù‚Ø·",
              description: "Ø¨ÙŠÙˆØªÙŠÙ† ÙˆØ²Ù†Ùƒ Ù„Ø¯Ø¹Ù… ØµØ­Ø© Ø§Ù„Ø´Ø¹Ø±",
            },
            {
              icon: "ðŸ‘‘",
              title: "ÙƒØ«Ø§ÙØ© ÙˆÙ„Ù…Ø¹Ø§Ù†",
              description: "Ù…Ø¸Ù‡Ø± Ø­ÙŠÙˆÙŠâ€¦ Ø¨Ø«Ù‚Ø© Ø£Ù†Ø«ÙˆÙŠØ©",
            },
          ],
        },
      ),
      "comparison",
      {
        label: "WHY LIMORA",
        title: "LIMORA vs Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ø§Ø¯ÙŠØ© Ø§Ù„Ø£Ø®Ø±Ù‰",
        subtitle: "ØªØ±ÙƒÙŠØ¨Ø© Ù†Ù…Ùˆ ÙˆØªÙ‚ÙˆÙŠØ©â€¦ Ø¨Ù…Ø¹Ø§ÙŠÙŠØ± Ø£Ø¹Ù„Ù‰ ÙˆØ¨Ø«Ù‚Ø© Ù‡Ø§Ø¯Ø¦Ø©.",
        rows: [
          { feature: "ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† + Ø¨ÙŠÙˆØªÙŠÙ† + ÙƒÙŠØ±Ø§ØªÙŠÙ†", limora: true, others: false },
          { feature: "Ø²Ù†Ùƒ + Ø³ÙŠÙ„ÙŠÙƒØ§ + ÙÙŠØªØ§Ù…ÙŠÙ† E", limora: true, others: false },
          { feature: "Ø³Ù‡Ù„ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙŠÙˆÙ…ÙŠØ§Ù‹", limora: true, others: false },
          { feature: "Ù†ØªØ§Ø¦Ø¬ ØªÙÙ„Ø§Ø­Ø¸ Ø®Ù„Ø§Ù„ Ø£Ø³Ø§Ø¨ÙŠØ¹", limora: true, others: false },
        ],
      },
    ),
    "reviews",
    {
      label: "CUSTOMER LOVE",
      title: "Ø¢Ø±Ø§Ø¡ Ø¹Ù…ÙŠÙ„Ø§Øª Hair Revive",
      items: [
        {
          name: "Ø±ÙŠÙ… Ø§Ù„Ø´Ù…Ø±ÙŠ",
          location: "Ø¬Ø¯Ø©",
          rating: 5,
          text: "ØªØ³Ø§Ù‚Ø· Ø´Ø¹Ø±ÙŠ ÙƒØ§Ù† ÙŠÙ‚Ù„Ù‚Ù†ÙŠ. Hair Revive Ø®Ù„Ù‘Ø§Ù†ÙŠ Ø£Ø´ÙˆÙ ÙƒØ«Ø§ÙØ© Ø­Ù‚ÙŠÙ‚ÙŠØ© Ø®Ù„Ø§Ù„ Ø´Ù‡Ø± â€” ÙˆØ§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø®Ù„Ù‘Ø§Ù†ÙŠ Ø£Ø¬Ø±Ø¨ Ø¨Ø¯ÙˆÙ† ØªØ±Ø¯Ø¯.",
          image: REVIEW_AVATARS.reem,
        },
        {
          name: "Ù‡Ù†Ø¯ Ø§Ù„Ø²Ù‡Ø±Ø§Ù†ÙŠ",
          location: "Ù…ÙƒØ©",
          rating: 5,
          text: "Ø´Ø¹Ø±ÙŠ ØµØ§Ø± Ø£Ù‚ÙˆÙ‰ ÙˆØ£Ù‚Ù„ ØªØ³Ø§Ù‚Ø·Ø§Ù‹. Ø§Ù„Ø°ÙˆØ¨Ø§Ù† Ø³Ù‡Ù„ â€” Ø£Ø¶ÙŠÙÙ‡ Ù„Ø³Ù…ÙˆØ«ÙŠ ÙƒÙ„ ØµØ¨Ø§Ø­.",
          image: REVIEW_AVATARS.hind,
        },
        {
          name: "Ø³Ø§Ø±Ø© Ø§Ù„Ø­Ø±Ø¨ÙŠ",
          location: "Ø¬Ø¯Ø©",
          rating: 5,
          text: "Hair Revive Ø£Ø¹Ø·Ø§Ù†ÙŠ ÙƒØ«Ø§ÙØ© ÙˆÙ„Ù…Ø¹Ø§Ù† â€” ÙØ±Ù‚ ÙˆØ§Ø¶Ø­ Ø®Ù„Ø§Ù„ 3 Ø£Ø³Ø§Ø¨ÙŠØ¹.",
          image: REVIEW_AVATARS.sara,
        },
        {
          name: "Ù„Ù…Ù‰ Ø§Ù„Ø´Ù…Ø±ÙŠ",
          location: "Ø§Ù„Ø¯Ù…Ø§Ù…",
          rating: 5,
          text: "ÙƒÙ†Øª Ø£Ø¨Ø­Ø« Ø¹Ù† Ø­Ù„ Ù„Ù„ØªØ³Ø§Ù‚Ø· â€” Ù‡Ø°Ø§ Ø§Ù„Ù…Ù†ØªØ¬ ÙØ¹Ù„Ø§Ù‹ Ø³Ø§Ø¹Ø¯Ù†ÙŠ. COD Ø®Ù„Ù‘Ø§Ù†ÙŠ Ø£Ø¬Ø±Ø¨ Ø¨Ø«Ù‚Ø©.",
          image: REVIEW_AVATARS.lama,
        },
      ],
    },
  );

const hairReviveConfig = (): ProductPageConfig => {
  const base = buildCollagenTemplate("hair-revive");
  return {
    ...base,
    slug: "hair-revive",
    sections: hairSections(base.sections),
    hero: {
      nameAr: "LIMORA Hair Revive",
      nameEn: "LIMORA Hair Revive",
      subtitle: "ØªØ±ÙƒÙŠØ¨Ø© Ù„Ù†Ù…Ùˆ Ø§Ù„Ø´Ø¹Ø± ÙˆØªÙ‚ÙˆÙŠØªÙ‡ â€” Ù„Ø´Ø¹Ø± Ø£ÙƒØ«Ø± ÙƒØ«Ø§ÙØ©ØŒ Ù‚ÙˆØ© ÙˆØµØ­Ø©",
      emotionalHook: "Ø´Ø¹Ø±ÙƒÙ ÙŠØ³ØªØ­Ù‚ Ø£Ù† ÙŠÙØ±ÙˆÙ‰â€¦ Ù…Ù† Ø§Ù„Ø¯Ø§Ø®Ù„",
      rating: 4.9,
      reviewCount: 2180,
      bullets: [
        "ØªØ­ÙÙŠØ² Ù†Ù…Ùˆ Ø§Ù„Ø´Ø¹Ø± Ù…Ù† Ø§Ù„Ø¬Ø°ÙˆØ±",
        "Ø´Ø¹Ø± Ø£Ù‚ÙˆÙ‰ ÙˆØ£Ù‚Ù„ ØªØ³Ø§Ù‚Ø·Ø§Ù‹",
        "ÙƒØ«Ø§ÙØ© ÙˆÙ„Ù…Ø¹Ø§Ù† Ø·Ø¨ÙŠØ¹ÙŠ",
        "ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† + Ø¨ÙŠÙˆØªÙŠÙ† + ÙƒÙŠØ±Ø§ØªÙŠÙ† + Ø²Ù†Ùƒ",
      ],
      urgency: "âœ¨ Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ø§Ù‹ â€” Ø¹Ø±Ø¶ Ù‚Ø·Ø¹ØªÙŠÙ† Ø¨Ù€ 349 Ø±.Ø³ + Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ",
      images: [HAIR_REVIVE_PRIMARY_IMAGE],
      codTrust: ["Ø´Ø­Ù† Ø³Ø±ÙŠØ¹", "Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…", "Ø¶Ù…Ø§Ù† Ø§Ù„Ø¬ÙˆØ¯Ø©", "Ø­Ù„Ø§Ù„"],
      ctaLabel: "Ø£Ø·Ù„Ø¨ Ø§Ù„Ø¢Ù† Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…",
    },
    offers: [
      {
        id: "1",
        label: "Ù‚Ø·Ø¹Ø© ÙˆØ§Ø­Ø¯Ø©",
        displayLabel: "Ø¹Ø±Ø¶ Ù‚Ø·Ø¹Ø© ÙˆØ§Ø­Ø¯Ø©",
        quantity: 1,
        price: 249,
        badge: null,
        recommended: false,
        savingsText: null,
      },
      {
        id: "2",
        label: "Ù‚Ø·Ø¹ØªØ§Ù†",
        displayLabel: "Ø¹Ø±Ø¶ Ù‚Ø·Ø¹ØªÙŠÙ†",
        quantity: 2,
        price: 349,
        badge: "Ø§Ù„Ø£ÙƒØ«Ø± Ø·Ù„Ø¨Ø§Ù‹",
        recommended: true,
        savingsText: null,
      },
      {
        id: "3",
        label: "3 Ù‚Ø·Ø¹",
        displayLabel: "Ø¹Ø±Ø¶ 3 Ù‚Ø·Ø¹",
        quantity: 3,
        price: 449,
        badge: "Ø£ÙØ¶Ù„ Ù‚ÙŠÙ…Ø©",
        recommended: false,
        savingsText: null,
      },
    ],
    stickyBar: {
      enabled: true,
      messages: [
        "LIMORA Hair Revive â€” Ù†Ù…Ùˆ ÙˆØªÙ‚ÙˆÙŠØ© Ù…Ù† Ø§Ù„Ø¯Ø§Ø®Ù„",
        "Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ + Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…",
        "Ù†ØªØ§Ø¦Ø¬ ØªÙÙ„Ø§Ø­Ø¸ Ø®Ù„Ø§Ù„ Ø£Ø³Ø§Ø¨ÙŠØ¹",
      ],
    },
    theme: {
      accentColor: "#C4A574",
      buttonStyle: "rounded-full",
      heroGradient: "luxury",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
  };
};

export function getStaticProductPageConfig(slug: string): ProductPageConfig | null {
  if (slug === "collagen-glow" || slug === "glow") {
    return buildCollagenTemplate("collagen-glow");
  }
  if (slug === "hair-revive") return hairReviveConfig();
  if (slug === "feminine-balance") return feminineBalanceConfig();
  return null;
}

export function resolveProductSlug(slug: string): string {
  if (slug === "glow") return "collagen-glow";
  if (slug === "detox-cleanse") return "feminine-balance";
  return slug;
}
