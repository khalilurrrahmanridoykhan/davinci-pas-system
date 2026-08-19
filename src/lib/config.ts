// The reference payer server's FHIR base URL. Defaults to the reverse-proxied
// path on pas.krrkhan.com (the live, self-hosted HL7-DaVinci/prior-auth
// instance) since local Docker isn't available in this dev environment --
// override with VITE_PAS_SERVER_BASE for a different target.
export const PAS_SERVER_BASE: string =
  (import.meta.env.VITE_PAS_SERVER_BASE as string | undefined) ?? 'https://pas.krrkhan.com/fhir'
