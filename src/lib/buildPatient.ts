import type { Patient } from './fhirTypes'
import type { PatientInput } from './wizardData'

export function buildPatient(input: PatientInput, id: string): Patient {
  if (!input.givenName.trim() || !input.familyName.trim()) {
    throw new Error('Patient name is required')
  }
  if (!input.birthDate.trim()) {
    throw new Error('Patient birth date is required')
  }
  if (!input.memberId.trim()) {
    throw new Error('Patient member id is required')
  }

  return {
    resourceType: 'Patient',
    id,
    identifier: [{ system: 'https://pas.krrkhan.com/fhir/identifiers/member-id', value: input.memberId }],
    name: [{ family: input.familyName, given: [input.givenName] }],
    gender: input.gender,
    birthDate: input.birthDate,
  }
}
