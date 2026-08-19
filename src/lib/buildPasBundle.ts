import { buildClaim } from './buildClaim'
import { buildCoverage } from './buildCoverage'
import { buildDeviceRequest } from './buildDeviceRequest'
import { buildPatient } from './buildPatient'
import { buildPractitioner } from './buildPractitioner'
import { buildFullUrl, buildRef } from './fhirRef'
import type { Bundle, BundleEntry, PasResource } from './fhirTypes'
import type { WizardFormData } from './wizardData'

function entry(resource: PasResource & { id?: string }): BundleEntry {
  if (!resource.id) throw new Error(`Resource of type ${resource.resourceType} is missing an id`)
  return { fullUrl: buildFullUrl(resource.resourceType, resource.id), resource }
}

// Assembles a Bundle conforming to profile-pas-request-bundle. Entry order
// follows the IG's own stated shape: Claim first, then the requested item,
// then supporting resources -- see http://hl7.org/fhir/us/davinci-pas/usecases.html.
export function buildPasBundle(data: WizardFormData, newId: () => string, nowIso: () => string): Bundle {
  const patientId = newId()
  const coverageId = newId()
  const payorOrganizationId = newId()
  const practitionerId = newId()
  const practitionerRoleId = newId()
  const providerOrganizationId = newId()
  const deviceRequestId = newId()
  const conditionId = newId()
  const claimId = newId()

  const patient = buildPatient(data.patient, patientId)
  const patientRef = buildRef('Patient', patientId)

  const { coverage, payorOrganization } = buildCoverage(data.coverage, {
    coverageId,
    payorOrganizationId,
    patientRef,
  })

  const { practitioner, practitionerRole, organization: providerOrganization } = buildPractitioner(data.provider, {
    practitionerId,
    practitionerRoleId,
    organizationId: providerOrganizationId,
  })

  const { deviceRequest, condition } = buildDeviceRequest(data.requestedItem, {
    deviceRequestId,
    conditionId,
    patientRef,
    requesterRef: buildRef('PractitionerRole', practitionerRoleId),
  })

  const claim = buildClaim({
    claimId,
    patientRef,
    providerRef: buildRef('Organization', providerOrganizationId),
    coverageRef: buildRef('Coverage', coverageId),
    deviceRequestRef: buildRef('DeviceRequest', deviceRequestId),
    conditionRef: buildRef('Condition', conditionId),
    createdIso: nowIso(),
    hcpcsCode: data.requestedItem.hcpcsCode,
    hcpcsDisplay: data.requestedItem.hcpcsDisplay,
    quantity: data.requestedItem.quantity,
  })

  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [
      entry(claim),
      entry(deviceRequest),
      entry(patient),
      entry(practitioner),
      entry(practitionerRole),
      entry(providerOrganization),
      entry(payorOrganization),
      entry(coverage),
      entry(condition),
    ],
  }
}
