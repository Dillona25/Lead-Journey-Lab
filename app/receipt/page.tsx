"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";

type LeadInformation = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type SelectedPackage = {
  id: string;
  name: string;
  speed: string;
  price: string;
  cents: string;
};

type LeadReceipt = {
  leadId: string;
  eventId: string;
  submittedAt: string;
};

type Attribution = Record<string, string>;

type ReceiptData = {
  lead: LeadInformation;
  selectedPackage: SelectedPackage;
  receipt: LeadReceipt;
  attribution: Attribution;
};

function readJson<T>(storage: Storage, key: string): T | null {
  const value = storage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

export default function ReceiptPage() {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasTrackedReceipt = useRef(false);

  useEffect(() => {
    const lead = readJson<LeadInformation>(localStorage, "LEAD_INFORMATION");
    const selectedPackage = readJson<SelectedPackage>(sessionStorage, "SELECTED_PACKAGE");
    const receipt = readJson<LeadReceipt>(sessionStorage, "LEAD_RECEIPT");
    const attribution = readJson<Attribution>(sessionStorage, "utm_params") || {};

    if (lead && selectedPackage && receipt) {
      setReceiptData({ lead, selectedPackage, receipt, attribution });
      if (!hasTrackedReceipt.current) {
        hasTrackedReceipt.current = true;
        pushDataLayerEvent({
          event: "lead_receipt_view",
          event_id: receipt.eventId,
          lead_id: receipt.leadId,
          package_id: selectedPackage.id,
        });
      }
    }

    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <main className="receipt-page min-vh-100 d-flex align-items-center">
        <div className="container text-center py-5">Loading receipt…</div>
      </main>
    );
  }

  if (!receiptData) {
    return (
      <main className="receipt-page min-vh-100 d-flex align-items-center">
        <div className="container py-5">
          <div className="receipt-card mx-auto text-center">
            <h1 className="h2 fw-bold">No completed order found</h1>
            <p className="text-secondary">Complete the campaign journey to generate a receipt.</p>
            <Link className="btn btn-dark" href="/ad-simulator">Start the journey</Link>
          </div>
        </div>
      </main>
    );
  }

  const { lead, selectedPackage, receipt, attribution } = receiptData;
  const submittedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(receipt.submittedAt));

  return (
    <main className="receipt-page min-vh-100 py-5">
      <div className="container py-lg-4">
        <div className="receipt-card mx-auto">
          <header className="text-center border-bottom pb-4 mb-4">
            <span className="receipt-check d-inline-flex align-items-center justify-content-center mb-3" aria-hidden="true">✓</span>
            <p className="text-uppercase fw-semibold text-success mb-2">Lead accepted</p>
            <h1 className="display-6 fw-bold mb-2">Thanks, {lead.fullName}</h1>
            <p className="text-secondary mb-0">Your Black Friday fiber request has been received.</p>
          </header>

          <section className="receipt-section" aria-labelledby="order-heading">
            <h2 className="h5 fw-bold mb-3" id="order-heading">Order summary</h2>
            <dl className="receipt-list mb-0">
              <div><dt>Package</dt><dd>{selectedPackage.name}</dd></div>
              <div><dt>Speed</dt><dd>{selectedPackage.speed}</dd></div>
              <div><dt>Monthly price</dt><dd>${selectedPackage.price}.{selectedPackage.cents}</dd></div>
              <div><dt>Service address</dt><dd>{lead.address}</dd></div>
            </dl>
          </section>

          <section className="receipt-section" aria-labelledby="contact-heading">
            <h2 className="h5 fw-bold mb-3" id="contact-heading">Contact information</h2>
            <dl className="receipt-list mb-0">
              <div><dt>Email</dt><dd>{lead.email}</dd></div>
              <div><dt>Phone</dt><dd>{lead.phone}</dd></div>
            </dl>
          </section>

          <section className="receipt-section" aria-labelledby="tracking-heading">
            <h2 className="h5 fw-bold mb-3" id="tracking-heading">Journey details</h2>
            <dl className="receipt-list mb-0">
              <div><dt>Lead ID</dt><dd><code>{receipt.leadId}</code></dd></div>
              <div><dt>Event ID</dt><dd><code>{receipt.eventId}</code></dd></div>
              <div><dt>Submitted</dt><dd>{submittedAt}</dd></div>
              <div><dt>Source</dt><dd>{attribution.utm_source || "Direct / not set"}</dd></div>
              <div><dt>Medium</dt><dd>{attribution.utm_medium || "Not set"}</dd></div>
              <div><dt>Campaign</dt><dd>{attribution.utm_campaign || "Not set"}</dd></div>
            </dl>
          </section>

          <p className="small text-secondary text-center mb-0">
            This is a practice lead receipt. No service order was placed.
          </p>
        </div>
      </div>
    </main>
  );
}
