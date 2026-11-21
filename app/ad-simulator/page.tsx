const FACEBOOK_FUNNEL_URL = "/black-friday?utm_source=facebook&utm_medium=paid_social&utm_campaign=black-friday&utm_content=video";
const INSTAGRAM_FUNNEL_URL = "/black-friday?utm_source=instagram&utm_medium=paid_social&utm_campaign=black-friday&utm_content=video";

type EntryButtonProps = {
  label: string;
  url: string;
  className: string;
};

function EntryButton({ label, url, className }: EntryButtonProps) {
  if (!url) {
    return (
      <button className={`btn btn-lg ${className}`} type="button" disabled>
        {label}
      </button>
    );
  }

  return (
    <a className={`btn btn-lg ${className}`} href={url}>
      {label}
    </a>
  );
}

export default function AdSimulatorPage() {
  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <section className="simulator-panel text-center w-100">
        <h1 className="fw-bold mb-3">Black Friday Internet Sale</h1>
        <p className="text-secondary mb-4">Choose an ad source to enter the funnel.</p>

        <div className="d-grid gap-3">
          <EntryButton label="Enter from Facebook" url={FACEBOOK_FUNNEL_URL} className="btn-primary" />
          <EntryButton label="Enter from Instagram" url={INSTAGRAM_FUNNEL_URL} className="btn-instagram" />
        </div>
      </section>
    </main>
  );
}
