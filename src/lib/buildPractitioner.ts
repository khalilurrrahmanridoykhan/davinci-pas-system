import { buildRef } from './fhirRef'
import type { Organization, Practitioner, PractitionerRole } from './fhirTypes'
import type { ProviderInput } from './wizardData'

export interface PractitionerIds {
  practitionerId: string
  practitionerRoleId: string
  organizationId: string
}

export function buildPractitioner(
  input: ProviderInput,
  ids: PractitionerIds,
): { practitioner: Practitioner; practitionerRole: PractitionerRole; organization: Organization } {
  if (!input.npi.trim()) {
    throw new Error('Provider NPI is required')
  }
  if (!input.givenName.trim() || !input.familyName.trim()) {
    throw new Error('Provider name is required')
  }
  if (!input.organizationName.trim()) {
    throw new Error('Requesting organization name is required')
  }

  const practitioner: Practitioner = {
    resourceType: 'Practitioner',
    id: ids.practitionerId,
    identifier: [{ system: 'http://hl7.org/fhir/sid/us-npi', value: input.npi }],
    name: [{ family: input.familyName, given: [input.givenName] }],
  }

  const organization: Organization = {
    resourceType: 'Organization',
    id: ids.organizationId,
    name: input.organizationName,
  }

  const practitionerRole: PractitionerRole = {
    resourceType: 'PractitionerRole',
    id: ids.practitionerRoleId,
    practitioner: { reference: buildRef('Practitioner', ids.practitionerId) },
    organization: { reference: buildRef('Organization', ids.organizationId) },
  }

  return { practitioner, practitionerRole, organization }
}
