import type { CSSProperties } from 'react'
import type { CoverageInput, PatientInput } from '../lib/wizardData'

interface Props {
  patient: PatientInput
  coverage: CoverageInput
  updatePatient: (patch: Partial<PatientInput>) => void
  updateCoverage: (patch: Partial<CoverageInput>) => void
  onNext: () => void
}

const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }
const inputStyle: CSSProperties = { padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 14 }

export function PatientCoverageForm({ patient, coverage, updatePatient, updateCoverage, onNext }: Props) {
  const canProceed =
    patient.givenName.trim() && patient.familyName.trim() && patient.birthDate && patient.memberId.trim() &&
    coverage.payorName.trim() && coverage.payorId.trim() && coverage.subscriberId.trim()

  return (
    <div>
      <h2>Patient &amp; Coverage</h2>

      <div style={fieldStyle}>
        <label>Given name</label>
        <input style={inputStyle} value={patient.givenName} onChange={(e) => updatePatient({ givenName: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Family name</label>
        <input style={inputStyle} value={patient.familyName} onChange={(e) => updatePatient({ familyName: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Date of birth</label>
        <input type="date" style={inputStyle} value={patient.birthDate} onChange={(e) => updatePatient({ birthDate: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Gender</label>
        <select style={inputStyle} value={patient.gender} onChange={(e) => updatePatient({ gender: e.target.value as PatientInput['gender'] })}>
          <option value="unknown">Unknown</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div style={fieldStyle}>
        <label>Member ID</label>
        <input style={inputStyle} value={patient.memberId} onChange={(e) => updatePatient({ memberId: e.target.value })} />
      </div>

      <h3>Coverage</h3>
      <div style={fieldStyle}>
        <label>Payor name</label>
        <input style={inputStyle} value={coverage.payorName} onChange={(e) => updateCoverage({ payorName: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Payor ID</label>
        <input style={inputStyle} value={coverage.payorId} onChange={(e) => updateCoverage({ payorId: e.target.value })} />
      </div>
      <div style={fieldStyle}>
        <label>Subscriber ID</label>
        <input style={inputStyle} value={coverage.subscriberId} onChange={(e) => updateCoverage({ subscriberId: e.target.value })} />
      </div>

      <button onClick={onNext} disabled={!canProceed}>
        Next: Requesting provider
      </button>
    </div>
  )
}
