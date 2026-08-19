import { useCallback, useState } from 'react'
import { PAS_SERVER_BASE } from '../lib/config'
import type { Bundle } from '../lib/fhirTypes'
import { parsePasResponse, type ParsedPasResponse } from '../lib/parsePasResponse'
import { submitClaim } from '../lib/pasClient'

export interface UseSubmitClaimResult {
  submitting: boolean
  error: string | null
  result: ParsedPasResponse | null
  submit: (bundle: Bundle) => Promise<void>
}

export function useSubmitClaim(): UseSubmitClaimResult {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ParsedPasResponse | null>(null)

  const submit = useCallback(async (bundle: Bundle) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await submitClaim(PAS_SERVER_BASE, bundle)
      setResult(parsePasResponse(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }, [])

  return { submitting, error, result, submit }
}
