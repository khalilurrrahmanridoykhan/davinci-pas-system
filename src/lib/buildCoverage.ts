import { buildRef } from './fhirRef'
import type { Coverage, Organization } from './fhirTypes'
import type { CoverageInput } from './wizardData'

export interface CoverageIds {
  coverageId: string
  payorOrganizationId: string
  patientRef: string
}

export function buildCoverage(
  input: CoverageInput,
  ids: CoverageIds,
): { coverage: Coverage; payorOrganization: Organization } {
  if (!input.payorName.trim() || !input.payorId.trim()) {
    throw new Error('Payor name and id are required')
  }
  if (!input.subscriberId.trim()) {
    throw new Error('Subscriber id is required')
  }

  const payorOrganization: Organization = {
    resourceType: 'Organization',
    id: ids.payorOrganizationId,
    identifier: [{ system: 'https://pas.krrkhan.com/fhir/identifiers/payor-id', value: input.payorId }],
    name: input.payorName,
  }

  const coverage: Coverage = {
    resourceType: 'Coverage',
    id: ids.coverageId,
    status: 'active',
    beneficiary: { reference: ids.patientRef },
    subscriber: { reference: ids.patientRef },
    subscriberId: input.subscriberId,
    payor: [{ reference: buildRef('Organization', ids.payorOrganizationId) }],
  }

  return { coverage, payorOrganization }
}
