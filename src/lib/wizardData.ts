// Form-facing input shapes the wizard collects. Deliberately separate from
// fhirTypes.ts -- these are what a human fills in, not what gets sent.

export interface PatientInput {
  givenName: string
  familyName: string
  birthDate: string // YYYY-MM-DD
  gender: 'male' | 'female' | 'other' | 'unknown'
  memberId: string
}

export interface CoverageInput {
  payorName: string
  payorId: string
  subscriberId: string
}

export interface ProviderInput {
  npi: string
  givenName: string
  familyName: string
  organizationName: string
}

// HCPCS L1833 (knee orthosis) is the seeded default -- see buildDeviceRequest.ts.
export interface RequestedItemInput {
  hcpcsCode: string
  hcpcsDisplay: string
  quantity: number
  reasonText: string
  reasonIcd10Code: string
  reasonIcd10Display: string
}

export interface WizardFormData {
  patient: PatientInput
  coverage: CoverageInput
  provider: ProviderInput
  requestedItem: RequestedItemInput
}

export const HCPCS_OPTIONS: { code: string; display: string }[] = [
  { code: 'L1833', display: 'Knee orthosis, adjustable knee joints, with condylar pads' },
]

export const EMPTY_WIZARD_FORM_DATA: WizardFormData = {
  patient: { givenName: '', familyName: '', birthDate: '', gender: 'unknown', memberId: '' },
  coverage: { payorName: '', payorId: '', subscriberId: '' },
  provider: { npi: '', givenName: '', familyName: '', organizationName: '' },
  requestedItem: {
    hcpcsCode: HCPCS_OPTIONS[0].code,
    hcpcsDisplay: HCPCS_OPTIONS[0].display,
    quantity: 1,
    reasonText: '',
    reasonIcd10Code: '',
    reasonIcd10Display: '',
  },
}
