"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { markTrackingReady } from "@/lib/analytics/tracking-ready";
import { whenPageInteractive } from "@/lib/performance/idle";

type Props = {
  facebookPixelId?: string | null;
  tiktokPixelId?: string | null;
  snapchatPixelId?: string | null;
  googleAnalyticsId?: string | null;
};

export default function TrackingScripts({
  facebookPixelId,
  tiktokPixelId,
  snapchatPixelId,
  googleAnalyticsId,
}: Props) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    whenPageInteractive(() => setShouldLoad(true));
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const timeout = window.setTimeout(() => markTrackingReady(), 4500);
    return () => window.clearTimeout(timeout);
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  const onScriptsReady = () => {
    markTrackingReady();
  };

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="lazyOnload"
            onLoad={onScriptsReady}
          />
          <Script id="ga4-init" strategy="lazyOnload" onReady={onScriptsReady}>{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', { send_page_view: false });
          `}</Script>
        </>
      )}

      {facebookPixelId && (
        <Script id="fb-pixel" strategy="lazyOnload" onReady={onScriptsReady}>{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${facebookPixelId}');
        `}</Script>
      )}

      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="lazyOnload" onReady={onScriptsReady}>{`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${tiktokPixelId}');
          }(window, document, 'ttq');
        `}</Script>
      )}

      {snapchatPixelId && (
        <Script id="snapchat-pixel" strategy="lazyOnload" onReady={onScriptsReady}>{`
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
          {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
          r.src=n;var u=t.getElementsByTagName(s)[0];
          u.parentNode.insertBefore(r,u);})(window,document,
          'https://sc-static.net/scevent.min.js');
          snaptr('init', '${snapchatPixelId}', {});
        `}</Script>
      )}
    </>
  );
}