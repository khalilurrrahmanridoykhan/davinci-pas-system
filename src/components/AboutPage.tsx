export function AboutPage() {
  return (
    <div>
      <header className="about-hero">
        <span className="eyebrow">
          <span className="dot" />
          About this system
        </span>
        <h1>A working client for prior authorization, built on a real FHIR IG</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 14, fontSize: '1rem' }}>
          Prior authorization is the step where a health plan has to approve a treatment before it happens. This system is the
          provider-side half of that conversation: it builds a standards-conformant request, sends it to a payer, and shows you
          what came back.
        </p>
      </header>

      <section className="about-section">
        <h2>What is Da Vinci PAS?</h2>
        <p>
          The <strong>Da Vinci Project</strong> is an HL7 initiative building FHIR-based implementation guides for U.S. payer/
          provider data exchange &mdash; the plumbing behind CMS&rsquo;s interoperability mandates. <strong>PAS</strong> (Prior
          Authorization Support) is its guide for exactly this workflow: an ordering system submits a <code>Claim</code> describing
          the requested treatment, and gets back a <code>ClaimResponse</code> with a decision, synchronously, over one FHIR
          operation &mdash; <code>Claim/$submit</code>.
        </p>
        <p>Before PAS, this exchange typically happened over fax, phone, or a payer&rsquo;s own web portal. PAS makes it an API call.</p>
      </section>

      <section className="about-section">
        <h2>What this app actually does</h2>
        <p>
          One concrete workflow, built end to end: a request for a knee orthosis (a piece of durable medical equipment, HCPCS
          code <code>L1833</code>) tied to an osteoarthritis diagnosis. The wizard collects the minimum a real request needs
          &mdash; patient, coverage, requesting provider, the item and why it&rsquo;s needed &mdash; assembles a spec-conformant
          FHIR Bundle, and submits it.
        </p>
        <div className="workflow-steps">
          <div className="workflow-step">
            <span className="workflow-step-num">01</span>
            <div>
              <h3>Collect</h3>
              <p>Patient, coverage, requesting provider, and the requested item &mdash; five short forms, not one long one.</p>
            </div>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-num">02</span>
            <div>
              <h3>Build &amp; validate</h3>
              <p>
                A <code>Claim</code> resource is synthesized from that input and bundled with every resource it references
                &mdash; Patient, Coverage, Practitioner, DeviceRequest, Condition. A lightweight structural check runs before
                anything is sent.
              </p>
            </div>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-num">03</span>
            <div>
              <h3>Submit</h3>
              <p>
                One <code>POST</code> to <code>Claim/$submit</code> against a real, self-hosted Da Vinci PAS reference server
                &mdash; the same open-source implementation used at HL7 Connectathons.
              </p>
            </div>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-num">04</span>
            <div>
              <h3>Decide</h3>
              <p>The response is parsed into a plain outcome &mdash; approved, denied, pended, or error &mdash; with the payer&rsquo;s own reasoning.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Built and verified against a live server, not a mock</h2>
        <p>
          The payer side is a self-hosted instance of{' '}
          <a href="https://github.com/HL7-DaVinci/prior-auth" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
            HL7-DaVinci/prior-auth
          </a>
          , the project&rsquo;s own reference implementation. Two real integration bugs only surfaced by submitting against it for
          real: it rejects the more common <code>urn:uuid:</code> bundle references (needs <code>{'{ResourceType}/{id}'}</code>{' '}
          instead), and it links a Claim to its request item through the standard <code>prescription</code>/<code>diagnosis</code>{' '}
          fields rather than <code>supportingInfo</code>. Both were found by reading the server&rsquo;s own source and test
          fixtures after a real submission came back with an error, then fixed and re-verified live.
        </p>
      </section>

      <section className="about-section">
        <h2>Scope, honestly</h2>
        <p>This is the client side of one workflow, not a general-purpose prior-auth platform. On purpose, it doesn&rsquo;t include:</p>
        <ul>
          <li>
            <strong>The payer side</strong> &mdash; adjudication logic and the underlying X12 278 translation belong to the payer;
            this app only ever plays the requester.
          </li>
          <li>
            <strong>Real DTR</strong> (Documentation Templates and Rules) &mdash; the CDS Hooks-driven step that determines what
            documentation a payer needs before submission. The IG allows submitting without it; a full rules engine wasn&rsquo;t
            built here.
          </li>
          <li>
            <strong>Full FHIR profile validation</strong> &mdash; the app checks structural soundness (required resources present,
            no dangling references), not conformance to every constraint in the PAS profiles.
          </li>
          <li>
            <strong>Item types beyond DME</strong> &mdash; the workflow is deliberately narrow and concrete rather than a
            configurable-but-shallow form for every resource type PAS can carry.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Stack</h2>
        <div className="pill-row">
          <span className="pill">FHIR R4</span>
          <span className="pill">Da Vinci PAS IG</span>
          <span className="pill">React + TypeScript</span>
          <span className="pill">Vite</span>
          <span className="pill">Vitest</span>
          <span className="pill">Docker</span>
          <span className="pill">GitHub Actions</span>
        </div>
      </section>
    </div>
  )
}
