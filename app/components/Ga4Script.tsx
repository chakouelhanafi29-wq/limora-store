import Script from "next/script";
import { getSettings } from "@/lib/supabase/queries";
import Ga4ReadyMarker from "./Ga4ReadyMarker";

function isValidMeasurementId(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  return /^G-[A-Z0-9]+$/i.test(value.trim());
}

/**
 * Server-rendered GA4 tags so gtag/js is always scheduled (not blocked by
 * client idle deferral). Storefront SPA navigations still fire via AnalyticsProvider.
 */
export default async function Ga4Script() {
  const settings = await getSettings();
  const measurementId = settings?.google_analytics_id?.trim() ?? null;

  if (!isValidMeasurementId(measurementId)) return null;

  const id = measurementId!;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-measurement-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', {
            send_page_view: true,
            page_path: window.location.pathname,
            page_location: window.location.href
          });
        `}
      </Script>
      <Ga4ReadyMarker />
    </>
  );
}
