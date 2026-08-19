// The reference server (HL7-DaVinci/prior-auth) resolves Bundle-local
// references by splitting on '/' into {ResourceType}/{id} -- confirmed live
// by testing urn:uuid: references, which it rejects with "Unknown resource
// type urn:uuid:...". Its own test fixture (src/test/resources/bundle-prior-
// auth.json) confirms {ResourceType}/{id} is the expected shape, so that's
// what this app uses instead of the more common urn:uuid: bundle-local form.
export function buildRef(resourceType: string, id: string): string {
  return `${resourceType}/${id}`
}

export function buildFullUrl(resourceType: string, id: string): string {
  return `https://pas.krrkhan.com/fhir/${resourceType}/${id}`
}
