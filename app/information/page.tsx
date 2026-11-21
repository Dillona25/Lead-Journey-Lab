export default function InformationPage() {
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

            <form className="lead-form-card">
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="full-name">
                  Full name
                </label>
                <input
                  className="form-control form-control-lg"
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Smith"
                  required
                />
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jordan@example.com"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="form-control form-control-lg"
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 555-0123"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="address">
                  Service address
                </label>
                <input
                  className="form-control form-control-lg"
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Main St, Austin, TX 78701"
                  required
                />
              </div>

              <button className="btn btn-dark btn-lg w-100" type="button">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
