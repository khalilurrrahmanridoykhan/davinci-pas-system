import { describe, expect, it } from 'vitest'
import { buildPatient } from './buildPatient'
import type { PatientInput } from './wizardData'

const validInput: PatientInput = {
  givenName: 'Jane',
  familyName: 'Doe',
  birthDate: '1980-05-12',
  gender: 'female',
  memberId: 'MBR-001',
}

describe('buildPatient', () => {
  it('builds a Patient with required fields', () => {
    const patient = buildPatient(validInput, 'patient-1')
    expect(patient.resourceType).toBe('Patient')
    expect(patient.id).toBe('patient-1')
    expect(patient.name).toEqual([{ family: 'Doe', given: ['Jane'] }])
    expect(patient.birthDate).toBe('1980-05-12')
    expect(patient.identifier?.[0].value).toBe('MBR-001')
  })

  it('throws when name is missing', () => {
    expect(() => buildPatient({ ...validInput, givenName: '' }, 'patient-1')).toThrow(/name/i)
  })

  it('throws when birth date is missing', () => {
    expect(() => buildPatient({ ...validInput, birthDate: '' }, 'patient-1')).toThrow(/birth date/i)
  })

  it('throws when member id is missing', () => {
    expect(() => buildPatient({ ...validInput, memberId: '' }, 'patient-1')).toThrow(/member id/i)
  })
})
