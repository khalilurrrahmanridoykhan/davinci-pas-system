import type { CoverageInput, PatientInput } from '../lib/wizardData'

interface Props {
  patient: PatientInput
  coverage: CoverageInput
  updatePatient: (patch: Partial<PatientInput>) => void
  updateCoverage: (patch: Partial<CoverageInput>) => void
  onNext: () => void
}

export function PatientCoverageForm({ patient, coverage, updatePatient, updateCoverage, onNext }: Props) {
  const canProceed =
    patient.givenName.trim() && patient.familyName.trim() && patient.birthDate && patient.memberId.trim() &&
    coverage.payorName.trim() && coverage.payorId.trim() && coverage.subscriberId.trim()

  return (
    <div>
      <h2>Patient &amp; Coverage</h2>

      <div className="field">
        <label>Given name</label>
        <input value={patient.givenName} onChange={(e) => updatePatient({ givenName: e.target.value })} />
      </div>
      <div className="field">
        <label>Family name</label>
        <input value={patient.familyName} onChange={(e) => updatePatient({ familyName: e.target.value })} />
      </div>
      <div className="field">
        <label>Date of birth</label>
        <input type="date" value={patient.birthDate} onChange={(e) => updatePatient({ birthDate: e.target.value })} />
      </div>
      <div className="field">
        <label>Gender</label>
        <select value={patient.gender} onChange={(e) => updatePatient({ gender: e.target.value as PatientInput['gender'] })}>
          <option value="unknown">Unknown</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="field field-mono">
        <label>Member ID</label>
        <input value={patient.memberId} onChange={(e) => updatePatient({ memberId: e.target.value })} />
      </div>

      <h3>Coverage</h3>
      <div className="field">
        <label>Payor name</label>
        <input value={coverage.payorName} onChange={(e) => updateCoverage({ payorName: e.target.value })} />
      </div>
      <div className="field field-mono">
        <label>Payor ID</label>
        <input value={coverage.payorId} onChange={(e) => updateCoverage({ payorId: e.target.value })} />
      </div>
      <div className="field field-mono">
        <label>Subscriber ID</label>
        <input value={coverage.subscriberId} onChange={(e) => updateCoverage({ subscriberId: e.target.value })} />
      </div>

      <div className="button-row">
        <button className="button-primary" onClick={onNext} disabled={!canProceed}>
          Next: Requesting provider
        </button>
      </div>
    </div>
  )
}
