"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

const packages = [
  {
    id: "fiber_300",
    name: "Fiber 300",
    speed: "300 Mbps",
    price: "29",
    cents: "99",
    description: "A solid fit for browsing, streaming, and working from home.",
  },
  {
    id: "fiber_gig",
    name: "Fiber Gig",
    speed: "1 Gig",
    price: "49",
    cents: "99",
    description: "Fast enough for busy homes, gaming, and multiple devices.",
    badge: "Most popular",
  },
  {
    id: "fiber_2_gig",
    name: "Fiber 2 Gig",
    speed: "2 Gig",
    price: "69",
    cents: "99",
    description: "Our fastest package for power users and connected homes.",
  },
];

export default function ChoosePackagePage() {
const [address, setAddress] = useState('');

useEffect(() => {
    setAddress(localStorage.getItem("USER_ADDRESS") || '');
}, [])

const handlePackageSelect = (internetPackage: (typeof packages)[number]) => {
    sessionStorage.setItem("SELECTED_PACKAGE", JSON.stringify(internetPackage));
}

  return (
    <main className="packages-page min-vh-100 py-5">
      <div className="container py-lg-4">
        <header className="packages-header text-center mx-auto mb-5">
          <span className="badge rounded-pill text-bg-success mb-3">Service available</span>
          <h1 className="display-5 fw-bold mb-3">
            Good news! Internet is available at <span className="text-secondary">{address}</span>
          </h1>
          <p className="lead text-secondary mb-0">Choose the fiber package that works best for your home.</p>
        </header>

        <section aria-label="Available internet packages">
          <div className="row g-4 justify-content-center">
            {packages.map((internetPackage) => (
              <div className="col-md-6 col-lg-4" key={internetPackage.id}>
                <Link
                  className="package-card card h-100 w-100 text-start text-decoration-none"
                  href="/information"
                  data-package-id={internetPackage.id}
                  onClick={() => handlePackageSelect(internetPackage)}
                  aria-label={`Choose ${internetPackage.name}`}
                >
                  <span className="card-body d-flex flex-column p-4">
                    <span className="d-flex align-items-center justify-content-between gap-3 mb-4">
                      <span className="fw-semibold">{internetPackage.name}</span>
                      {internetPackage.badge && (
                        <span className="badge rounded-pill text-bg-warning">{internetPackage.badge}</span>
                      )}
                    </span>

                    <span className="package-speed display-6 fw-bold mb-2">{internetPackage.speed}</span>
                    <span className="text-secondary mb-4">{internetPackage.description}</span>

                    <span className="package-price mt-auto mb-4">
                      <span className="currency">$</span>
                      <span className="amount">{internetPackage.price}</span>
                      <span className="cents">{internetPackage.cents}</span>
                      <span className="period">/mo</span>
                    </span>

                    <span className="btn btn-dark w-100">Choose package</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
