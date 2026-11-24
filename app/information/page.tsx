"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
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
};

const initialLead: LeadInformation = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function InformationPage() {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasStartedForm = useRef(false);

  useEffect(() => {
    const savedLead = localStorage.getItem("LEAD_INFORMATION");
    const savedAddress = localStorage.getItem("USER_ADDRESS") || "";

    if (savedLead) {
      try {
        const parsedLead = JSON.parse(savedLead) as LeadInformation;
        setLead({ ...initialLead, ...parsedLead, address: savedAddress || parsedLead.address });
        return;
      } catch {
        localStorage.removeItem("LEAD_INFORMATION");
      }
    }

    setLead((currentLead) => ({ ...currentLead, address: savedAddress }));
  }, []);

  const handleChange = (field: keyof LeadInformation, value: string) => {
    setLead((currentLead) => ({ ...currentLead, [field]: value }));
  };

  const handleFormStart = () => {
    if (hasStartedForm.current) {
      return;
    }

    hasStartedForm.current = true;
    pushDataLayerEvent({ event: "form_start", form_name: "lead_information" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    let selectedPackage: SelectedPackage | null = null;
    const savedPackage = sessionStorage.getItem("SELECTED_PACKAGE");

    if (savedPackage) {
      try {
        selectedPackage = JSON.parse(savedPackage) as SelectedPackage;
      } catch {
        sessionStorage.removeItem("SELECTED_PACKAGE");
      }
    }

    if (!selectedPackage) {
      setError("Please return to the package page and choose a plan before continuing.");
      setIsSubmitting(false);
      return;
    }

    pushDataLayerEvent({
      event: "form_submit",
      form_name: "lead_information",
      package_id: selectedPackage.id,
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, packageId: selectedPackage.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We could not submit your information.");
      }

      localStorage.setItem("LEAD_INFORMATION", JSON.stringify(lead));
      sessionStorage.setItem(
        "LEAD_RECEIPT",
        JSON.stringify({ leadId: result.leadId, eventId: result.eventId, submittedAt: result.submittedAt }),
      );

      pushDataLayerEvent({
        event: "generate_lead",
        event_id: result.eventId,
        lead_id: result.leadId,
        package_id: selectedPackage.id,
      });

      router.push("/receipt");
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "Something went wrong.";
      setError(message);
      pushDataLayerEvent({
        event: "lead_submission_error",
        error_type: "submission_failed",
        package_id: selectedPackage.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="information-page min-vh-100 py-5">
      <div className="container py-lg-4">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <header className="text-center mb-4">
              <span className="badge rounded-pill text-bg-warning mb-3">Almost there</span>
              <h1 className="display-6 fw-bold mb-2">Tell us about yourself</h1>
              <p className="text-secondary mb-0">Enter your information to continue with your internet order.</p>
            </header>

            <form className="lead-form-card" onFocus={handleFormStart} onSubmit={handleSubmit}>
              <div className="alert alert-light border small" role="note">
                Demo only: use sample information. This exercise stores the form in your browser for the receipt page.
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="full-name">Full name</label>
                <input
                  className="form-control form-control-lg"
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Smith"
                  value={lead.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="email">Email</label>
                  <input
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jordan@example.com"
                    value={lead.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="phone">Phone</label>
                  <input
                    className="form-control form-control-lg"
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 555-0123"
                    value={lead.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="address">Service address</label>
                <input
                  className="form-control form-control-lg"
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Main St, Austin, TX 78701"
                  value={lead.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <button className="btn btn-dark btn-lg w-100" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Submitting…
                  </>
                ) : "Submit order"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
