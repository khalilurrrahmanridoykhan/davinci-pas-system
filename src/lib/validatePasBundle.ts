import type { Bundle } from './fhirTypes'

// Lightweight structural pre-flight checks only -- NOT full FHIR profile or
// terminology validation (see README tradeoffs). Returns a list of problems;
// empty means "looks structurally sound enough to submit."
export function validatePasBundle(bundle: Bundle): string[] {
  const problems: string[] = []

  const byType = new Map<string, number>()
  for (const e of bundle.entry) {
    byType.set(e.resource.resourceType, (byType.get(e.resource.resourceType) ?? 0) + 1)
  }

  const claimCount = byType.get('Claim') ?? 0
  if (claimCount !== 1) problems.push(`Bundle must contain exactly one Claim (found ${claimCount})`)

  for (const required of ['Patient', 'Coverage', 'DeviceRequest'] as const) {
    if (!byType.has(required)) problems.push(`Bundle is missing a required ${required} resource`)
  }

  const fullUrls = bundle.entry.map((e) => e.fullUrl)
  const duplicates = fullUrls.filter((url, i) => fullUrls.indexOf(url) !== i)
  if (duplicates.length > 0) problems.push(`Bundle has duplicate fullUrls: ${[...new Set(duplicates)].join(', ')}`)

  // References in this app's bundles are {ResourceType}/{id} (see fhirRef.ts
  // for why -- the reference server rejects urn:uuid: refs), so a "known"
  // reference is any entry's own resourceType/id pair, not its fullUrl.
  const knownRefs = new Set(bundle.entry.map((e) => `${e.resource.resourceType}/${(e.resource as { id?: string }).id}`))
  const danglingRefs = new Set<string>()
  function walk(value: unknown): void {
    if (value === null || typeof value !== 'object') return
    for (const [key, v] of Object.entries(value)) {
      if (key === 'reference' && typeof v === 'string' && /^[A-Z][A-Za-z]*\//.test(v) && !knownRefs.has(v)) {
        danglingRefs.add(v)
      } else {
        walk(v)
      }
    }
  }
  for (const e of bundle.entry) walk(e.resource)
  if (danglingRefs.size > 0) problems.push(`Bundle has references to resources not included: ${[...danglingRefs].join(', ')}`)

  return problems
}
