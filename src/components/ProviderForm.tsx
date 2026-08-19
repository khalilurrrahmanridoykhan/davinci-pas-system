import type { CSSProperties } from 'react'
import type { ProviderInput } from '../lib/wizardData'

interface Props {
  provider: ProviderInput
  updateProvider: (patch: Partial<ProviderInput>) => void
  onNext: () => void
  onBack: () => void
}

const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }
const inputStyle: CSSProperties = { padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 14 }

export function ProviderForm({ provider, updateProvider, onNext, onBack }: Props) {
  const canProceed = provider.npi.trim() && provider.givenName.trim() && provider.familyName.trim() && provider.organizationName.trim()

  return (
    <div>
      <h2>Requesting Provider</h2>

      <div style={fieldStyle}>
        <label>NPI</label>
        <input style={inputStyle} value={provider.npi} onChange={(e) => updateProvider({ npi: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Given name</label>
        <input style={inputStyle} value={provider.givenName} onChange={(e) => updateProvider({ givenName: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Family name</label>
        <input style={inputStyle} value={provider.familyName} onChange={(e) => updateProvider({ familyName: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Requesting organization</label>
        <input style={inputStyle} value={provider.organizationName} onChange={(e) => updateProvider({ organizationName: e.target.value })} />
      </div>

      <button onClick={onBack}>Back</button>{' '}
      <button onClick={onNext} disabled={!canProceed}>
        Next: Requested item
      </button>
    </div>
  )
}
