// Hand-written subset of FHIR R4 covering only what this app constructs or
// parses (Da Vinci PAS request/response bundles). Not a full R4 type library --
// fields the app never reads or writes are simply omitted.

export interface Coding {
  system?: string
  code?: string
  display?: string
}

export interface CodeableConcept {
  coding?: Coding[]
  text?: string
}

export interface Identifier {
  system?: string
  value?: string
}

export interface Reference {
  reference?: string
  type?: string
  display?: string
}

export interface HumanName {
  family?: string
  given?: string[]
}

export interface Period {
  start?: string
  end?: string
}

export interface Meta {
  profile?: string[]
}

export interface Patient {
  resourceType: 'Patient'
  id?: string
  identifier?: Identifier[]
  name?: HumanName[]
  gender?: 'male' | 'female' | 'other' | 'unknown'
  birthDate?: string
}

export interface Coverage {
  resourceType: 'Coverage'
  id?: string
  status: 'active'
  beneficiary: Reference
  subscriber?: Reference
  subscriberId?: string
  payor: Reference[]
  identifier?: Identifier[]
  relationship?: CodeableConcept
}

export interface Organization {
  resourceType: 'Organization'
  id?: string
  identifier?: Identifier[]
  name?: string
}

export interface Practitioner {
  resourceType: 'Practitioner'
  id?: string
  identifier?: Identifier[]
  name?: HumanName[]
}

export interface PractitionerRole {
  resourceType: 'PractitionerRole'
  id?: string
  practitioner?: Reference
  organization?: Reference
  code?: CodeableConcept[]
}

export interface Condition {
  resourceType: 'Condition'
  id?: string
  subject: Reference
  code?: CodeableConcept
}

export interface DeviceRequest {
  resourceType: 'DeviceRequest'
  id?: string
  status: 'draft'
  intent: 'order'
  codeCodeableConcept: CodeableConcept
  subject: Reference
  requester?: Reference
  reasonReference?: Reference[]
  quantityQuantity?: { value: number; unit?: string }
}

export interface ClaimInsurance {
  sequence: number
  focal: boolean
  coverage: Reference
}

export interface ClaimItem {
  sequence: number
  productOrService: CodeableConcept
  quantity?: { value: number }
}

export interface ClaimSupportingInfo {
  sequence: number
  category: CodeableConcept
  valueReference?: Reference
}

export interface ClaimDiagnosis {
  sequence: number
  diagnosisReference: Reference
}

export interface Claim {
  resourceType: 'Claim'
  id?: string
  meta?: Meta
  status: 'active'
  type: CodeableConcept
  use: 'preauthorization'
  patient: Reference
  created: string
  provider: Reference
  priority: CodeableConcept
  prescription?: Reference
  diagnosis?: ClaimDiagnosis[]
  insurance: ClaimInsurance[]
  item: ClaimItem[]
  supportingInfo?: ClaimSupportingInfo[]
}

export interface AdjudicationDetail {
  category: CodeableConcept
  reason?: CodeableConcept
}

export interface ClaimResponseItem {
  itemSequence: number
  adjudication: AdjudicationDetail[]
}

export interface ClaimResponse {
  resourceType: 'ClaimResponse'
  id?: string
  meta?: Meta
  status: 'active'
  type: CodeableConcept
  use: 'preauthorization'
  patient: Reference
  created: string
  insurer: Reference
  request: Reference
  outcome: 'queued' | 'complete' | 'error' | 'partial'
  disposition?: string
  item?: ClaimResponseItem[]
  processNote?: { text: string }[]
}

export interface OperationOutcomeIssue {
  severity: 'fatal' | 'error' | 'warning' | 'information'
  code: string
  diagnostics?: string
  details?: CodeableConcept
}

export interface OperationOutcome {
  resourceType: 'OperationOutcome'
  issue: OperationOutcomeIssue[]
}

export type PasResource =
  | Patient
  | Coverage
  | Organization
  | Practitioner
  | PractitionerRole
  | Condition
  | DeviceRequest
  | Claim
  | ClaimResponse
  | OperationOutcome

export interface BundleEntry<T = PasResource> {
  fullUrl: string
  resource: T
}

export interface Bundle<T = PasResource> {
  resourceType: 'Bundle'
  type: 'collection'
  entry: BundleEntry<T>[]
}
