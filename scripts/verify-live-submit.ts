// Manual verification script -- exercises the real buildPasBundle ->
// submitClaim -> parsePasResponse path against the live reference server,
// bypassing the UI. Not part of the app build. Kept (not deleted) since no
// browser automation tool was available in this session to click through
// the wizard directly -- this is the actual evidence the integration works,
// confirmed live: a real submit returned a ClaimResponse with
// outcome=queued/disposition=Pending, correctly parsed as 'pended'.
// Run with: npx tsx scripts/verify-live-submit.ts
import { buildPasBundle } from '../src/lib/buildPasBundle'
import { newId, nowIso } from '../src/lib/ids'
import { parsePasResponse } from '../src/lib/parsePasResponse'
import { submitClaim } from '../src/lib/pasClient'
import { validatePasBundle } from '../src/lib/validatePasBundle'
import type { WizardFormData } from '../src/lib/wizardData'

const validData: WizardFormData = {
  patient: { givenName: 'Jane', familyName: 'Doe', birthDate: '1980-05-12', gender: 'female', memberId: 'MBR-001' },
  coverage: { payorName: 'Acme Health Plan', payorId: 'PAYOR-1', subscriberId: 'SUB-1' },
  provider: { npi: '1234567890', givenName: 'Sam', familyName: 'Lee', organizationName: 'Riverside Orthopedics' },
  requestedItem: {
    hcpcsCode: 'L1833',
    hcpcsDisplay: 'Knee orthosis, adjustable knee joints, with condylar pads',
    quantity: 1,
    reasonText: 'Osteoarthritis of the knee',
    reasonIcd10Code: 'M17.9',
    reasonIcd10Display: 'Osteoarthritis of knee, unspecified',
  },
}

async function main() {
  const bundle = buildPasBundle(validData, newId, nowIso)
  const problems = validatePasBundle(bundle)
  console.log('validation problems:', problems)
  if (problems.length > 0) {
    console.log(JSON.stringify(bundle, null, 2))
    return
  }

  console.log('--- submitting to https://pas.krrkhan.com/fhir/Claim/$submit ---')
  try {
    const response = await submitClaim('https://pas.krrkhan.com/fhir', bundle)
    console.log('--- raw response ---')
    console.log(JSON.stringify(response, null, 2))
    console.log('--- parsed ---')
    console.log(parsePasResponse(response))
  } catch (err) {
    console.error('submit failed:', err)
  }
}

main()
