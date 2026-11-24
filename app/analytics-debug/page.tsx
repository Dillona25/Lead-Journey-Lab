"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createEventId, pushDataLayerEvent } from "@/lib/analytics";

const isDebugEnabled = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true" || process.env.NODE_ENV === "development";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function AnalyticsDebugPage() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [consent, setConsent] = useState("not chosen");

  useEffect(() => {
    const refresh = () => {
      setEvents([...(window.dataLayer || [])]);
      setConsent(localStorage.getItem("analytics_consent") || "not chosen");
    };

    refresh();
    const interval = window.setInterval(refresh, 500);
    return () => window.clearInterval(interval);
  }, []);

  if (!isDebugEnabled) {
    return (
      <main className="analytics-debug-page min-vh-100 d-flex align-items-center">
        <div className="container text-center py-5">
          <h1 className="h2 fw-bold">Analytics debug mode is disabled</h1>
          <p className="text-secondary">Set NEXT_PUBLIC_ANALYTICS_DEBUG=true and restart the app.</p>
        </div>
      </main>
    );
  }

  const pushValidTest = () => {
    pushDataLayerEvent({
      event: "analytics_debug_test",
      event_id: createEventId("debug"),
      test_status: "valid",
      debug_mode: true,
    });
  };

  const pushDuplicateLead = () => {
    const duplicateEventId = createEventId("debug_duplicate");
    const event = {
      event: "generate_lead",
      event_id: duplicateEventId,
      lead_id: "debug_lead",
      package_id: "fiber_gig",
      test_scenario: "intentional_duplicate",
      debug_mode: true,
    };

    pushDataLayerEvent(event);
    pushDataLayerEvent(event);
  };

  const pushIncompleteLead = () => {
    pushDataLayerEvent({
      event: "generate_lead",
      event_id: createEventId("debug_incomplete"),
      test_scenario: "missing_lead_and_package_identifiers",
      debug_mode: true,
    });
  };

  return (
    <main className="analytics-debug-page min-vh-100 py-5">
      <div className="container py-lg-3">
        <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="badge text-bg-warning mb-2">Local testing tool</span>
            <h1 className="display-6 fw-bold mb-2">Analytics debugger</h1>
            <p className="text-secondary mb-0">Inspect the data layer and generate controlled tracking failures.</p>
          </div>
          <Link className="btn btn-outline-dark align-self-start" href="/ad-simulator">Return to funnel</Link>
        </header>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <section className="analytics-debug-card h-100 p-4" aria-labelledby="configuration-heading">
              <h2 className="h5 fw-bold" id="configuration-heading">Configuration</h2>
              <dl className="receipt-list mb-0">
                <div><dt>GTM container</dt><dd>{gtmId || "Missing NEXT_PUBLIC_GTM_ID"}</dd></div>
                <div><dt>GA4 measurement</dt><dd>{ga4MeasurementId || "Missing NEXT_PUBLIC_GA4_MEASUREMENT_ID"}</dd></div>
                <div><dt>Analytics consent</dt><dd>{consent}</dd></div>
                <div><dt>Queued messages</dt><dd>{events.length}</dd></div>
              </dl>
            </section>
          </div>

          <div className="col-md-6">
            <section className="analytics-debug-card h-100 p-4" aria-labelledby="scenarios-heading">
              <h2 className="h5 fw-bold" id="scenarios-heading">Test scenarios</h2>
              <p className="small text-secondary">Use a dedicated GA4 test property. These buttons can send test events once GTM is connected.</p>
              <div className="d-grid gap-2">
                <button className="btn btn-dark" type="button" onClick={pushValidTest}>Send valid debug event</button>
                <button className="btn btn-outline-danger" type="button" onClick={pushDuplicateLead}>Send duplicate lead events</button>
                <button className="btn btn-outline-warning" type="button" onClick={pushIncompleteLead}>Send incomplete lead event</button>
              </div>
            </section>
          </div>
        </div>

        <section className="analytics-debug-card p-4" aria-labelledby="data-layer-heading">
          <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
            <h2 className="h5 fw-bold mb-0" id="data-layer-heading">Current dataLayer</h2>
            <span className="badge text-bg-secondary">Refreshes automatically</span>
          </div>
          <pre className="event-log p-3 mb-0">{JSON.stringify(events, null, 2)}</pre>
        </section>
      </div>
    </main>
  );
}
