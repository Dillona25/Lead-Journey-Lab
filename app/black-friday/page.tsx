"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlackFridayPage() {
  const [address, setAddress] = useState("");
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const searchParams = useSearchParams();

    useEffect(() => {
        const capturedUtms: Record<string, string> = {};
        let hasUtms = false;

        UTM_KEYS.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                capturedUtms[key] = value;
                hasUtms = true;
            };
        });

        if (hasUtms) {
            sessionStorage.setItem('utm_params', JSON.stringify(capturedUtms))
        }
    }, [searchParams]);

// Get the saved address on page load 
useEffect(() => {
    const savedAddress = localStorage.getItem("USER_ADDRESS");
    if (savedAddress) {
        setAddress(savedAddress)
    }
}, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Store address in local storage
    localStorage.setItem("USER_ADDRESS", address);

    // Calling our API endpoint to get address, CORS error blocked web requests
    const response = await fetch("/api/address-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error("Address lookup failed");
    }

    const data = await response.json();
    console.log(data);


  };



  return (
    <main className="black-friday-page">
      <section className="black-friday-hero d-flex align-items-center">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-warning mb-4">Black Friday offer</span>
              <h1 className="display-3 fw-bold mb-3">Fast fiber. Seriously good price.</h1>
              <p className="lead mb-4">
                Get 1 Gig internet for <strong>$49.99 a month</strong> for 12 months.
              </p>
              <a className="btn btn-warning btn-lg fw-semibold" href="#availability">
                Check your address
              </a>
            </div>

            <div className="col-lg-5">
              <div className="offer-summary p-4 p-md-5">
                <p className="text-uppercase fw-semibold mb-2">1 Gig Fiber</p>
                <p className="offer-price fw-bold mb-1">
                  <span>$</span>49<span className="offer-cents">99</span>
                </p>
                <p className="mb-4">per month for 12 months</p>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">Unlimited data</li>
                  <li className="mb-2">No annual contract</li>
                  <li>Free standard installation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="availability-section" id="availability">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7 text-center">
              <h2 className="fw-bold mb-2">Is fiber available at your home?</h2>
              <p className="text-secondary mb-4">Enter your full address to see available internet packages.</p>

              <form className="address-checker text-start" onSubmit={handleSubmit}>
                <label className="form-label fw-semibold" htmlFor="service-address">
                  Home address
                </label>
                <div className="d-flex flex-column flex-md-row gap-2">
                  <input
                    className="form-control form-control-lg"
                    id="service-address"
                    name="address"
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                  <Link href="/choose-package">
                  <button className="btn btn-dark btn-lg flex-shrink-0" type="submit">
                    Check availability
                  </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
