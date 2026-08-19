import { useState } from 'react'
import { EMPTY_WIZARD_FORM_DATA, type WizardFormData } from '../lib/wizardData'

export type WizardStep = 'patient-coverage' | 'provider' | 'requested-item' | 'review' | 'result'

const STEP_ORDER: WizardStep[] = ['patient-coverage', 'provider', 'requested-item', 'review', 'result']

export interface UsePasWizardStateResult {
  step: WizardStep
  data: WizardFormData
  updatePatient: (patch: Partial<WizardFormData['patient']>) => void
  updateCoverage: (patch: Partial<WizardFormData['coverage']>) => void
  updateProvider: (patch: Partial<WizardFormData['provider']>) => void
  updateRequestedItem: (patch: Partial<WizardFormData['requestedItem']>) => void
  goNext: () => void
  goBack: () => void
  goToStep: (step: WizardStep) => void
  reset: () => void
}

export function usePasWizardState(): UsePasWizardStateResult {
  const [step, setStep] = useState<WizardStep>('patient-coverage')
  const [data, setData] = useState<WizardFormData>(EMPTY_WIZARD_FORM_DATA)

  function goNext() {
    const idx = STEP_ORDER.indexOf(step)
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1])
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step)
    if (idx > 0) setStep(STEP_ORDER[idx - 1])
  }

  function reset() {
    setData(EMPTY_WIZARD_FORM_DATA)
    setStep('patient-coverage')
  }

  return {
    step,
    data,
    updatePatient: (patch) => setData((prev) => ({ ...prev, patient: { ...prev.patient, ...patch } })),
    updateCoverage: (patch) => setData((prev) => ({ ...prev, coverage: { ...prev.coverage, ...patch } })),
    updateProvider: (patch) => setData((prev) => ({ ...prev, provider: { ...prev.provider, ...patch } })),
    updateRequestedItem: (patch) => setData((prev) => ({ ...prev, requestedItem: { ...prev.requestedItem, ...patch } })),
    goNext,
    goBack,
    goToStep: setStep,
    reset,
  }
}
