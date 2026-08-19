import { HCPCS_OPTIONS, type RequestedItemInput } from '../lib/wizardData'

interface Props {
  requestedItem: RequestedItemInput
  updateRequestedItem: (patch: Partial<RequestedItemInput>) => void
  onNext: () => void
  onBack: () => void
}

export function RequestedItemForm({ requestedItem, updateRequestedItem, onNext, onBack }: Props) {
  const canProceed = requestedItem.quantity >= 1 && requestedItem.reasonText.trim() && requestedItem.reasonIcd10Code.trim()

  function onHcpcsChange(code: string) {
    const option = HCPCS_OPTIONS.find((o) => o.code === code)
    updateRequestedItem({ hcpcsCode: code, hcpcsDisplay: option?.display ?? '' })
  }

  return (
    <div>
      <h2>Requested Item (DME)</h2>

      <div className="field">
        <label>HCPCS code</label>
        <select value={requestedItem.hcpcsCode} onChange={(e) => onHcpcsChange(e.target.value)}>
          {HCPCS_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.code} -- {o.display}
            </option>
          ))}
        </select>
      </div>
      <div className="field field-mono">
        <label>Quantity</label>
        <input type="number" min={1} value={requestedItem.quantity} onChange={(e) => updateRequestedItem({ quantity: Number(e.target.value) })} />
      </div>
      <div className="field">
        <label>Reason for request</label>
        <input value={requestedItem.reasonText} onChange={(e) => updateRequestedItem({ reasonText: e.target.value })} />
      </div>
      <div className="field field-mono">
        <label>ICD-10 code</label>
        <input placeholder="e.g. M17.9" value={requestedItem.reasonIcd10Code} onChange={(e) => updateRequestedItem({ reasonIcd10Code: e.target.value })} />
      </div>
      <div className="field">
        <label>ICD-10 display</label>
        <input value={requestedItem.reasonIcd10Display} onChange={(e) => updateRequestedItem({ reasonIcd10Display: e.target.value })} />
      </div>

      <div className="button-row">
        <button className="button-secondary" onClick={onBack}>
          Back
        </button>
        <button className="button-primary" onClick={onNext} disabled={!canProceed}>
          Next: Review
        </button>
      </div>
    </div>
  )
}
