import { buildRef } from './fhirRef'
import type { Condition, DeviceRequest } from './fhirTypes'
import type { RequestedItemInput } from './wizardData'

export interface DeviceRequestIds {
  deviceRequestId: string
  conditionId: string
  patientRef: string
  requesterRef: string
}

export function buildDeviceRequest(
  input: RequestedItemInput,
  ids: DeviceRequestIds,
): { deviceRequest: DeviceRequest; condition: Condition } {
  if (!input.hcpcsCode.trim()) {
    throw new Error('HCPCS code is required')
  }
  if (!input.quantity || input.quantity < 1) {
    throw new Error('Quantity must be at least 1')
  }
  if (!input.reasonText.trim() || !input.reasonIcd10Code.trim()) {
    throw new Error('Reason for request (with an ICD-10 code) is required')
  }

  const condition: Condition = {
    resourceType: 'Condition',
    id: ids.conditionId,
    subject: { reference: ids.patientRef },
    code: {
      coding: [{ system: 'http://hl7.org/fhir/sid/icd-10-cm', code: input.reasonIcd10Code, display: input.reasonIcd10Display }],
      text: input.reasonText,
    },
  }

  const deviceRequest: DeviceRequest = {
    resourceType: 'DeviceRequest',
    id: ids.deviceRequestId,
    status: 'draft',
    intent: 'order',
    codeCodeableConcept: {
      coding: [{ system: 'https://www.cms.gov/medicare/coding/hcpcsreleasecodesets', code: input.hcpcsCode, display: input.hcpcsDisplay }],
    },
    subject: { reference: ids.patientRef },
    requester: { reference: ids.requesterRef },
    reasonReference: [{ reference: buildRef('Condition', ids.conditionId) }],
    quantityQuantity: { value: input.quantity },
  }

  return { deviceRequest, condition }
}
