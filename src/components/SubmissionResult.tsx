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
  pended: 'Pended (needs review)',
  error: 'Error',
}

const OUTCOME_COLOR: Record<ParsedPasResponse['outcome'], string> = {
  approved: '#15803d',
  denied: '#b91c1c',
  pended: '#a16207',
  error: '#b91c1c',
}

export function SubmissionResult({ result, error, onStartOver }: Props) {
  const [showRaw, setShowRaw] = useState(false)

  if (error) {
    return (
      <div>
        <h2>Submission failed</h2>
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <button onClick={onStartOver}>Start over</button>
      </div>
    )
  }

  if (!result) return null

  const raw = result.claimResponse ?? result.operationOutcome

  return (
    <div>
      <h2>Result</h2>
      <p style={{ fontSize: 20, fontWeight: 700, color: OUTCOME_COLOR[result.outcome] }}>{OUTCOME_LABEL[result.outcome]}</p>
      {result.reasonText && <p>{result.reasonText}</p>}

      {raw && (
        <>
          <button onClick={() => setShowRaw((v) => !v)}>{showRaw ? 'Hide' : 'Show'} raw response</button>
          {showRaw && (
            <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 4, overflowX: 'auto', fontSize: 12 }}>
              {JSON.stringify(raw, null, 2)}
            </pre>
          )}
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={onStartOver}>Start a new request</button>
      </div>
    </div>
  )
}
