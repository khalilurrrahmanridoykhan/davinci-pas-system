import { describe, expect, it } from 'vitest'
import { buildDeviceRequest, type DeviceRequestIds } from './buildDeviceRequest'
import type { RequestedItemInput } from './wizardData'

const validInput: RequestedItemInput = {
  hcpcsCode: 'L1833',
  hcpcsDisplay: 'Knee orthosis',
  quantity: 1,
  reasonText: 'Osteoarthritis of the knee',
  reasonIcd10Code: 'M17.9',
  reasonIcd10Display: 'Osteoarthritis of knee, unspecified',
}
const ids: DeviceRequestIds = { deviceRequestId: 'dr-1', conditionId: 'cond-1', patientRef: 'Patient/patient-1', requesterRef: 'PractitionerRole/role-1' }

describe('buildDeviceRequest', () => {
  it('builds DeviceRequest referencing the Condition, patient, and requester', () => {
    const { deviceRequest, condition } = buildDeviceRequest(validInput, ids)
    expect(deviceRequest.codeCodeableConcept.coding?.[0].code).toBe('L1833')
    expect(deviceRequest.subject.reference).toBe('Patient/patient-1')
    expect(deviceRequest.requester?.reference).toBe('PractitionerRole/role-1')
    expect(deviceRequest.reasonReference?.[0].reference).toBe('Condition/cond-1')
    expect(condition.code?.coding?.[0].code).toBe('M17.9')
  })

  it('throws when quantity is less than 1', () => {
    expect(() => buildDeviceRequest({ ...validInput, quantity: 0 }, ids)).toThrow(/quantity/i)
  })

  it('throws when reason/ICD-10 is missing', () => {
    expect(() => buildDeviceRequest({ ...validInput, reasonIcd10Code: '' }, ids)).toThrow(/reason/i)
  })
})
