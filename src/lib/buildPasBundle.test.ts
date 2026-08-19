import { describe, expect, it } from 'vitest'
import { buildPasBundle } from './buildPasBundle'
import type { WizardFormData } from './wizardData'

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

describe('buildPasBundle', () => {
  it('assembles exactly one Claim entry and one entry per resource, all with unique fullUrls', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')

    expect(bundle.resourceType).toBe('Bundle')
    expect(bundle.type).toBe('collection')

    const claims = bundle.entry.filter((e) => e.resource.resourceType === 'Claim')
    expect(claims).toHaveLength(1)

    const fullUrls = bundle.entry.map((e) => e.fullUrl)
    expect(new Set(fullUrls).size).toBe(fullUrls.length)
    expect(bundle.entry).toHaveLength(9)
  })

  it('every reference in the bundle points to a fullUrl present in the bundle', () => {
    const bundle = buildPasBundle(validData, fakeIds(), () => '2026-08-19T00:00:00Z')
    const knownRelativeRefs = new Set(bundle.entry.map((e) => `${e.resource.resourceType}/${(e.resource as { id?: string }).id}`))

    function collectRefs(obj: unknown, refs: string[]): void {
      if (obj === null || typeof obj !== 'object') return
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'reference' && typeof value === 'string' && /^[A-Z][A-Za-z]*\//.test(value)) refs.push(value)
        else collectRefs(value, refs)
      }
    }

    const refs: string[] = []
    for (const e of bundle.entry) collectRefs(e.resource, refs)
    expect(refs.length).toBeGreaterThan(0)
    for (const r of refs) expect(knownRelativeRefs.has(r)).toBe(true)
  })

  it('propagates a builder validation error (e.g. missing patient name)', () => {
    const invalid: WizardFormData = { ...validData, patient: { ...validData.patient, givenName: '' } }
    expect(() => buildPasBundle(invalid, fakeIds(), () => '2026-08-19T00:00:00Z')).toThrow(/name/i)
  })
})
