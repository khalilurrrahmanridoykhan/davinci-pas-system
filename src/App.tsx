import { ErrorBoundary } from './components/ErrorBoundary'
import { Wizard } from './components/Wizard'

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <span className="eyebrow">Da Vinci PAS &middot; FHIR R4</span>
          <h1>Prior Authorization System</h1>
          <p>Provider-side prior authorization request client, built on the Da Vinci PAS Implementation Guide.</p>
        </header>
        <Wizard />
      </div>
    </ErrorBoundary>
  )
}
