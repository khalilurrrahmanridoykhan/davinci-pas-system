import { describe, expect, it } from 'vitest'
import { buildCoverage, type CoverageIds } from './buildCoverage'
import type { CoverageInput } from './wizardData'

const validInput: CoverageInput = { payorName: 'Acme Health Plan', payorId: 'PAYOR-1', subscriberId: 'SUB-1' }
const ids: CoverageIds = { coverageId: 'coverage-1', payorOrganizationId: 'payor-org-1', patientRef: 'Patient/patient-1' }

describe('buildCoverage', () => {
  it('builds Coverage referencing the patient and a payor Organization', () => {
    const { coverage, payorOrganization } = buildCoverage(validInput, ids)
    expect(coverage.beneficiary.reference).toBe('Patient/patient-1')
    expect(coverage.subscriber?.reference).toBe('Patient/patient-1')
    expect(coverage.payor[0].reference).toBe('Organization/payor-org-1')
    expect(payorOrganization.id).toBe('payor-org-1')
    expect(payorOrganization.name).toBe('Acme Health Plan')
  })

  it('throws when payor info is missing', () => {
    expect(() => buildCoverage({ ...validInput, payorName: '' }, ids)).toThrow(/payor/i)
  })

  it('throws when subscriber id is missing', () => {
    expect(() => buildCoverage({ ...validInput, subscriberId: '' }, ids)).toThrow(/subscriber/i)
  })
})
