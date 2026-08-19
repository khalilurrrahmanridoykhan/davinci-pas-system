import { describe, expect, it } from 'vitest'
import { buildPasBundle } from './buildPasBundle'
import { validatePasBundle } from './validatePasBundle'
import type { WizardFormData } from './wizardData'
import type { Bundle } from './fhirTypes'

const validData: WizardFormData = {
  patient: { givenName: 'Jane', familyName: 'Doe', birthDate: '1980-05-12', gender: 'female', memberId: 'MBR-001' },
  coverage: { payorName: 'Acme Health Plan', payorId: 'PAYOR-1', subscriberId: 'SUB-1' },
  provider: { npi: '1234567890', givenName: 'Sam', familyName: 'Lee', organizationName: 'Riverside Orthopedics' },
  requestedItem: {
    hcpcsCode: 'L1833',
    hcpcsDisplay: 'Knee orthosis',
    quantity: 1,
    reasonText: 'Osteoarthritis of the knee',
    reasonIcd10Code: 'M17.9',
    reasonIcd10Display: 'Osteoarthritis of knee, unspecified',
  },
}

function fakeIds() {
  let n = 0
  return () => `id-${n++}`
}

describe('validatePasBundle', () => {
  it('passes a known-good bundle', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    expect(validatePasBundle(bundle)).toEqual([])
  })

  it('flags a bundle missing Coverage', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    const stripped: Bundle = { ...bundle, entry: bundle.entry.filter((e) => e.resource.resourceType !== 'Coverage') }
    expect(validatePasBundle(stripped).some((p) => p.includes('Coverage'))).toBe(true)
  })

  it('flags a bundle with no Claim', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    const stripped: Bundle = { ...bundle, entry: bundle.entry.filter((e) => e.resource.resourceType !== 'Claim') }
    expect(validatePasBundle(stripped).some((p) => p.includes('Claim'))).toBe(true)
  })

  it('flags duplicate fullUrls', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    const dup: Bundle = { ...bundle, entry: [...bundle.entry, bundle.entry[0]] }
    expect(validatePasBundle(dup).some((p) => p.includes('duplicate'))).toBe(true)
  })

  it('flags a dangling reference', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    const withDangling: Bundle = {
      ...bundle,
      entry: bundle.entry.map((e) =>
        e.resource.resourceType === 'Coverage' && 'beneficiary' in e.resource
          ? { ...e, resource: { ...e.resource, beneficiary: { reference: 'Patient/not-in-bundle' } } }
          : e,
      ),
    }
    expect(validatePasBundle(withDangling).some((p) => p.includes('not included'))).toBe(true)
  })
})
