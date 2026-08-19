import type { CSSProperties } from 'react'
import { HCPCS_OPTIONS, type RequestedItemInput } from '../lib/wizardData'

interface Props {
  requestedItem: RequestedItemInput
  updateRequestedItem: (patch: Partial<RequestedItemInput>) => void
  onNext: () => void
  onBack: () => void
}

const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }
const inputStyle: CSSProperties = { padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 14 }

export function RequestedItemForm({ requestedItem, updateRequestedItem, onNext, onBack }: Props) {
  const canProceed = requestedItem.quantity >= 1 && requestedItem.reasonText.trim() && requestedItem.reasonIcd10Code.trim()

  function onHcpcsChange(code: string) {
    const option = HCPCS_OPTIONS.find((o) => o.code === code)
    updateRequestedItem({ hcpcsCode: code, hcpcsDisplay: option?.display ?? '' })
  }

  return (
    <div>
      <h2>Requested Item (DME)</h2>

      <div style={fieldStyle}>
        <label>HCPCS code</label>
        <select style={inputStyle} value={requestedItem.hcpcsCode} onChange={(e) => onHcpcsChange(e.target.value)}>
          {HCPCS_OPTIONS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.code} -- {o.display}
            </option>
          ))}
        </select>
      </div>
      <div style={fieldStyle}>
        <label>Quantity</label>
        <input
          type="number"
          min={1}
          style={inputStyle}
          value={requestedItem.quantity}
          onChange={(e) => updateRequestedItem({ quantity: Number(e.target.value) })}
        />
      </div>
      <div style={fieldStyle}>
        <label>Reason for request</label>
        <input style={inputStyle} value={requestedItem.reasonText} onChange={(e) => updateRequestedItem({ reasonText: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>ICD-10 code</label>
        <input
          style={inputStyle}
          placeholder="e.g. M17.9"
          value={requestedItem.reasonIcd10Code}
          onChange={(e) => updateRequestedItem({ reasonIcd10Code: e.target.value })}
        />
      </div>
      <div style={fieldStyle}>
        <label>ICD-10 display</label>
        <input
          style={inputStyle}
          value={requestedItem.reasonIcd10Display}
          onChange={(e) => updateRequestedItem({ reasonIcd10Display: e.target.value })}
        />
      </div>

      <button onClick={onBack}>Back</button>{' '}
      <button onClick={onNext} disabled={!canProceed}>
        Next: Review
      </button>
    </div>
  )
}
