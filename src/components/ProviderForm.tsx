import type { ProviderInput } from '../lib/wizardData'

interface Props {
  provider: ProviderInput
  updateProvider: (patch: Partial<ProviderInput>) => void
  onNext: () => void
  onBack: () => void
}

export function ProviderForm({ provider, updateProvider, onNext, onBack }: Props) {
  const canProceed = provider.npi.trim() && provider.givenName.trim() && provider.familyName.trim() && provider.organizationName.trim()

  return (
    <div>
      <h2>Requesting Provider</h2>

      <div className="field field-mono">
        <label>NPI</label>
        <input value={provider.npi} onChange={(e) => updateProvider({ npi: e.target.value })} />
      </div>
      <div className="field">
        <label>Given name</label>
        <input value={provider.givenName} onChange={(e) => updateProvider({ givenName: e.target.value })} />
      </div>
      <div className="field">
        <label>Family name</label>
        <input value={provider.familyName} onChange={(e) => updateProvider({ familyName: e.target.value })} />
      </div>
      <div className="field">
        <label>Requesting organization</label>
        <input value={provider.organizationName} onChange={(e) => updateProvider({ organizationName: e.target.value })} />
      </div>

      <div className="button-row">
        <button className="button-secondary" onClick={onBack}>
          Back
        </button>
        <button className="button-primary" onClick={onNext} disabled={!canProceed}>
          Next: Requested item
        </button>
      </div>
    </div>
  )
}
