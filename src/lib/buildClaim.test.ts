import { describe, expect, it } from 'vitest'
import { buildClaim, type ClaimRefs } from './buildClaim'

const refs: ClaimRefs = {
  claimId: 'claim-1',
  patientRef: 'Patient/patient-1',
  providerRef: 'Organization/org-1',
  coverageRef: 'Coverage/coverage-1',
  deviceRequestRef: 'DeviceRequest/dr-1',
  conditionRef: 'Condition/cond-1',
  createdIso: '2026-08-19T00:00:00Z',
  hcpcsCode: 'L1833',
  hcpcsDisplay: 'Knee orthosis',
  quantity: 2,
}

describe('buildClaim', () => {
  it('builds a preauthorization Claim referencing patient, provider, coverage, and the request', () => {
    const claim = buildClaim(refs)
    expect(claim.use).toBe('preauthorization')
    expect(claim.patient.reference).toBe('Patient/patient-1')
    expect(claim.provider.reference).toBe('Organization/org-1')
    expect(claim.insurance[0].coverage.reference).toBe('Coverage/coverage-1')
    expect(claim.item[0].productOrService.coding?.[0].code).toBe('L1833')
    expect(claim.item[0].quantity?.value).toBe(2)
    expect(claim.prescription?.reference).toBe('DeviceRequest/dr-1')
    expect(claim.diagnosis?.[0].diagnosisReference.reference).toBe('Condition/cond-1')
  })
})
