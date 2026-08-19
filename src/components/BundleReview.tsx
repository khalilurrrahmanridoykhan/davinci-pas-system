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

      {buildError && <div className="notice notice-danger">Could not build the request: {buildError}</div>}

      {bundle && (
        <>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Patient</td>
                <td>
                  {data.patient.givenName} {data.patient.familyName} (DOB {data.patient.birthDate})
                </td>
              </tr>
              <tr>
                <td>Coverage</td>
                <td>
                  {data.coverage.payorName} &mdash; subscriber <span className="mono">{data.coverage.subscriberId}</span>
                </td>
              </tr>
              <tr>
                <td>Requesting provider</td>
                <td>
                  {data.provider.givenName} {data.provider.familyName}, NPI <span className="mono">{data.provider.npi}</span> (
                  {data.provider.organizationName})
                </td>
              </tr>
              <tr>
                <td>Requested item</td>
                <td>
                  <span className="mono">{data.requestedItem.hcpcsCode}</span> &times;{data.requestedItem.quantity} &mdash;{' '}
                  {data.requestedItem.reasonText} (<span className="mono">{data.requestedItem.reasonIcd10Code}</span>)
                </td>
              </tr>
            </tbody>
          </table>

          {problems.length > 0 && (
            <div className="notice notice-danger">
              <strong>Cannot submit:</strong>
              <ul>
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="button-link" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? 'Hide' : 'Show'} raw Bundle JSON
          </button>
          {showRaw && <pre className="raw-json">{JSON.stringify(bundle, null, 2)}</pre>}
        </>
      )}

      <div className="button-row">
        <button className="button-secondary" onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button className="button-primary" onClick={() => bundle && onSubmit(bundle)} disabled={!canSubmit}>
          {submitting && <span className="spinner" />}
          {submitting ? 'Submitting...' : 'Submit prior authorization request'}
        </button>
      </div>
    </div>
  )
}
