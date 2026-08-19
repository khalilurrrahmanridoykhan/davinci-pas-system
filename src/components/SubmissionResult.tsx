import { useState } from 'react'
import type { ParsedPasResponse } from '../lib/parsePasResponse'

interface Props {
  result: ParsedPasResponse | null
  error: string | null
  onStartOver: () => void
}

const OUTCOME_LABEL: Record<ParsedPasResponse['outcome'], string> = {
  approved: 'Approved',
  denied: 'Denied',
  pended: 'Pended — needs review',
  error: 'Error',
}

export function SubmissionResult({ result, error, onStartOver }: Props) {
  const [showRaw, setShowRaw] = useState(false)

  if (error) {
    return (
      <div>
        <h2>Submission failed</h2>
        <div className="notice notice-danger">{error}</div>
        <div className="button-row">
          <button className="button-primary" onClick={onStartOver}>
            Start over
          </button>
        </div>
      </div>
    )
  }

  if (!result) return null

  const raw = result.claimResponse ?? result.operationOutcome

  return (
    <div>
      <h2>Result</h2>
      <div className={`outcome-badge ${result.outcome}`}>{OUTCOME_LABEL[result.outcome]}</div>
      {result.reasonText && <p className="result-reason">{result.reasonText}</p>}

      {raw && (
        <>
          <button className="button-link" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? 'Hide' : 'Show'} raw response
          </button>
          {showRaw && <pre className="raw-json">{JSON.stringify(raw, null, 2)}</pre>}
        </>
      )}

      <div className="button-row">
        <button className="button-primary" onClick={onStartOver}>
          Start a new request
        </button>
      </div>
    </div>
  )
}
