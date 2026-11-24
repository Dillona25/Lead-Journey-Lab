"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";

type ConsentChoice = "granted" | "denied";

const CONSENT_STORAGE_KEY = "analytics_consent";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export default function GoogleTagManager() {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const hasLoadedConsent = useRef(false);

  useEffect(() => {
    if (hasLoadedConsent.current) {
      return;
    }

    hasLoadedConsent.current = true;
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (savedConsent === "granted" || savedConsent === "denied") {
      setConsent(savedConsent);
      pushDataLayerEvent({
        event: "consent_state_loaded",
        analytics_storage: savedConsent,
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }

    setIsChoosing(true);
  }, []);

  const updateConsent = (choice: ConsentChoice) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    pushDataLayerEvent({
      event: "consent_update",
      analytics_storage: choice,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    setConsent(choice);
    setIsChoosing(false);
  };

  return (
    <>
      {gtmId && consent === "granted" && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              className="d-none invisible"
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {isChoosing && (
        <aside className="consent-banner shadow-lg" aria-labelledby="consent-title">
          <h2 className="h5 fw-bold mb-2" id="consent-title">Practice analytics consent</h2>
          <p className="small text-secondary mb-3">
            Allow analytics to load GTM and send this demo journey to GA4. Advertising storage remains disabled.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <button className="btn btn-dark flex-grow-1" type="button" onClick={() => updateConsent("granted")}>
              Allow analytics
            </button>
            <button className="btn btn-outline-secondary flex-grow-1" type="button" onClick={() => updateConsent("denied")}>
              Decline
            </button>
          </div>
        </aside>
      )}

      {!isChoosing && consent !== null && (
        <button className="analytics-settings-button btn btn-sm btn-light border" type="button" onClick={() => setIsChoosing(true)}>
          Analytics settings
        </button>
      )}
    </>
  );
}
