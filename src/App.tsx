import { Route, Routes } from 'react-router-dom'
import { AboutPage } from './components/AboutPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { Wizard } from './components/Wizard'

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="app-header">
                  <span className="eyebrow">
                    <span className="dot" />
                    Da Vinci PAS &middot; FHIR R4
                  </span>
                  <h1>Prior Authorization System</h1>
                  <p>Provider-side prior authorization request client, built on the Da Vinci PAS Implementation Guide.</p>
                </header>
                <Wizard />
              </>
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}
