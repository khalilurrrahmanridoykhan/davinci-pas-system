import type { Bundle, ClaimResponse, OperationOutcome } from './fhirTypes'

export type ParsedOutcome = 'approved' | 'pended' | 'denied' | 'error'

export interface ParsedPasResponse {
  outcome: ParsedOutcome
  reasonText?: string
  claimResponse?: ClaimResponse
  operationOutcome?: OperationOutcome
}

// The IG's own outcome field (queued/complete/error/partial) is a processing
// status, not an approved/denied decision -- the reference server communicates
// the actual disposition as free text in ClaimResponse.disposition, so that's
// what this app keys off. Anything that doesn't clearly say approved/denied
// is treated as "pended" rather than guessed, since silently defaulting to
// "approved" on an unrecognized disposition would be the wrong failure mode.
function classifyDisposition(disposition: string | undefined): ParsedOutcome {
  const text = (disposition ?? '').toLowerCase()
  if (text.includes('deny') || text.includes('denied')) return 'denied'
  if (text.includes('approv')) return 'approved'
  return 'pended'
}

export function parsePasResponse(response: Bundle<ClaimResponse | OperationOutcome> | OperationOutcome): ParsedPasResponse {
  if (response.resourceType === 'OperationOutcome') {
    const reasonText = response.issue.map((i) => i.diagnostics ?? i.details?.text).filter(Boolean).join('; ')
    return { outcome: 'error', reasonText: reasonText || undefined, operationOutcome: response }
  }

  const claimResponseEntry = response.entry.find((e) => e.resource.resourceType === 'ClaimResponse')
  const claimResponse = claimResponseEntry?.resource as ClaimResponse | undefined

  if (!claimResponse) {
    return { outcome: 'error', reasonText: 'Response bundle did not contain a ClaimResponse' }
  }

  if (claimResponse.outcome === 'error') {
    const reasonText = claimResponse.processNote?.map((n) => n.text).join('; ') || claimResponse.disposition
    return { outcome: 'error', reasonText, claimResponse }
  }

  const outcome = classifyDisposition(claimResponse.disposition)
  const reasonText = claimResponse.disposition || claimResponse.processNote?.map((n) => n.text).join('; ')
  return { outcome, reasonText, claimResponse }
}
