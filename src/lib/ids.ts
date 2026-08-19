// Real implementations injected into buildPasBundle at the call site --
// kept separate so tests can pass deterministic fakes instead.
export function newId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}
