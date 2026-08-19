import { describe, expect, it } from 'vitest'
import { parsePasResponse } from './parsePasResponse'
import type { Bundle, ClaimResponse, OperationOutcome } from './fhirTypes'

function claimResponseBundle(cr: Partial<ClaimResponse>): Bundle<ClaimResponse> {
  const base: ClaimResponse = {
    resourceType: 'ClaimResponse',
    status: 'active',
    type: { coding: [{ code: 'professional' }] },
    use: 'preauthorization',
    patient: { reference: 'urn:uuid:patient-1' },
    created: '2026-08-19T00:00:00Z',
    insurer: { reference: 'urn:uuid:org-1' },
    request: { reference: 'urn:uuid:claim-1' },
    outcome: 'complete',
    ...cr,
  }
  return { resourceType: 'Bundle', type: 'collection', entry: [{ fullUrl: 'urn:uuid:cr-1', resource: base }] }
}

describe('parsePasResponse', () => {
  it('parses an approved disposition', () => {
    const result = parsePasResponse(claimResponseBundle({ disposition: 'Approved' }))
    expect(result.outcome).toBe('approved')
    expect(result.reasonText).toBe('Approved')
  })

  it('parses a denied disposition', () => {
    const result = parsePasResponse(claimResponseBundle({ disposition: 'Denied - not medically necessary' }))
    expect(result.outcome).toBe('denied')
  })

  it('treats an unrecognized disposition as pended, not approved', () => {
    const result = parsePasResponse(claimResponseBundle({ disposition: 'Under review' }))
    expect(result.outcome).toBe('pended')
  })

  it('parses a ClaimResponse-level error outcome as error', () => {
    const result = parsePasResponse(claimResponseBundle({ outcome: 'error', processNote: [{ text: 'Invalid coverage' }] }))
    expect(result.outcome).toBe('error')
    expect(result.reasonText).toBe('Invalid coverage')
  })

  it('parses a bare OperationOutcome as error', () => {
    const oo: OperationOutcome = { resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'invalid', diagnostics: 'Missing Coverage' }] }
    const result = parsePasResponse(oo)
    expect(result.outcome).toBe('error')
    expect(result.reasonText).toBe('Missing Coverage')
  })

  it('errors when the response bundle has no ClaimResponse at all', () => {
    const empty: Bundle<ClaimResponse> = { resourceType: 'Bundle', type: 'collection', entry: [] }
    const result = parsePasResponse(empty)
    expect(result.outcome).toBe('error')
  })
})
