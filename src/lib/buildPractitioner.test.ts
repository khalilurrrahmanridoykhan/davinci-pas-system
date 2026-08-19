import { describe, expect, it } from 'vitest'
import { buildPractitioner, type PractitionerIds } from './buildPractitioner'
import type { ProviderInput } from './wizardData'

const validInput: ProviderInput = { npi: '1234567890', givenName: 'Sam', familyName: 'Lee', organizationName: 'Riverside Orthopedics' }
const ids: PractitionerIds = { practitionerId: 'pr-1', practitionerRoleId: 'role-1', organizationId: 'org-1' }

describe('buildPractitioner', () => {
  it('builds Practitioner, PractitionerRole, and Organization with correct linking', () => {
    const { practitioner, practitionerRole, organization } = buildPractitioner(validInput, ids)
    expect(practitioner.identifier?.[0].value).toBe('1234567890')
    expect(organization.name).toBe('Riverside Orthopedics')
    expect(practitionerRole.practitioner?.reference).toBe('Practitioner/pr-1')
    expect(practitionerRole.organization?.reference).toBe('Organization/org-1')
  })

  it('throws when NPI is missing', () => {
    expect(() => buildPractitioner({ ...validInput, npi: '' }, ids)).toThrow(/npi/i)
  })

  it('throws when organization name is missing', () => {
    expect(() => buildPractitioner({ ...validInput, organizationName: '' }, ids)).toThrow(/organization/i)
  })
})
