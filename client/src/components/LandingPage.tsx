import type { AppRoute } from "../types";

type LandingPageProps = {
  isSignedIn: boolean;
  onNavigate: (route: AppRoute) => void;
};

function LandingPage({ isSignedIn, onNavigate }: LandingPageProps) {
  const primaryRoute = isSignedIn ? "/dashboard" : "/auth";

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <button
          className="brand-button"
          type="button"
          onClick={() => onNavigate("/")}
        >
          Pulse Vote
        </button>
        <nav aria-label="Landing navigation">
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
        </nav>
        <div>
          <button type="button" onClick={() => onNavigate("/auth")}>
            Sign in
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => onNavigate(primaryRoute)}
          >
            {isSignedIn ? "Open dashboard" : "Get started"}
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Live polling workspace</p>
          <h1>Pulse Vote</h1>
          <p>
            Create focused polls, collect responses, publish results, and read
            analytics from one fast dashboard built for product teams,
            classrooms, communities, and fast decision loops.
          </p>
          <div className="landing-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => onNavigate(primaryRoute)}
            >
              {isSignedIn ? "Go to dashboard" : "Start polling"}
            </button>
            <button type="button" onClick={() => onNavigate("/auth")}>
              Try demo login
            </button>
          </div>
          <dl className="hero-metrics">
            <div>
              <dt>Setup</dt>
              <dd>2 min</dd>
            </div>
            <div>
              <dt>Question types</dt>
              <dd>Multi-option</dd>
            </div>
            <div>
              <dt>Results</dt>
              <dd>Live-ready</dd>
            </div>
          </dl>
        </div>

        <div
          className="landing-preview"
          aria-label="Pulse Vote dashboard preview"
        >
          <div className="preview-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-grid">
            <section className="preview-panel">
              <p className="eyebrow">Dashboard</p>
              <h2>Product feedback sprint</h2>
              <p>
                Prioritize roadmap ideas with a lightweight poll and publish the
                result once responses are in.
              </p>
              <div className="preview-stat-row">
                <div>
                  <span>Responses</span>
                  <strong>128</strong>
                </div>
                <div>
                  <span>Questions</span>
                  <strong>4</strong>
                </div>
              </div>
            </section>

            <section className="preview-panel">
              <p className="eyebrow">Analytics</p>
              <h3>Which feature matters most?</h3>
              <div className="preview-bars">
                <div>
                  <span style={{ width: "72%" }} />
                </div>
                <div>
                  <span style={{ width: "48%" }} />
                </div>
                <div>
                  <span style={{ width: "31%" }} />
                </div>
              </div>
            </section>

            <section className="preview-panel preview-responses">
              <p className="eyebrow">Response form</p>
              <div>
                <span>Dark mode dashboard</span>
                <strong>Selected by 72 voters</strong>
              </div>
              <div>
                <span>Public result sharing</span>
                <strong>Selected by 48 voters</strong>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        className="landing-workflow"
        id="workflow"
        aria-label="Pulse Vote workflow"
      >
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h2>From question to decision without the spreadsheet shuffle.</h2>
        </div>
        <div className="workflow-steps">
          {[
            [
              "01",
              "Create the poll",
              "Add a title, description, response mode, expiry, and as many multiple-choice questions as you need.",
            ],
            [
              "02",
              "Collect responses",
              "Open the response form from the poll console and let people submit answers without extra friction.",
            ],
            [
              "03",
              "Publish and analyze",
              "Publish results when ready, then review totals and vote distribution in the analytics view.",
            ],
          ].map(([step, title, text]) => (
            <article key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="landing-features"
        id="features"
        aria-label="Pulse Vote features"
      >
        {[
          [
            "Poll builder",
            "Create structured polls with required questions, multiple options, response modes, and optional expiry.",
          ],
          [
            "Auth dashboard",
            "Keep poll creation and publishing behind sign-in while response submission stays lightweight.",
          ],
          [
            "Readable analytics",
            "See total responses and per-option vote bars without needing to manually calculate percentages.",
          ],
          [
            "Result publishing",
            "Control when poll results are published so responses can be collected before outcomes are visible.",
          ],
          [
            "Dark interface",
            "A focused blue workspace designed for long sessions, scanning, and repeated operational use.",
          ],
          [
            "Backend aligned",
            "The frontend maps directly to the Express routes for auth, polls, poll responses, and analytics.",
          ],
        ].map(([title, text]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="landing-final">
        <p className="eyebrow">Ready when the room is</p>
        <h2>
          Launch a poll, collect a pulse, and turn responses into a decision.
        </h2>
        <button
          className="primary-button"
          type="button"
          onClick={() => onNavigate(primaryRoute)}
        >
          {isSignedIn ? "Open dashboard" : "Get started"}
        </button>
      </section>

      <footer className="landing-footer">
        <div>
          <button
            className="brand-button"
            type="button"
            onClick={() => onNavigate("/")}
          >
            Pulse Vote
          </button>
          <p>
            A full-stack polling app for building polls, collecting responses,
            publishing results, and reviewing analytics.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <button type="button" onClick={() => onNavigate(primaryRoute)}>
            {isSignedIn ? "Dashboard" : "Sign in"}
          </button>
        </nav>
      </footer>
    </main>
  );
}

export default LandingPage;
