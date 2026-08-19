import { useMemo, useState } from 'react'
import { buildPasBundle } from '../lib/buildPasBundle'
import { newId, nowIso } from '../lib/ids'
import { validatePasBundle } from '../lib/validatePasBundle'
import type { WizardFormData } from '../lib/wizardData'

interface Props {
  data: WizardFormData
  onBack: () => void
  onSubmit: (bundle: ReturnType<typeof buildPasBundle>) => void
  submitting: boolean
}

export function BundleReview({ data, onBack, onSubmit, submitting }: Props) {
  const [showRaw, setShowRaw] = useState(false)

  const { bundle, buildError } = useMemo(() => {
    try {
      return { bundle: buildPasBundle(data, newId, nowIso), buildError: null as string | null }
    } catch (err) {
      return { bundle: null, buildError: err instanceof Error ? err.message : String(err) }
    }
  }, [data])

  const problems = bundle ? validatePasBundle(bundle) : []
  const canSubmit = !!bundle && problems.length === 0 && !submitting

  return (
    <div>
      <h2>Review</h2>

      {buildError && <p style={{ color: '#b91c1c' }}>Could not build the request: {buildError}</p>}

      {bundle && (
        <>
          <table style={{ fontSize: 14, marginBottom: 16 }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: 12, fontWeight: 600 }}>Patient</td>
                <td>
                  {data.patient.givenName} {data.patient.familyName} (DOB {data.patient.birthDate})
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: 12, fontWeight: 600 }}>Coverage</td>
                <td>
                  {data.coverage.payorName} -- subscriber {data.coverage.subscriberId}
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: 12, fontWeight: 600 }}>Requesting provider</td>
                <td>
                  {data.provider.givenName} {data.provider.familyName}, NPI {data.provider.npi} ({data.provider.organizationName})
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: 12, fontWeight: 600 }}>Requested item</td>
                <td>
                  {data.requestedItem.hcpcsCode} x{data.requestedItem.quantity} -- {data.requestedItem.reasonText} (
                  {data.requestedItem.reasonIcd10Code})
                </td>
              </tr>
            </tbody>
          </table>

          {problems.length > 0 && (
            <div style={{ color: '#b91c1c', marginBottom: 12 }}>
              <strong>Cannot submit:</strong>
              <ul>
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => setShowRaw((v) => !v)}>{showRaw ? 'Hide' : 'Show'} raw Bundle JSON</button>
          {showRaw && (
            <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 4, overflowX: 'auto', fontSize: 12 }}>
              {JSON.stringify(bundle, null, 2)}
            </pre>
          )}
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={onBack} disabled={submitting}>
          Back
        </button>{' '}
        <button onClick={() => bundle && onSubmit(bundle)} disabled={!canSubmit}>
          {submitting ? 'Submitting...' : 'Submit prior authorization request'}
        </button>
      </div>
    </div>
  )
}
