import type { Bundle, ClaimResponse, OperationOutcome } from './fhirTypes'

// Per the $submit OperationDefinition, the operation's only input parameter
// is a resource named "resource" -- FHIR permits POSTing that resource
// directly as the request body instead of wrapping it in a Parameters
// resource, which is what this does. Not yet live-verified against the
// reference server (see plan Phase 1 verification checklist).
export async function submitClaim(
  serverBase: string,
  requestBundle: Bundle,
): Promise<Bundle<ClaimResponse | OperationOutcome> | OperationOutcome> {
  const response = await fetch(`${serverBase}/Claim/$submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/fhir+json', Accept: 'application/fhir+json' },
    body: JSON.stringify(requestBundle),
  })

  const body = (await response.json()) as Bundle<ClaimResponse | OperationOutcome> | OperationOutcome

  if (body.resourceType !== 'Bundle' && body.resourceType !== 'OperationOutcome') {
    throw new Error(`Unexpected response resourceType: ${(body as { resourceType?: string }).resourceType}`)
  }

  return body
}
