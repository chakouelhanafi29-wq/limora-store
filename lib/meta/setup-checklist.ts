export const META_AEM_EVENTS = [
  "Purchase",
  "Lead",
  "InitiateCheckout",
  "AddToCart",
  "ViewContent",
] as const;

export type MetaSetupCheckId =
  | "domain_verified"
  | "site_url_matches"
  | "pixel_configured"
  | "capi_configured"
  | "aem_prioritized"
  | "dedup_tested";

export type MetaSetupCheck = {
  id: MetaSetupCheckId;
  title: string;
  description: string;
  metaPath: string;
};

export const META_SETUP_CHECKS: MetaSetupCheck[] = [
  {
    id: "domain_verified",
    title: "Domain verified in Meta Business Manager",
    description:
      "Add limorashop.co (and www if used) under Business Settings → Brand safety → Domains. Prefer DNS TXT at the root.",
    metaPath: "business.facebook.com → Business settings → Brand safety → Domains",
  },
  {
    id: "site_url_matches",
    title: "Store Site URL matches verified domain",
    description:
      "Admin → Settings → Site URL must be https://www.limorashop.co (same host you verify and run ads on).",
    metaPath: "LIMORA Admin → /admin/settings",
  },
  {
    id: "pixel_configured",
    title: "Meta Pixel on verified domain",
    description:
      "Pixel loads on www.limorashop.co and is owned by the same Business Manager as the verified domain.",
    metaPath: "Events Manager → Data sources → Your Pixel → Settings",
  },
  {
    id: "capi_configured",
    title: "Conversions API connected to the same Pixel",
    description:
      "Access token saved in Admin → Tracking. Test with Events Manager → Test events.",
    metaPath: "Events Manager → Your Pixel → Settings → Conversions API",
  },
  {
    id: "aem_prioritized",
    title: "Aggregated Event Measurement (8 events)",
    description:
      "Configure exactly these 5 commerce events in priority order (top = highest): Purchase, Lead, InitiateCheckout, AddToCart, ViewContent.",
    metaPath: "Events Manager → Aggregated Event Measurement → Configure web events",
  },
  {
    id: "dedup_tested",
    title: "Browser + server deduplication",
    description:
      "Same event_id on Pixel and CAPI; Events Manager should show “Received” once per action, not double-counted.",
    metaPath: "Events Manager → Test events → trigger ViewContent + Lead",
  },
];
