import { ErrorBoundary } from './components/ErrorBoundary'
import { Wizard } from './components/Wizard'

export default function App() {
  return (
    <ErrorBoundary>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 22 }}>Da Vinci PAS Prior Authorization System</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: -8 }}>
          Provider-side prior authorization request client -- FHIR R4, Da Vinci PAS IG.
        </p>
        <Wizard />
      </div>
    </ErrorBoundary>
  )
}
