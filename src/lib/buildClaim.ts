import type { Claim } from './fhirTypes'

export interface ClaimRefs {
  claimId: string
  patientRef: string
  providerRef: string
  coverageRef: string
  deviceRequestRef: string
  conditionRef: string
  createdIso: string
  hcpcsCode: string
  hcpcsDisplay: string
  quantity: number
}

// Synthesized, not user-entered -- boilerplate (type/use/priority) is fixed
// for this app's single supported workflow (a DME preauthorization request).
// prescription/diagnosis (rather than an ad-hoc supportingInfo link) mirror
// the reference server's own test fixture
// (src/test/resources/bundle-prior-auth.json in HL7-DaVinci/prior-auth) --
// confirmed live that its reference resolution keys off these standard
// Claim fields, not a supportingInfo-based linkage.
export function buildClaim(refs: ClaimRefs): Claim {
  return {
    resourceType: 'Claim',
    id: refs.claimId,
    meta: { profile: ['http://hl7.org/fhir/us/davinci-pas/StructureDefinition/profile-claim'] },
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'professional' }] },
    use: 'preauthorization',
    patient: { reference: refs.patientRef },
    created: refs.createdIso,
    provider: { reference: refs.providerRef },
    priority: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/processpriority', code: 'normal' }] },
    prescription: { reference: refs.deviceRequestRef },
    diagnosis: [{ sequence: 1, diagnosisReference: { reference: refs.conditionRef } }],
    insurance: [{ sequence: 1, focal: true, coverage: { reference: refs.coverageRef } }],
    item: [
      {
        sequence: 1,
        productOrService: {
          coding: [{ system: 'https://www.cms.gov/medicare/coding/hcpcsreleasecodesets', code: refs.hcpcsCode, display: refs.hcpcsDisplay }],
        },
        quantity: { value: refs.quantity },
      },
    ],
  }
}
